import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { scope, sizeClass, nis2 } from "../src/scope.js";
import { gaps, plan } from "../src/plan.js";
import { parseProfile } from "../src/parse.js";
import { briefMarkdown } from "../src/report.js";
import { BANK, COMMERCIAL, REG_QUESTIONS } from "../src/questions.js";
import { MEASURES } from "../src/types.js";
import type { Profile } from "../src/types.js";

const base: Profile = { country: "ES", sector: "food", employees: 180, turnoverMEur: 40, balanceSheetMEur: 35 };
const P = (o: Partial<Profile>): Profile => ({ ...base, ...o });

test("size classes follow the 2003/361 ceilings", () => {
  assert.equal(sizeClass(P({ employees: 5, turnoverMEur: 1, balanceSheetMEur: 1 })), "micro");
  assert.equal(sizeClass(P({ employees: 30, turnoverMEur: 8, balanceSheetMEur: 8 })), "small");
  assert.equal(sizeClass(P({ employees: 50, turnoverMEur: 5, balanceSheetMEur: 5 })), "medium");
  assert.equal(sizeClass(P({ employees: 20, turnoverMEur: 12, balanceSheetMEur: 11 })), "medium");
  assert.equal(sizeClass(P({ employees: 250, turnoverMEur: 5, balanceSheetMEur: 5 })), "large");
  assert.equal(sizeClass(P({ employees: 100, turnoverMEur: 60, balanceSheetMEur: 50 })), "large");
  assert.equal(sizeClass(P({ employees: 100, turnoverMEur: 60, balanceSheetMEur: 20 })), "medium");
});

test("NIS2: annex I large essential, medium important", () => {
  assert.equal(nis2(P({ sector: "energy", employees: 400 })).status, "essential");
  assert.equal(nis2(P({ sector: "energy", employees: 100 })).status, "important");
});

test("NIS2: annex II large and medium are important, never essential", () => {
  assert.equal(nis2(P({ sector: "food", employees: 400 })).status, "important");
  assert.equal(nis2(P({ sector: "food", employees: 100 })).status, "important");
});

test("NIS2: below the size cap is out, with supply chain advice", () => {
  const r = nis2(P({ sector: "energy", employees: 8, turnoverMEur: 1, balanceSheetMEur: 1 }));
  assert.equal(r.status, "out");
  assert.ok(r.points.some((x) => x.en.includes("supply chain")));
});

test("NIS2: size independent entities", () => {
  const tiny = { employees: 3, turnoverMEur: 0.5, balanceSheetMEur: 0.5 };
  assert.equal(nis2(P({ ...tiny, sector: "digital-infra", special: ["dns-provider"] })).status, "essential");
  assert.equal(nis2(P({ ...tiny, sector: "digital-infra", special: ["tld-registry"] })).status, "essential");
  assert.equal(nis2(P({ ...tiny, sector: "digital-infra", special: ["qualified-trust-service"] })).status, "essential");
  assert.equal(nis2(P({ ...tiny, sector: "digital-infra", special: ["public-comm-service"] })).status, "important");
  assert.equal(nis2(P({ sector: "digital-infra", special: ["public-comm-network"] })).status, "essential");
  assert.equal(nis2(P({ ...tiny, sector: "public-admin", special: ["central-gov"] })).status, "essential");
  assert.equal(nis2(P({ ...tiny, sector: "other", special: ["cer-critical"] })).status, "essential");
  assert.equal(nis2(P({ ...tiny, sector: "other", special: ["sole-national-provider"] })).status, "check");
});

test("NIS2: sector outside the annexes is out; insurance is not an annex sector", () => {
  assert.equal(nis2(P({ sector: "other" })).status, "out");
  assert.equal(nis2(P({ sector: "insurance", employees: 500 })).status, "out");
});

test("NIS2: group and near-threshold caveats appear", () => {
  const g = nis2(P({ partOfLargerGroup: true }));
  assert.ok(g.points.some((x) => x.en.includes("larger group")));
  const n = nis2(P({ employees: 48 }));
  assert.ok(n.points.some((x) => x.en.includes("15 percent")));
  const far = nis2(P({ employees: 180, turnoverMEur: 30, balanceSheetMEur: 25 }));
  assert.ok(!far.points.some((x) => x.en.includes("15 percent")));
});

test("NIS2: fines are stated per status", () => {
  assert.ok(nis2(P({ sector: "energy", employees: 400 })).points.some((x) => x.en.includes("EUR 10 million or 2 percent")));
  assert.ok(nis2(P({ sector: "food" })).points.some((x) => x.en.includes("EUR 7 million or 1.4 percent")));
});

test("Spain status caveat is present for ES and generic for others", () => {
  assert.ok(nis2(P({})).points.some((x) => x.en.includes("Real Decreto-ley 12/2018")));
  const de = nis2(P({ country: "DE" }));
  assert.ok(de.points.some((x) => x.en.includes("transposition law")));
  assert.ok(!de.points.some((x) => x.en.includes("Spain")));
});

test("DORA and ENS and GDPR applicability", () => {
  assert.equal(scope(P({ financialEntity: true })).dora.applies, "yes");
  assert.equal(scope(P({ ictProviderToFinancial: true })).dora.applies, "check");
  assert.equal(scope(P({})).dora.applies, "no");
  assert.equal(scope(P({ publicSectorLink: "public-body" })).ens.applies, "yes");
  assert.equal(scope(P({ publicSectorLink: "supplier" })).ens.applies, "yes");
  assert.equal(scope(P({ publicSectorLink: "none" })).ens.applies, "no");
  assert.equal(scope(P({ country: "DE", publicSectorLink: "supplier" })).ens.applies, "no");
  assert.equal(scope(P({})).gdpr.applies, "yes");
  assert.equal(scope(P({ processesPersonalData: false })).gdpr.applies, "no");
});

test("financial entity flags lex specialis", () => {
  assert.equal(nis2(P({ sector: "banking", employees: 500, financialEntity: true })).lexSpecialis, true);
  assert.equal(nis2(P({ sector: "energy", employees: 500 })).lexSpecialis, false);
});

test("gap ranking: none beats unknown beats partial beats solid", () => {
  const g = gaps(P({ maturity: { a: 0, b: 1, c: 2 } }));
  const rank = (m: string) => g.findIndex((x) => x.measure === m);
  assert.ok(rank("a") < rank("d"));
  assert.ok(rank("d") < rank("b") || rank("j") < rank("b"));
  assert.ok(rank("b") < rank("c"));
  assert.equal(g.length, 10);
});

test("gap weights break ties between equal maturity", () => {
  const g = gaps(P({ maturity: {} }));
  assert.equal(g[0]!.level, "unknown");
  assert.ok(["b", "c", "j"].includes(g[0]!.measure));
  assert.equal(g[9]!.measure, "h");
});

test("question bank is complete in both languages with no em dashes", () => {
  for (const m of MEASURES) {
    const b = BANK[m];
    assert.equal(b.questions.length, 3);
    for (const q of [...b.questions, b.redFlag, b.demo.title, b.demo.show]) { assert.ok(q.en.length > 10); assert.ok(q.es.length > 10); }
  }
  const all = JSON.stringify([BANK, REG_QUESTIONS, COMMERCIAL]);
  assert.ok(!all.includes("—"));
});

test("plan: questions follow scope and gaps", () => {
  const pl = plan(parseProfile(JSON.parse(readFileSync("examples/msp-es.json", "utf8"))));
  const ids = pl.questions.map((q) => q.id);
  assert.ok(ids.includes("reg-n-1") && ids.includes("reg-d-4") && ids.includes("reg-e-1") && ids.includes("reg-g-1"));
  assert.ok(!ids.includes("reg-d-1"));
  assert.ok(!ids.includes("reg-n-4"));
  assert.equal(pl.questions.filter((q) => q.section === "gap").length, 9);
  assert.equal(pl.questions.filter((q) => q.section === "validate").length, 7);
  assert.equal(pl.questions.filter((q) => q.section === "commercial").length, 5);
  assert.equal(new Set(ids).size, ids.length);
});

test("plan: out of scope entities get the supply chain question, not NIS2 duties", () => {
  const pl = plan(parseProfile(JSON.parse(readFileSync("examples/local-shop-es.json", "utf8"))));
  const ids = pl.questions.map((q) => q.id);
  assert.ok(ids.includes("reg-n-4"));
  assert.ok(!ids.includes("reg-n-1"));
  assert.equal(pl.scope.nis2.obligations.length, 0);
});

test("plan: demo has stakes, one beat per top gap and a handover", () => {
  const pl = plan(parseProfile(JSON.parse(readFileSync("examples/payments-es.json", "utf8"))));
  assert.equal(pl.demo.length, 5);
  assert.ok(pl.demo.at(-1)!.ties.en.includes("presales-studio"));
});

test("parse rejects bad input", () => {
  assert.throws(() => parseProfile(null), /object/);
  assert.throws(() => parseProfile({ ...base, country: "Spain" }), /country/);
  assert.throws(() => parseProfile({ ...base, sector: "nope" }), /sector/);
  assert.throws(() => parseProfile({ ...base, employees: -1 }), /employees/);
  assert.throws(() => parseProfile({ ...base, special: ["x"] }), /special/);
  assert.throws(() => parseProfile({ ...base, maturity: { z: 1 } }), /maturity key/);
  assert.throws(() => parseProfile({ ...base, maturity: { a: 5 } }), /maturity a/);
  assert.throws(() => parseProfile({ ...base, financialEntity: "yes" }), /financialEntity/);
});

test("parse normalises country and truncates name", () => {
  const p = parseProfile({ ...base, country: "es", name: "x".repeat(500) });
  assert.equal(p.country, "ES");
  assert.equal(p.name!.length, 120);
});

test("report renders in both languages", () => {
  const p = parseProfile(JSON.parse(readFileSync("examples/food-maker-es.json", "utf8")));
  const en = briefMarkdown(p, "en");
  const es = briefMarkdown(p, "es");
  assert.ok(en.includes("## Regulatory scope") && en.includes("important entity"));
  assert.ok(es.includes("## Ámbito regulatorio") && es.includes("entidad importante"));
  assert.ok(!en.includes("—") && !es.includes("—"));
});

test("report: the heading keeps the company name verbatim", () => {
  const p = parseProfile({ ...base, name: "A | B" });
  assert.ok(briefMarkdown(p, "en").startsWith("# Discovery brief: A | B"));
});

test("cli: prints a brief, json, and exit codes", () => {
  const run = (...a: string[]) => spawnSync("node", ["dist/src/cli.js", ...a], { encoding: "utf8" });
  const ok = run("examples/msp-es.json");
  assert.equal(ok.status, 0);
  assert.ok(ok.stdout.includes("important entity"));
  const es = run("--lang", "es", "examples/msp-es.json");
  assert.ok(es.stdout.includes("entidad importante"));
  const js = run("--json", "examples/msp-es.json");
  assert.equal(JSON.parse(js.stdout).scope.nis2.status, "important");
  assert.equal(run().status, 2);
  assert.equal(run("--lang", "fr", "examples/msp-es.json").status, 2);
  assert.equal(run("--bogus").status, 2);
  assert.equal(run("nonexistent.json").status, 2);
});
