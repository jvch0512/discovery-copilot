import { COUNTRIES, DATA_REVIEWED, GENERIC_NIS2, SECTORS } from "./data.js";
import type { L, Profile, SizeClass } from "./types.js";

const l = (en: string, es: string): L => ({ en, es });

export type Applies = "yes" | "no" | "check";
export type Nis2Status = "essential" | "important" | "out" | "check";

export interface FrameworkResult { applies: Applies; headline: L; points: L[] }
export interface Nis2Result { status: Nis2Status; headline: L; points: L[]; obligations: L[]; lexSpecialis: boolean }
export interface Scope { size: SizeClass; nis2: Nis2Result; dora: FrameworkResult; ens: FrameworkResult; gdpr: FrameworkResult; caveats: L[] }

/** Commission Recommendation 2003/361/EC staff and financial ceilings. */
export function sizeClass(p: Profile): SizeClass {
  const e = p.employees, t = p.turnoverMEur, b = p.balanceSheetMEur;
  if (e >= 250 || (t > 50 && b > 43)) return "large";
  if (e >= 50 || (t > 10 && b > 10)) return "medium";
  if (e >= 10 || (t > 2 && b > 2)) return "small";
  return "micro";
}

const near = (v: number, edge: number): boolean => Math.abs(v - edge) <= edge * 0.15;
function nearThreshold(p: Profile): boolean {
  return near(p.employees, 50) || near(p.employees, 250) || near(p.turnoverMEur, 10) || near(p.turnoverMEur, 50) || near(p.balanceSheetMEur, 10) || near(p.balanceSheetMEur, 43);
}

const OBLIGATIONS: L[] = [
  l("Art. 20: the management body approves the cybersecurity risk measures, oversees them, can be held liable and must be trained.", "Art. 20: el órgano de dirección aprueba las medidas de gestión de riesgos, las supervisa, puede ser responsable y debe formarse."),
  l("Art. 21(2): ten minimum risk measures, from risk analysis to multi-factor authentication.", "Art. 21(2): diez medidas mínimas de gestión de riesgos, desde el análisis de riesgos hasta la autenticación multifactor."),
  l("Art. 23: early warning within 24 hours, incident notification within 72 hours and a final report one month after the notification.", "Art. 23: alerta temprana en 24 horas, notificación del incidente en 72 horas e informe final un mes después de la notificación."),
];

export function nis2(p: Profile): Nis2Result {
  const sec = SECTORS.find((s) => s.key === p.sector);
  const special = p.special ?? [];
  const size = sizeClass(p);
  const mediumUp = size === "medium" || size === "large";
  const pts: L[] = [];
  let status: Nis2Status = "out";
  let head: L;

  if (special.includes("cer-critical")) {
    status = "essential"; head = l("Essential entity: designated as a critical entity under the CER Directive.", "Entidad esencial: designada como entidad crítica según la Directiva CER.");
  } else if (special.includes("central-gov")) {
    status = "essential"; head = l("Essential entity: central government public administration.", "Entidad esencial: administración pública de la administración central.");
  } else if (special.includes("tld-registry") || special.includes("dns-provider")) {
    status = "essential"; head = l("Essential entity regardless of size: TLD registry or DNS service provider.", "Entidad esencial sea cual sea su tamaño: registro de dominios de primer nivel o proveedor de DNS.");
  } else if (special.includes("qualified-trust-service")) {
    status = "essential"; head = l("Essential entity regardless of size: qualified trust service provider.", "Entidad esencial sea cual sea su tamaño: prestador cualificado de servicios de confianza.");
  } else if (special.includes("public-comm-network") || special.includes("public-comm-service")) {
    status = mediumUp ? "essential" : "important";
    head = mediumUp ? l("Essential entity: public electronic communications provider of medium size or above.", "Entidad esencial: proveedor de comunicaciones electrónicas públicas de tamaño mediano o superior.") : l("Important entity: small public electronic communications provider, in scope regardless of size.", "Entidad importante: proveedor pequeño de comunicaciones electrónicas públicas, dentro del ámbito sea cual sea su tamaño.");
  } else if (special.includes("sole-national-provider")) {
    status = "check"; head = l("In scope regardless of size as sole provider of a service essential to society or the economy, but the classification depends on the Member State.", "Dentro del ámbito sea cual sea su tamaño como único proveedor de un servicio esencial, pero la clasificación depende del Estado miembro.");
  } else if (sec?.annex === "I") {
    if (size === "large") { status = "essential"; head = l("Essential entity: large company in an Annex I sector.", "Entidad esencial: empresa grande en un sector del Anexo I."); }
    else if (size === "medium") { status = "important"; head = l("Important entity: medium-sized company in an Annex I sector.", "Entidad importante: empresa mediana en un sector del Anexo I."); }
    else head = l("Below the size cap for an Annex I sector. Not in scope on size alone.", "Por debajo del umbral de tamaño en un sector del Anexo I. Sin ámbito solo por tamaño.");
  } else if (sec?.annex === "II") {
    if (mediumUp) { status = "important"; head = l("Important entity: medium or large company in an Annex II sector.", "Entidad importante: empresa mediana o grande en un sector del Anexo II."); }
    else head = l("Below the size cap for an Annex II sector. Not in scope on size alone.", "Por debajo del umbral de tamaño en un sector del Anexo II. Sin ámbito solo por tamaño.");
  } else {
    head = l("The sector is not listed in Annex I or II. Not in scope on sector alone.", "El sector no figura en los Anexos I ni II. Sin ámbito solo por sector.");
  }

  const inScope = status === "essential" || status === "important";
  pts.push(l(`Size class: ${size} (staff ${p.employees}, turnover ${p.turnoverMEur} MEUR, balance sheet ${p.balanceSheetMEur} MEUR).`, `Tamaño: ${size} (plantilla ${p.employees}, facturación ${p.turnoverMEur} MEUR, balance ${p.balanceSheetMEur} MEUR).`));
  if (sec?.note) pts.push(sec.note);
  if (p.partOfLargerGroup) pts.push(l("Part of a larger group: size is assessed with linked and partner enterprise data, so use group figures before relying on this result.", "Parte de un grupo mayor: el tamaño se evalúa con los datos de empresas vinculadas y asociadas, use cifras de grupo antes de fiarse de este resultado."));
  if (nearThreshold(p)) pts.push(l("A figure sits within 15 percent of a size threshold. Confirm the exact numbers.", "Una cifra está a menos de un 15 por ciento de un umbral de tamaño. Confirme los datos exactos."));
  if (!inScope && status !== "check") {
    pts.push(l("Member States can designate entities below the cap in some cases, and in-scope customers push supply chain requirements down by contract. Ask about both.", "Los Estados miembros pueden designar entidades por debajo del umbral en algunos casos y los clientes dentro del ámbito trasladan requisitos de cadena de suministro por contrato. Pregunte por ambos."));
  }
  if (status === "essential") pts.push(l("Maximum administrative fine: EUR 10 million or 2 percent of worldwide annual turnover, whichever is higher (Art. 34).", "Sanción administrativa máxima: 10 millones de euros o el 2 por ciento de la facturación mundial anual, lo que sea mayor (Art. 34)."));
  if (status === "important") pts.push(l("Maximum administrative fine: EUR 7 million or 1.4 percent of worldwide annual turnover, whichever is higher (Art. 34).", "Sanción administrativa máxima: 7 millones de euros o el 1,4 por ciento de la facturación mundial anual, lo que sea mayor (Art. 34)."));
  const lex = !!p.financialEntity;
  if (p.financialEntity) pts.push(l("As a financial entity, DORA is the sector-specific rule for ICT risk and incident reporting and takes the place of the NIS2 Art. 21 and 23 duties. Confirm with counsel which NIS2 duties remain.", "Como entidad financiera, DORA es la norma sectorial de riesgo TIC y notificación de incidentes y sustituye los deberes de los arts. 21 y 23 de NIS2. Confirme con asesoría jurídica qué deberes de NIS2 permanecen."));
  const c = COUNTRIES[p.country.toUpperCase()];
  pts.push(c ? c.nis2 : GENERIC_NIS2);
  return { status, headline: head, points: pts, obligations: inScope || status === "check" ? OBLIGATIONS : [], lexSpecialis: lex };
}

export function dora(p: Profile): FrameworkResult {
  if (p.financialEntity) {
    return { applies: "yes", headline: l("DORA applies: financial entity (in force since 17 January 2025).", "DORA aplica: entidad financiera (en vigor desde el 17 de enero de 2025)."), points: [
      l("Core duties: ICT risk management framework, incident classification and reporting, digital operational resilience testing, ICT third-party risk and a register of information on contractual arrangements.", "Deberes principales: marco de gestión del riesgo TIC, clasificación y notificación de incidentes, pruebas de resiliencia operativa digital, riesgo de terceros TIC y registro de información de acuerdos contractuales."),
      l("Some small and non-interconnected firms get a simplified framework. Confirm which applies.", "Algunas entidades pequeñas y no interconectadas tienen un marco simplificado. Confirme cuál aplica."),
    ] };
  }
  if (p.ictProviderToFinancial) {
    return { applies: "check", headline: l("DORA reaches you indirectly: you provide ICT services to financial entities.", "DORA le alcanza de forma indirecta: presta servicios TIC a entidades financieras."), points: [
      l("Your financial customers must put DORA contractual provisions in their ICT contracts: expect clauses on service levels, incident support, audit and exit.", "Sus clientes financieros deben incluir disposiciones contractuales de DORA en sus contratos TIC: espere cláusulas de niveles de servicio, apoyo en incidentes, auditoría y salida."),
      l("The European Supervisory Authorities can designate critical ICT third-party providers for direct oversight. Ask whether that is plausible for you.", "Las Autoridades Europeas de Supervisión pueden designar proveedores TIC críticos para supervisión directa. Pregunte si es plausible en su caso."),
    ] };
  }
  return { applies: "no", headline: l("DORA does not apply on the data given.", "DORA no aplica con los datos facilitados."), points: [] };
}

export function ens(p: Profile): FrameworkResult {
  if (p.country.toUpperCase() !== "ES") return { applies: "no", headline: l("ENS is a Spanish framework. Not applicable outside Spain.", "El ENS es un marco español. No aplica fuera de España."), points: [] };
  const base = l("Royal Decree 311/2022 sets the Esquema Nacional de Seguridad with three system categories (basic, medium, high) and conformity through certification or self-declaration depending on category.", "El Real Decreto 311/2022 establece el Esquema Nacional de Seguridad con tres categorías de sistemas (básica, media, alta) y conformidad por certificación o autoevaluación según la categoría.");
  if (p.publicSectorLink === "public-body") return { applies: "yes", headline: l("ENS applies: public sector body.", "El ENS aplica: entidad del sector público."), points: [base] };
  if (p.publicSectorLink === "supplier") return { applies: "yes", headline: l("ENS applies to the systems that support services you provide to the Spanish public sector.", "El ENS aplica a los sistemas que dan soporte a servicios que presta al sector público español."), points: [base, l("Public customers will ask for proof of conformity in tenders. Ask which category their contract implies.", "Los clientes públicos pedirán prueba de conformidad en las licitaciones. Pregunte qué categoría implica su contrato.")] };
  return { applies: "no", headline: l("ENS does not apply unless you serve the public sector.", "El ENS no aplica salvo que preste servicios al sector público."), points: [] };
}

export function gdpr(p: Profile): FrameworkResult {
  if (p.processesPersonalData === false) return { applies: "no", headline: l("GDPR does not apply if no personal data is processed. Rare: confirm.", "El RGPD no aplica si no se tratan datos personales. Es raro: confirme."), points: [] };
  return { applies: "yes", headline: l("GDPR applies: personal data is processed.", "El RGPD aplica: se tratan datos personales."), points: [
    l("Art. 32 requires appropriate security. Art. 33 requires notifying the supervisory authority of a personal data breach within 72 hours when feasible, unless unlikely to risk individuals.", "El art. 32 exige seguridad adecuada. El art. 33 exige notificar a la autoridad de control una violación de datos personales en 72 horas cuando sea posible, salvo que sea improbable que entrañe riesgo para las personas."),
    l("An incident can start two clocks: NIS2 and GDPR run independently.", "Un incidente puede activar dos relojes: NIS2 y RGPD corren de forma independiente."),
  ] };
}

export function scope(p: Profile): Scope {
  return {
    size: sizeClass(p), nis2: nis2(p), dora: dora(p), ens: ens(p), gdpr: gdpr(p),
    caveats: [l(`Rules reviewed ${DATA_REVIEWED}. This is pre-sales preparation, not legal advice. Confirm scope with counsel and the competent authority.`, `Reglas revisadas ${DATA_REVIEWED}. Esto es preparación comercial, no asesoramiento jurídico. Confirme el ámbito con asesoría jurídica y la autoridad competente.`)],
  };
}
