import type { Profile, Special } from "./types.js";
import { MEASURES } from "./types.js";
import { SECTORS } from "./data.js";

const SPECIALS: Special[] = ["dns-provider", "tld-registry", "qualified-trust-service", "public-comm-network", "public-comm-service", "central-gov", "cer-critical", "sole-national-provider"];

export function parseProfile(input: unknown): Profile {
  if (typeof input !== "object" || input === null || Array.isArray(input)) throw new Error("profile must be a JSON object");
  const o = input as Record<string, unknown>;
  const num = (k: string): number => {
    const v = o[k];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0) throw new Error(`${k} must be a non-negative number`);
    return v;
  };
  const country = o["country"];
  if (typeof country !== "string" || !/^[A-Za-z]{2}$/.test(country)) throw new Error("country must be a two-letter ISO code");
  const sector = o["sector"];
  if (typeof sector !== "string" || !SECTORS.some((s) => s.key === sector)) throw new Error(`sector must be one of: ${SECTORS.map((s) => s.key).join(", ")}`);
  const p: Profile = { country: country.toUpperCase(), sector, employees: num("employees"), turnoverMEur: num("turnoverMEur"), balanceSheetMEur: num("balanceSheetMEur") };
  if (typeof o["name"] === "string") p.name = o["name"].slice(0, 120);
  const sp = o["special"];
  if (sp !== undefined) {
    if (!Array.isArray(sp) || sp.some((x) => !SPECIALS.includes(x as Special))) throw new Error(`special must be a list drawn from: ${SPECIALS.join(", ")}`);
    p.special = sp as Special[];
  }
  for (const k of ["financialEntity", "ictProviderToFinancial", "processesPersonalData", "hasCiso", "partOfLargerGroup"] as const) {
    const v = o[k];
    if (v !== undefined) { if (typeof v !== "boolean") throw new Error(`${k} must be true or false`); p[k] = v; }
  }
  const pl = o["publicSectorLink"];
  if (pl !== undefined) { if (pl !== "public-body" && pl !== "supplier" && pl !== "none") throw new Error("publicSectorLink must be public-body, supplier or none"); p.publicSectorLink = pl; }
  if (Array.isArray(o["certifications"])) p.certifications = o["certifications"].filter((x): x is string => typeof x === "string").slice(0, 20);
  const m = o["maturity"];
  if (m !== undefined) {
    if (typeof m !== "object" || m === null) throw new Error("maturity must be an object");
    p.maturity = {};
    for (const [k, v] of Object.entries(m as Record<string, unknown>)) {
      if (!(MEASURES as readonly string[]).includes(k)) throw new Error(`maturity key ${k} is not one of a to j`);
      if (v !== 0 && v !== 1 && v !== 2) throw new Error(`maturity ${k} must be 0, 1 or 2`);
      p.maturity[k as keyof typeof p.maturity] = v;
    }
  }
  return p;
}
