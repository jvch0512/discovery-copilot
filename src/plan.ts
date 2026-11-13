import { BANK, COMMERCIAL, REG_QUESTIONS } from "./questions.js";
import { MEASURE_INFO } from "./data.js";
import { scope } from "./scope.js";
import type { Scope } from "./scope.js";
import { MEASURES } from "./types.js";
import type { L, Measure, Profile } from "./types.js";

const l = (en: string, es: string): L => ({ en, es });

export type Level = "none" | "unknown" | "partial" | "solid";
export interface Gap { measure: Measure; ref: string; name: L; level: Level; score: number }
export interface PlannedQuestion { id: string; section: "regulatory" | "gap" | "validate" | "commercial"; text: L; why: L; redFlag?: L; priority: "high" | "medium" | "low" }
export interface DemoStep { title: L; show: L; ties: L }
export interface Plan { scope: Scope; gaps: Gap[]; questions: PlannedQuestion[]; demo: DemoStep[] }

const WEIGHT: Record<Measure, number> = { a: 1, b: 1.3, c: 1.3, d: 1.1, e: 1, f: 0.8, g: 0.9, h: 0.7, i: 1.1, j: 1.3 };
const BASE: Record<Level, number> = { none: 3, unknown: 2.4, partial: 1.5, solid: 0.3 };

export function levelOf(p: Profile, m: Measure): Level {
  const v = p.maturity?.[m];
  return v === 0 ? "none" : v === 1 ? "partial" : v === 2 ? "solid" : "unknown";
}

export function gaps(p: Profile): Gap[] {
  return MEASURES.map((m) => {
    const info = MEASURE_INFO.find((x) => x.key === m)!;
    const level = levelOf(p, m);
    return { measure: m, ref: info.ref, name: info.name, level, score: Math.round(BASE[level] * WEIGHT[m] * 100) / 100 };
  }).sort((a, b) => b.score - a.score || a.measure.localeCompare(b.measure));
}

const prio = (g: Gap): "high" | "medium" | "low" => (g.score >= 2.4 ? "high" : g.score >= 1.2 ? "medium" : "low");

export function plan(p: Profile, topGaps = 3): Plan {
  const sc = scope(p);
  const gs = gaps(p);
  const qs: PlannedQuestion[] = [];

  const conds = new Set<string>();
  if (sc.nis2.status === "essential" || sc.nis2.status === "important" || sc.nis2.status === "check") conds.add("nis2");
  if (sc.nis2.status === "out") conds.add("nis2-out");
  if (sc.dora.applies === "yes") conds.add("dora");
  if (p.ictProviderToFinancial) conds.add("dora-ict");
  if (sc.ens.applies === "yes") conds.add("ens");
  if (sc.gdpr.applies === "yes") conds.add("gdpr");
  for (const r of REG_QUESTIONS) if (conds.has(r.when)) qs.push({ id: r.id, section: "regulatory", text: r.text, why: r.why, priority: "high" });

  const top = gs.slice(0, topGaps);
  for (const g of top) {
    const b = BANK[g.measure];
    b.questions.forEach((q, i) => qs.push({ id: `${g.measure}-${i + 1}`, section: "gap", text: q, why: l(`NIS2 Art. ${g.ref}: ${g.name.en}.`, `NIS2 Art. ${g.ref}: ${g.name.es}.`), redFlag: i === 0 ? b.redFlag : undefined, priority: prio(g) }));
  }
  for (const g of gs.slice(topGaps)) {
    const b = BANK[g.measure];
    qs.push({ id: `${g.measure}-1`, section: "validate", text: b.questions[0]!, why: l(`NIS2 Art. ${g.ref}: ${g.name.en}.`, `NIS2 Art. ${g.ref}: ${g.name.es}.`), redFlag: b.redFlag, priority: prio(g) === "high" ? "medium" : "low" });
  }
  for (const c of COMMERCIAL) qs.push({ id: c.id, section: "commercial", text: c.text, why: c.why, priority: "medium" });

  const demo: DemoStep[] = [];
  const stake = sc.nis2.status === "essential" || sc.nis2.status === "important"
    ? l("Open with their status and the two clocks, in their own terms.", "Abra con su condición y los dos relojes, en sus propios términos.")
    : l("Open with the pressure they do face: customers, tenders or sector rules.", "Abra con la presión que sí tienen: clientes, licitaciones o normas sectoriales.");
  demo.push({ title: l("The stakes", "Lo que está en juego"), show: stake, ties: l(sc.nis2.headline.en, sc.nis2.headline.es) });
  for (const g of top) {
    const b = BANK[g.measure];
    demo.push({ title: b.demo.title, show: b.demo.show, ties: l(`Closes the gap on NIS2 Art. ${g.ref}: ${g.name.en}.`, `Cierra la brecha del art. ${g.ref} de NIS2: ${g.name.es}.`) });
  }
  demo.push({ title: l("The next step", "El siguiente paso"), show: l("Agree the success measure, the owner and a date for a scoped pilot or proposal.", "Acordar la medida de éxito, el responsable y una fecha para un piloto acotado o una propuesta."), ties: l("Hand over to proposal and ROI work (presales-studio).", "Pasar al trabajo de propuesta y ROI (presales-studio).") });
  return { scope: sc, gaps: gs, questions: qs, demo };
}
