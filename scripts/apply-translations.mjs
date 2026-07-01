#!/usr/bin/env node
/**
 * apply-translations.mjs
 *
 * Reads translation-report.json (produced by scan-missing-translations.mjs)
 * and replaces each hardcoded string IN PLACE with a t("key") call.
 *
 *   JSX text:    Read More            → {t("read_more")}
 *   JSX attr:    placeholder="Enter"  → placeholder={t("enter")}
 *
 * SAFETY:
 *   - Makes a full backup of every file it touches (same path + ".bak")
 *     before writing, so you can diff/revert easily.
 *   - Only replaces the EXACT byte range recorded by the scanner
 *     (start/end offsets), so nothing else in the file is touched.
 *   - Processes replacements bottom-to-top per file so earlier offsets
 *     stay valid as later ones are rewritten.
 *   - Does NOT auto-insert `const t = useT("namespace")` or the import —
 *     it can't safely guess where your component function starts in every
 *     file shape. Instead it prints a per-file checklist at the end telling
 *     you exactly which namespace(s) to wire up manually. This is the one
 *     manual step left; everything else is automatic.
 *
 * USAGE:
 *   node apply-translations.mjs                       # uses translation-report.json
 *   node apply-translations.mjs --report my-report.json
 *   node apply-translations.mjs --dry-run              # preview only, no writes
 */

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}
const DRY_RUN = args.includes("--dry-run");
const REPORT_FILE = getArg("--report", "translation-report.json");

if (!fs.existsSync(REPORT_FILE)) {
  console.error(`Report file not found: ${REPORT_FILE}`);
  console.error(`Run scan-missing-translations.mjs first, or pass --report <file>.`);
  process.exit(1);
}

const entries = JSON.parse(fs.readFileSync(REPORT_FILE, "utf8"));

if (!Array.isArray(entries)) {
  console.error(`Report must be the flat JSON array format from scan-missing-translations.mjs`);
  console.error(`(the grouped/legacy format isn't supported by this script)`);
  process.exit(1);
}

// Group entries by file
const byFile = new Map();
for (const entry of entries) {
  if (!byFile.has(entry.file)) byFile.set(entry.file, []);
  byFile.get(entry.file).push(entry);
}

const namespacesTouchedPerFile = new Map();
let totalReplacements = 0;

for (const [file, fileEntries] of byFile.entries()) {
  if (!fs.existsSync(file)) {
    console.warn(`Skipping (not found): ${file}`);
    continue;
  }

  let source = fs.readFileSync(file, "utf8");

  // Sort descending by start offset so earlier replacements don't shift
  // the positions of ones we haven't applied yet.
  const sorted = [...fileEntries].sort((a, b) => b.start - a.start);

  const namespaces = new Set();

  for (const entry of sorted) {
    const { start, end, type, suggestedKey, suggestedNamespace, text } = entry;

    // Re-validate the slice still matches what the scanner saw — if the
    // file changed since the scan ran, skip this entry rather than corrupt
    // the file with a stale offset.
    const currentSlice = source.slice(start, end);
    const expected = type === "jsx_text" ? text : text; // trimmed text was stored
    if (!currentSlice.includes(expected.split(" ")[0])) {
      console.warn(`  ⚠ Skipping stale match in ${file}:${entry.line} — file changed since scan`);
      continue;
    }

    let replacement;
    if (type === "jsx_text") {
      replacement = `{t("${suggestedKey}")}`;
    } else if (type.startsWith("jsx_attr:")) {
      // currentSlice is the string literal INCLUDING quotes, e.g. "Enter your email"
      replacement = `{t("${suggestedKey}")}`;
    } else {
      continue;
    }

    source = source.slice(0, start) + replacement + source.slice(end);
    namespaces.add(suggestedNamespace);
    totalReplacements++;
  }

  namespacesTouchedPerFile.set(file, namespaces);

  if (!DRY_RUN) {
    fs.writeFileSync(`${file}.bak`, fs.readFileSync(file, "utf8"), "utf8"); // backup original
    fs.writeFileSync(file, source, "utf8");
  }

  console.log(`${DRY_RUN ? "[dry-run] " : ""}Updated: ${file} (${fileEntries.length} replacements, namespaces: ${[...namespaces].join(", ")})`);
}

console.log(`\n${DRY_RUN ? "[dry-run] " : ""}Total replacements: ${totalReplacements}`);

console.log(`\n⚠ MANUAL STEP REQUIRED — add the translation hook to each file:\n`);

for (const [file, namespaces] of namespacesTouchedPerFile.entries()) {
  const isClientComponent = fs.readFileSync(file, "utf8").includes('"use client"');
  const hookFn = isClientComponent ? "useT" : "getT";
  const awaitKeyword = isClientComponent ? "" : "await ";

  console.log(`  ${file}`);
  for (const ns of namespaces) {
    console.log(`    import { ${hookFn} } from "@/lib/hooks/${hookFn}";`);
    console.log(`    const t = ${awaitKeyword}${hookFn}("${ns}");`);
  }
  console.log("");
}

console.log(`Backups saved as <file>.bak — diff or delete once you've verified the changes.`);
