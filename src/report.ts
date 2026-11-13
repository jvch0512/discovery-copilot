import { plan } from "./plan.js";
import type { Plan } from "./plan.js";
import type { Lang, Profile } from "./types.js";
import { t } from "./types.js";

const T = {
  title: { en: "Discovery brief", es: "Informe de discovery" },
  scope: { en: "Regulatory scope", es: "Ámbito regulatorio" },
  gaps: { en: "Gap ranking (NIS2 Art. 21(2))", es: "Ranking de brechas (NIS2 art. 21(2))" },
  qs: { en: "Discovery questions", es: "Preguntas de discovery" },
  demo: { en: "Demo storyline", es: "Guion de demo" },
  level: { en: { none: "none", unknown: "unknown", partial: "partial", solid: "solid" }, es: { none: "ninguna", unknown: "desconocida", partial: "parcial", solid: "sólida" } },
  sec: { en: { regulatory: "Regulatory", gap: "Top gaps", validate: "Validate the rest", commercial: "Commercial" }, es: { regulatory: "Regulatorio", gap: "Brechas principales", validate: "Validar el resto", commercial: "Comercial" } },
  red: { en: "Red flag", es: "Señal de alarma" },
  why: { en: "Why", es: "Por qué" },
  applies: { en: { yes: "applies", no: "does not apply", check: "check" }, es: { yes: "aplica", no: "no aplica", check: "revisar" } },
  status: { en: { essential: "essential entity", important: "important entity", out: "out of scope", check: "check designation" }, es: { essential: "entidad esencial", important: "entidad importante", out: "fuera del ámbito", check: "revisar designación" } },
};

export function briefMarkdown(p: Profile, lang: Lang, pl: Plan = plan(p)): string {
  const o: string[] = [];
  const sc = pl.scope;
  o.push(`# ${T.title[lang]}${p.name ? `: ${p.name}` : ""}`, "");
  o.push(`## ${T.scope[lang]}`, "");
  o.push(`- **NIS2**: ${T.status[lang][sc.nis2.status]}. ${t(sc.nis2.headline, lang)}`);
  o.push(`- **DORA**: ${T.applies[lang][sc.dora.applies]}. ${t(sc.dora.headline, lang)}`);
  o.push(`- **ENS**: ${T.applies[lang][sc.ens.applies]}. ${t(sc.ens.headline, lang)}`);
  o.push(`- **GDPR**: ${T.applies[lang][sc.gdpr.applies]}. ${t(sc.gdpr.headline, lang)}`, "");
  for (const x of sc.nis2.points) o.push(`  - ${t(x, lang)}`);
  for (const k of ["dora", "ens", "gdpr"] as const) for (const x of sc[k].points) o.push(`  - ${k.toUpperCase()}: ${t(x, lang)}`);
  if (sc.nis2.obligations.length) { o.push("", lang === "en" ? "NIS2 duties to anchor the conversation:" : "Deberes de NIS2 para anclar la conversación:"); for (const x of sc.nis2.obligations) o.push(`- ${t(x, lang)}`); }
  o.push("", `## ${T.gaps[lang]}`, "", lang === "en" ? "| # | Measure | Maturity | Score |" : "| # | Medida | Madurez | Puntuación |", "|---|---|---|---|");
  pl.gaps.forEach((g, i) => o.push(`| ${i + 1} | ${g.ref} ${t(g.name, lang)} | ${T.level[lang][g.level]} | ${g.score} |`));
  o.push("", `## ${T.qs[lang]}`);
  for (const sec of ["regulatory", "gap", "validate", "commercial"] as const) {
    const list = pl.questions.filter((q) => q.section === sec);
    if (!list.length) continue;
    o.push("", `### ${T.sec[lang][sec]}`, "");
    list.forEach((q) => {
      o.push(`- [ ] ${t(q.text, lang)}`, `  - ${T.why[lang]}: ${t(q.why, lang)}`);
      if (q.redFlag) o.push(`  - ${T.red[lang]}: ${t(q.redFlag, lang)}`);
    });
  }
  o.push("", `## ${T.demo[lang]}`, "");
  pl.demo.forEach((d, i) => o.push(`${i + 1}. **${t(d.title, lang)}**. ${t(d.show, lang)} _(${t(d.ties, lang)})_`));
  o.push("", `> ${t(sc.caveats[0]!, lang)}`, "");
  return o.join("\n");
}
