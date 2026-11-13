#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { parseProfile } from "./parse.js";
import { plan } from "./plan.js";
import { briefMarkdown } from "./report.js";
import type { Lang } from "./types.js";

const USAGE = `discovery-copilot [--lang en|es] [--json] PROFILE.json

Reads a company profile and prints a discovery brief: NIS2, DORA, ENS and GDPR scope, a ranked gap list,
discovery questions and a demo storyline. Nothing leaves your machine.
See examples/*.json for the profile shape.`;

function main(argv: string[]): number {
  let lang: Lang = "en";
  let json = false;
  let file: string | undefined;
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a === "--help" || a === "-h") { console.log(USAGE); return 0; }
    else if (a === "--json") json = true;
    else if (a === "--lang") { const v = args[++i]; if (v !== "en" && v !== "es") { console.error("--lang must be en or es"); return 2; } lang = v; }
    else if (a.startsWith("-")) { console.error(`unknown option ${a}`); return 2; }
    else file = a;
  }
  if (!file) { console.error(USAGE); return 2; }
  try {
    const p = parseProfile(JSON.parse(readFileSync(file, "utf8")));
    const pl = plan(p);
    console.log(json ? JSON.stringify({ profile: p, ...pl }, null, 2) : briefMarkdown(p, lang, pl));
    return 0;
  } catch (e) {
    console.error(`error: ${(e as Error).message}`);
    return 2;
  }
}
process.exit(main(process.argv));
