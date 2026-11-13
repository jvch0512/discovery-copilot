import type { L, Measure } from "./types.js";

/** Reviewed against Directive (EU) 2022/2555 Annexes I and II, Article 21(2) and Article 23. Re-check before relying on it. */
export const DATA_REVIEWED = "2026-11";

export interface Sector { key: string; annex: "I" | "II" | null; label: L; note?: L }

export const SECTORS: Sector[] = [
  { key: "energy", annex: "I", label: { en: "Energy", es: "Energía" } },
  { key: "transport", annex: "I", label: { en: "Transport", es: "Transporte" } },
  { key: "banking", annex: "I", label: { en: "Banking", es: "Banca" } },
  { key: "fmi", annex: "I", label: { en: "Financial market infrastructure", es: "Infraestructuras de los mercados financieros" } },
  { key: "health", annex: "I", label: { en: "Health", es: "Sanidad" } },
  { key: "drinking-water", annex: "I", label: { en: "Drinking water", es: "Agua potable" } },
  { key: "waste-water", annex: "I", label: { en: "Waste water", es: "Aguas residuales" } },
  { key: "digital-infra", annex: "I", label: { en: "Digital infrastructure (IXPs, DNS, cloud, data centres, CDN, trust services, telecoms)", es: "Infraestructura digital (IXP, DNS, nube, centros de datos, CDN, servicios de confianza, telecomunicaciones)" } },
  { key: "ict-service-mgmt", annex: "I", label: { en: "ICT service management (managed service and managed security service providers)", es: "Gestión de servicios TIC (proveedores de servicios gestionados y de seguridad gestionados)" } },
  { key: "public-admin", annex: "I", label: { en: "Public administration", es: "Administración pública" } },
  { key: "space", annex: "I", label: { en: "Space", es: "Espacio" } },
  { key: "postal", annex: "II", label: { en: "Postal and courier services", es: "Servicios postales y de mensajería" } },
  { key: "waste-mgmt", annex: "II", label: { en: "Waste management", es: "Gestión de residuos" } },
  { key: "chemicals", annex: "II", label: { en: "Chemicals (manufacture, production, distribution)", es: "Productos químicos (fabricación, producción, distribución)" } },
  { key: "food", annex: "II", label: { en: "Food (production, processing, distribution)", es: "Alimentación (producción, transformación, distribución)" } },
  { key: "manufacturing", annex: "II", label: { en: "Manufacturing (medical devices, electronics, machinery, vehicles, transport equipment)", es: "Fabricación (productos sanitarios, electrónica, maquinaria, vehículos, material de transporte)" }, note: { en: "Annex II covers specific manufacturing types only. Confirm yours is listed.", es: "El Anexo II cubre solo tipos concretos de fabricación. Confirme que el suyo figura." } },
  { key: "digital-providers", annex: "II", label: { en: "Digital providers (online marketplaces, search engines, social networks)", es: "Proveedores digitales (mercados en línea, buscadores, redes sociales)" } },
  { key: "research", annex: "II", label: { en: "Research organisations", es: "Organizaciones de investigación" } },
  { key: "insurance", annex: null, label: { en: "Insurance", es: "Seguros" }, note: { en: "Not an NIS2 Annex sector, but insurers are financial entities under DORA.", es: "No es un sector de los Anexos de NIS2, pero las aseguradoras son entidades financieras bajo DORA." } },
  { key: "financial-other", annex: null, label: { en: "Other financial entities (investment, payments, e-money, crypto-assets)", es: "Otras entidades financieras (inversión, pagos, dinero electrónico, criptoactivos)" }, note: { en: "DORA applies. NIS2 may still apply through another activity.", es: "Aplica DORA. NIS2 puede aplicar igualmente por otra actividad." } },
  { key: "other", annex: null, label: { en: "Other sector", es: "Otro sector" } },
];

export interface MeasureInfo { key: Measure; ref: string; name: L }

/** NIS2 Article 21(2)(a) to (j). */
export const MEASURE_INFO: MeasureInfo[] = [
  { key: "a", ref: "21(2)(a)", name: { en: "Risk analysis and information system security policies", es: "Análisis de riesgos y políticas de seguridad de los sistemas de información" } },
  { key: "b", ref: "21(2)(b)", name: { en: "Incident handling", es: "Gestión de incidentes" } },
  { key: "c", ref: "21(2)(c)", name: { en: "Business continuity, backup and crisis management", es: "Continuidad de negocio, copias de seguridad y gestión de crisis" } },
  { key: "d", ref: "21(2)(d)", name: { en: "Supply chain security", es: "Seguridad de la cadena de suministro" } },
  { key: "e", ref: "21(2)(e)", name: { en: "Security in acquisition, development and maintenance, including vulnerability handling", es: "Seguridad en adquisición, desarrollo y mantenimiento, incluida la gestión de vulnerabilidades" } },
  { key: "f", ref: "21(2)(f)", name: { en: "Assessing the effectiveness of measures", es: "Evaluación de la eficacia de las medidas" } },
  { key: "g", ref: "21(2)(g)", name: { en: "Basic cyber hygiene and training", es: "Ciberhigiene básica y formación" } },
  { key: "h", ref: "21(2)(h)", name: { en: "Cryptography and encryption", es: "Criptografía y cifrado" } },
  { key: "i", ref: "21(2)(i)", name: { en: "HR security, access control and asset management", es: "Seguridad de recursos humanos, control de acceso y gestión de activos" } },
  { key: "j", ref: "21(2)(j)", name: { en: "Multi-factor authentication and secure communications", es: "Autenticación multifactor y comunicaciones seguras" } },
];

export const COUNTRIES: Record<string, { name: L; nis2: L }> = {
  ES: { name: { en: "Spain", es: "España" }, nis2: {
    en: "Spain had not completed NIS2 transposition at the last review. The draft Ley de Coordinación y Gobernanza de la Ciberseguridad (approved by the Council of Ministers as a bill on 14 January 2025) was still in the legislative process, so Real Decreto-ley 12/2018 (the NIS1 law) remains the binding rule. The draft is the best guide to what is coming. Check the BOE before quoting a date.",
    es: "España no había completado la transposición de NIS2 en la última revisión. El anteproyecto de Ley de Coordinación y Gobernanza de la Ciberseguridad (aprobado por el Consejo de Ministros el 14 de enero de 2025) seguía en tramitación, por lo que el Real Decreto-ley 12/2018 (la norma de NIS1) sigue siendo la norma vinculante. El anteproyecto es la mejor guía de lo que viene. Compruebe el BOE antes de citar fechas." } },
};
export const GENERIC_NIS2: L = {
  en: "NIS2 is a directive: the binding rules are your Member State's transposition law. Check its status and any national differences in scope before quoting obligations.",
  es: "NIS2 es una directiva: las normas vinculantes son la ley de transposición de su Estado miembro. Compruebe su estado y las diferencias nacionales de ámbito antes de citar obligaciones.",
};
