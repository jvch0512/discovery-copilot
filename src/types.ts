export type Lang = "en" | "es";
export interface L { en: string; es: string }
export const t = (x: L, lang: Lang): string => x[lang];

export type SizeClass = "micro" | "small" | "medium" | "large";
export type Special = "dns-provider" | "tld-registry" | "qualified-trust-service" | "public-comm-network" | "public-comm-service" | "central-gov" | "cer-critical" | "sole-national-provider";
export type Maturity = 0 | 1 | 2; // 0 none, 1 partial, 2 solid

export const MEASURES = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"] as const;
export type Measure = (typeof MEASURES)[number];

export interface Profile {
  name?: string;
  country: string; // ISO 3166-1 alpha-2
  sector: string;
  employees: number;
  turnoverMEur: number;
  balanceSheetMEur: number;
  special?: Special[];
  /** DORA: bank, insurer, investment firm, payment or e-money institution, crypto-asset provider, and similar */
  financialEntity?: boolean;
  /** DORA: provides ICT services to financial entities */
  ictProviderToFinancial?: boolean;
  /** ENS: public body, or private supplier of services to the Spanish public sector */
  publicSectorLink?: "public-body" | "supplier" | "none";
  processesPersonalData?: boolean;
  hasCiso?: boolean;
  certifications?: string[];
  maturity?: Partial<Record<Measure, Maturity>>;
  /** Group aggregation: if the entity is part of a larger group, size is judged at group level */
  partOfLargerGroup?: boolean;
}
