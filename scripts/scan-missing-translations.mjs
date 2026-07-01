#!/usr/bin/env node
/**
 * scan-missing-translations.mjs
 *
 * Scans the project for STATIC hardcoded text only (no dynamic/variable
 * content) that hasn't been routed through the translation system yet.
 * Outputs a report you can hand to the backend team AND feed into
 * apply-translations.mjs to auto-replace the strings in code.
 *
 * STATIC-ONLY GUARANTEE:
 *   - JSX text nodes (ts.isJsxText) can only ever contain literal text —
 *     any {expression} inside JSX is a SEPARATE JsxExpression node and is
 *     never touched by this scanner. So JSX text results are inherently static.
 *   - For attributes, we only accept ts.isStringLiteral(node.initializer) —
 *     this means `alt={someVar}`, `alt={`Hi ${name}`}`, `alt={t("key")}`
 *     are ALL automatically excluded because they aren't plain string literals.
 *   - Extra safety filter: skip any text containing "${", "{{", or "%s"
 *     style interpolation markers, in case of stray template artifacts.
 *
 * USAGE:
 *   node scan-missing-translations.mjs
 *   node scan-missing-translations.mjs --dir app,components
 *   node scan-missing-translations.mjs --format csv --out report.csv
 */

import ts from "typescript";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const ROOT_DIRS = getArg("--dir", "app,components").split(",");
const OUTPUT_FORMAT = getArg("--format", "json");
const OUTPUT_FILE = getArg("--out", `translation-report.${OUTPUT_FORMAT === "csv" ? "csv" : "json"}`);

const IGNORE_DIRS = new Set(["node_modules", ".next", "dist", "build", ".git", ".turbo"]);
const VALID_EXT = new Set([".tsx", ".jsx", ".ts", ".js"]);

const TRANSLATABLE_PROPS = new Set([
  "placeholder", "alt", "title", "aria-label", "label",
  "buttonText", "confirmText", "cancelText",
]);

const IGNORE_PROPS = new Set([
  "className", "style", "key", "id", "href", "src", "type", "name",
  "rel", "target", "role", "htmlFor", "viewBox", "xmlns", "fill",
  "stroke", "d", "width", "height",
]);

function isNoise(str) {
  const trimmed = str.trim();
  if (!trimmed) return true;
  if (trimmed.length < 2) return true;
  if (/^[\d.,%\-+/:()]+$/.test(trimmed)) return true;
  if (/^[{}[\]<>]+$/.test(trimmed)) return true;
  return false;
}

function looksDynamic(str) {
  return (
    str.includes("${") ||
    str.includes("{{") ||
    /%[sd]\b/.test(str) ||
    /\{\w+\}/.test(str)
  );
}

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (VALID_EXT.has(path.extname(entry.name))) {
      yield full;
    }
  }
}

function isInsideTranslationCall(node) {
  let current = node.parent;
  let depth = 0;
  while (current && depth < 6) {
    if (ts.isCallExpression(current)) {
      const exprText = current.expression.getText();
      if (
        exprText === "t" ||
        exprText.endsWith(".t") ||
        /^t\(/.test(exprText) ||
        exprText === "useT" ||
        exprText === "getT"
      ) {
        return true;
      }
    }
    current = current.parent;
    depth++;
  }
  return false;
}

function suggestNamespace(filePath) {
  const normalized = filePath.replace(/\\/g, "/");

  const patterns = [
    { re: /\/contact\//i, ns: "contact" },
    { re: /\/about(-us)?\//i, ns: "about" },
    { re: /\/blog/i, ns: "blog" },
    { re: /\/tailor-?made/i, ns: "tailormade" },
    { re: /\/faq|\/questions/i, ns: "questions" },
    { re: /\/favourite/i, ns: "common" },
    { re: /\/tour|\/view-tour/i, ns: "view_tour" },
    { re: /\/(categor|sub-?categor)/i, ns: "sub" },
    { re: /\/navbar|\/footer|\/layout/i, ns: "common" },
    { re: /\/home|app\/page\.tsx$|app\/\[locale\]\/page\.tsx$/i, ns: "home" },
  ];

  for (const { re, ns } of patterns) {
    if (re.test(normalized)) return ns;
  }
  return "common";
}

function suggestKey(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join("_")
    .slice(0, 60);
}

const results = [];

function scanFile(filePath) {
  const sourceText = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") || filePath.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  function visit(node) {
    if (ts.isJsxText(node)) {
      const raw = node.getText();
      const trimmed = raw.trim();
      if (!isNoise(raw) && !looksDynamic(trimmed) && !isInsideTranslationCall(node)) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        results.push({
          file: filePath,
          line: line + 1,
          start: node.getStart(),
          end: node.getEnd(),
          type: "jsx_text",
          text: trimmed.replace(/\s+/g, " "),
          suggestedNamespace: suggestNamespace(filePath),
          suggestedKey: suggestKey(trimmed),
        });
      }
    }

    if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const propName = node.name.getText();
      if (TRANSLATABLE_PROPS.has(propName) && !IGNORE_PROPS.has(propName)) {
        const text = node.initializer.text;
        if (!isNoise(text) && !looksDynamic(text)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          results.push({
            file: filePath,
            line: line + 1,
            start: node.initializer.getStart(),
            end: node.initializer.getEnd(),
            type: `jsx_attr:${propName}`,
            propName,
            text: text.trim(),
            suggestedNamespace: suggestNamespace(filePath),
            suggestedKey: suggestKey(text),
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

console.log(`Scanning: ${ROOT_DIRS.join(", ")}\n`);

let fileCount = 0;
for (const root of ROOT_DIRS) {
  for (const file of walk(path.resolve(process.cwd(), root))) {
    scanFile(file);
    fileCount++;
  }
}

console.log(`Scanned ${fileCount} files, found ${results.length} static candidate strings.\n`);

if (OUTPUT_FORMAT === "csv") {
  const header = "namespace,key,text,type,file,line,start,end\n";
  const rows = results
    .map((r) =>
      [r.suggestedNamespace, r.suggestedKey, `"${r.text.replace(/"/g, '""')}"`, r.type, r.file, r.line, r.start, r.end].join(",")
    )
    .join("\n");
  fs.writeFileSync(OUTPUT_FILE, header + rows, "utf8");
} else {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf8");
}

console.log(`Report written to: ${OUTPUT_FILE}`);
console.log(`\nNext steps:`);
console.log(`  1. Review ${OUTPUT_FILE} — dedupe, adjust suggestedKey names as needed`);
console.log(`  2. Send the list to backend/data-entry team to add into the translation editor`);
console.log(`  3. Run apply-translations.mjs to auto-replace strings in code with t("key") calls`);
