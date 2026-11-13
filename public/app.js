import { plan } from "/lib/plan.js";
import { briefMarkdown } from "/lib/report.js";
import { SECTORS } from "/lib/data.js";
import { MEASURES } from "/lib/types.js";
import { MEASURE_INFO } from "/lib/data.js";

const $ = (id) => document.getElementById(id);
const UI = {
  en: { sub: "Pre-sales discovery prep for security. Enter a company profile and get its NIS2, DORA, ENS and GDPR scope, a ranked gap list, discovery questions and a demo storyline. Runs in this tab, nothing is uploaded.", lang: "Language", ex: "Example", co: "Company", name: "Name", country: "Country", sector: "Sector", emp: "Employees", turn: "Turnover (MEUR)", bal: "Balance sheet (MEUR)", pub: "Public sector link", pubOpts: ["None", "Supplier to the Spanish public sector", "Public body"], mat: "Current maturity per NIS2 Art. 21(2) measure", hintMat: "Leave as unknown if you have not discovered it yet. Unknown counts as a gap to explore.", mats: ["Unknown", "None", "Partial", "Solid"], gaps: "Gap ranking", demo: "Demo storyline", qs: "Discovery questions", md: "Brief (markdown)", copy: "Copy", copied: "Copied", red: "Red flag", why: "Why", checks: { financialEntity: "Financial entity (bank, insurer, payments, crypto)", ictProviderToFinancial: "ICT provider to financial entities", processesPersonalData: "Processes personal data", partOfLargerGroup: "Part of a larger group", "dns-provider": "DNS provider", "tld-registry": "TLD registry", "qualified-trust-service": "Qualified trust service", "public-comm-network": "Public comms network", "public-comm-service": "Public comms service", "central-gov": "Central government", "cer-critical": "CER critical entity", "sole-national-provider": "Sole national provider" }, status: { essential: "Essential entity", important: "Important entity", out: "Out of scope", check: "Check designation" }, applies: { yes: "Applies", no: "Does not apply", check: "Check" }, lvl: { none: "none", unknown: "unknown", partial: "partial", solid: "solid" }, sec: { regulatory: "Regulatory", gap: "Top gaps", validate: "Validate the rest", commercial: "Commercial" }, details: "Details" },
  es: { sub: "Preparación de discovery comercial para ciberseguridad. Introduzca el perfil de una empresa y obtenga su ámbito NIS2, DORA, ENS y RGPD, un ranking de brechas, preguntas de discovery y un guion de demo. Se ejecuta en esta pestaña, no se sube nada.", lang: "Idioma", ex: "Ejemplo", co: "Empresa", name: "Nombre", country: "País", sector: "Sector", emp: "Empleados", turn: "Facturación (MEUR)", bal: "Balance (MEUR)", pub: "Vínculo con el sector público", pubOpts: ["Ninguno", "Proveedor del sector público español", "Entidad pública"], mat: "Madurez actual por medida del art. 21(2) de NIS2", hintMat: "Déjelo en desconocida si aún no lo ha descubierto. Desconocida cuenta como brecha por explorar.", mats: ["Desconocida", "Ninguna", "Parcial", "Sólida"], gaps: "Ranking de brechas", demo: "Guion de demo", qs: "Preguntas de discovery", md: "Informe (markdown)", copy: "Copiar", copied: "Copiado", red: "Señal de alarma", why: "Por qué", checks: { financialEntity: "Entidad financiera (banco, aseguradora, pagos, cripto)", ictProviderToFinancial: "Proveedor TIC de entidades financieras", processesPersonalData: "Trata datos personales", partOfLargerGroup: "Parte de un grupo mayor", "dns-provider": "Proveedor DNS", "tld-registry": "Registro TLD", "qualified-trust-service": "Servicio de confianza cualificado", "public-comm-network": "Red de comunicaciones pública", "public-comm-service": "Servicio de comunicaciones público", "central-gov": "Administración central", "cer-critical": "Entidad crítica CER", "sole-national-provider": "Único proveedor nacional" }, status: { essential: "Entidad esencial", important: "Entidad importante", out: "Fuera del ámbito", check: "Revisar designación" }, applies: { yes: "Aplica", no: "No aplica", check: "Revisar" }, lvl: { none: "ninguna", unknown: "desconocida", partial: "parcial", solid: "sólida" }, sec: { regulatory: "Regulatorio", gap: "Brechas principales", validate: "Validar el resto", commercial: "Comercial" }, details: "Detalle" },
};
const EXAMPLES = ["msp-es", "payments-es", "food-maker-es", "local-shop-es"];
const SPECIALS = ["dns-provider", "tld-registry", "qualified-trust-service", "public-comm-network", "public-comm-service", "central-gov", "cer-critical", "sole-national-provider"];
const BOOLS = ["financialEntity", "ictProviderToFinancial", "processesPersonalData", "partOfLargerGroup"];
let lang = "en";

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

function buildStatic() {
  const u = UI[lang];
  document.documentElement.lang = lang;
  const set = (id, v) => { $(id).textContent = v; };
  set("sub", u.sub); set("l-lang", u.lang); set("l-ex", u.ex); set("h-co", u.co); set("l-name", u.name); set("l-country", u.country);
  set("l-sector", u.sector); set("l-emp", u.emp); set("l-turn", u.turn); set("l-bal", u.bal); set("l-pub", u.pub);
  set("h-mat", u.mat); set("hint-mat", u.hintMat); set("h-gaps", u.gaps); set("h-demo", u.demo); set("h-qs", u.qs); set("h-md", u.md); set("copy", u.copy);
  [...$("pub").options].forEach((o, i) => { o.textContent = u.pubOpts[i]; });
  const sec = $("sector"); const keep = sec.value;
  sec.replaceChildren(...SECTORS.map((s) => { const o = el("option", s.label[lang]); o.value = s.key; return o; }));
  if (keep) sec.value = keep;
  const ex = $("ex"); const keepEx = ex.value;
  ex.replaceChildren(...EXAMPLES.map((n) => { const o = el("option", n); o.value = n; return o; }));
  if (keepEx) ex.value = keepEx;
}

function buildChecks(p) {
  const u = UI[lang];
  const box = $("checks");
  box.replaceChildren();
  for (const k of [...BOOLS, ...SPECIALS]) {
    const l = document.createElement("label");
    const c = document.createElement("input");
    c.type = "checkbox"; c.dataset.k = k;
    c.checked = BOOLS.includes(k) ? !!p[k] : (p.special ?? []).includes(k);
    c.addEventListener("change", render);
    l.append(c, el("span", u.checks[k]));
    box.append(l);
  }
}

function buildMaturity(p) {
  const u = UI[lang];
  const box = $("maturity");
  box.replaceChildren();
  for (const m of MEASURES) {
    const info = MEASURE_INFO.find((x) => x.key === m);
    const l = document.createElement("label");
    const s = document.createElement("select");
    s.dataset.m = m;
    u.mats.forEach((t, i) => { const o = el("option", t); o.value = i === 0 ? "" : String(i - 1); s.append(o); });
    const v = p.maturity?.[m];
    s.value = v === undefined ? "" : String(v);
    s.addEventListener("change", render);
    l.append(el("span", `${info.ref} ${info.name[lang]}`), s);
    box.append(l);
  }
}

function read() {
  const p = { country: $("country").value, sector: $("sector").value, employees: Number($("employees").value) || 0, turnoverMEur: Number($("turnover").value) || 0, balanceSheetMEur: Number($("balance").value) || 0, maturity: {}, special: [] };
  if ($("name").value) p.name = $("name").value;
  p.publicSectorLink = $("pub").value;
  document.querySelectorAll("#checks input").forEach((c) => {
    const k = c.dataset.k;
    if (BOOLS.includes(k)) p[k] = c.checked; else if (c.checked) p.special.push(k);
  });
  document.querySelectorAll("#maturity select").forEach((s) => { if (s.value !== "") p.maturity[s.dataset.m] = Number(s.value); });
  return p;
}

function card(title, cls, big, para, points) {
  const u = UI[lang];
  const c = el("div", undefined, `card ${cls}`);
  c.append(el("h3", title), el("div", big, "big"), el("p", para));
  if (points.length) {
    const d = document.createElement("details");
    d.append(el("summary", u.details));
    const ul = document.createElement("ul");
    for (const x of points) ul.append(el("li", x[lang]));
    d.append(ul);
    c.append(d);
  }
  return c;
}

function render() {
  const u = UI[lang];
  const p = read();
  const pl = plan(p);
  const sc = pl.scope;
  $("scope").replaceChildren(
    card("NIS2", sc.nis2.status, u.status[sc.nis2.status], sc.nis2.headline[lang], sc.nis2.points),
    card("DORA", sc.dora.applies, u.applies[sc.dora.applies], sc.dora.headline[lang], sc.dora.points),
    card("ENS", sc.ens.applies, u.applies[sc.ens.applies], sc.ens.headline[lang], sc.ens.points),
    card("GDPR", sc.gdpr.applies, u.applies[sc.gdpr.applies], sc.gdpr.headline[lang], sc.gdpr.points),
  );
  const max = Math.max(...pl.gaps.map((g) => g.score));
  $("gaps").replaceChildren(...pl.gaps.map((g) => {
    const row = el("div", undefined, "gap");
    row.append(el("span", `${g.ref} ${g.name[lang]}`), el("span", u.lvl[g.level], "lvl"));
    const track = el("div", undefined, "track");
    const fill = el("span", undefined, `fill ${g.level}`);
    fill.style.width = `${Math.round((g.score / max) * 100)}%`;
    track.append(fill);
    row.append(track);
    return row;
  }));
  $("demo").replaceChildren(...pl.demo.map((d) => { const li = document.createElement("li"); li.append(el("b", d.title[lang]), document.createTextNode(`. ${d.show[lang]}`)); return li; }));
  const qs = $("qs");
  qs.replaceChildren();
  for (const sec of ["regulatory", "gap", "validate", "commercial"]) {
    const list = pl.questions.filter((q) => q.section === sec);
    if (!list.length) continue;
    qs.append(el("h4", u.sec[sec]));
    for (const q of list) {
      const d = el("div", undefined, "q");
      d.append(el("b", q.text[lang]), el("span", `${u.why}: ${q.why[lang]}`, "why"));
      if (q.redFlag) { d.append(document.createElement("br"), el("span", `${u.red}: ${q.redFlag[lang]}`, "flag")); }
      qs.append(d);
    }
  }
  $("md").textContent = briefMarkdown(p, lang, pl);
  $("caveat").textContent = sc.caveats[0][lang];
}

function fill(p) {
  $("name").value = p.name ?? "";
  $("country").value = p.country;
  $("sector").value = p.sector;
  $("employees").value = p.employees;
  $("turnover").value = p.turnoverMEur;
  $("balance").value = p.balanceSheetMEur;
  $("pub").value = p.publicSectorLink ?? "none";
  buildChecks(p);
  buildMaturity(p);
  render();
}

async function load(name) {
  const r = await fetch(`/examples/${name}.json`);
  fill(await r.json());
}

for (const id of ["name", "country", "sector", "employees", "turnover", "balance", "pub"]) $(id).addEventListener("input", render);
$("ex").addEventListener("change", () => load($("ex").value));
$("lang").addEventListener("change", () => {
  const p = read();
  lang = $("lang").value;
  buildStatic();
  buildChecks(p); buildMaturity(p);
  $("sector").value = p.sector;
  render();
});
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("md").textContent); $("copy").textContent = UI[lang].copied; setTimeout(() => { $("copy").textContent = UI[lang].copy; }, 1500); } catch { /* clipboard blocked */ }
});

buildStatic();
load("msp-es");
