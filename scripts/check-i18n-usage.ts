/**
 * i18n Usage Checker
 * ------------------
 * Handles the pattern where useTranslations("clinics.clinicCard") means:
 *   → file:   locales/en/clinics.json
 *   → prefix: clinicCard.*
 *
 * So t("doctors") checks for key "clinicCard.doctors" inside clinics.json
 *
 * Run with:
 *   npx tsx scripts/check-i18n-usage.ts
 */

import fs from "fs";
import path from "path";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const LOCALES_DIR = path.join(process.cwd(), "locales");
const SOURCE_DIRS = ["app", "components", "features", "contexts", "hooks", "lib", "stores", "types"];
const SOURCE_LOCALE = "en";
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

// ─── COLORS ──────────────────────────────────────────────────────────────────

const RED    = (s: string) => `\x1b[31m${s}\x1b[0m`;
const GREEN  = (s: string) => `\x1b[32m${s}\x1b[0m`;
const YELLOW = (s: string) => `\x1b[33m${s}\x1b[0m`;
const CYAN   = (s: string) => `\x1b[36m${s}\x1b[0m`;
const GRAY   = (s: string) => `\x1b[90m${s}\x1b[0m`;
const BOLD   = (s: string) => `\x1b[1m${s}\x1b[0m`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Flatten nested JSON into dot-notation keys
 *  { clinicCard: { doctors: "Doctors" } } → { "clinicCard.doctors": "Doctors" }
 */
function flattenKeys(obj: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

/**
 * Load all locale JSON files.
 * Returns a map of filename (without .json) → flattened keys
 * e.g. { "clinics": { "clinicCard.doctors": "Doctors", "noDoctorsFound": "..." } }
 */
function loadLocaleFiles(locale: string): Record<string, Record<string, string>> {
  const localeDir = path.join(LOCALES_DIR, locale);
  if (!fs.existsSync(localeDir)) {
    console.error(RED(`❌ Locale directory not found: ${localeDir}`));
    process.exit(1);
  }

  const result: Record<string, Record<string, string>> = {};

  function scanDir(dir: string) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        scanDir(fullPath);
      } else if (item.isFile() && item.name.endsWith(".json")) {
        const fileName = item.name.replace(/\.json$/, ""); // "clinics"
        const raw = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
        result[fileName] = flattenKeys(raw);
      }
    }
  }

  scanDir(localeDir);
  return result;
}

/**
 * Resolve a useTranslations("X.Y.Z") call to { file, prefix, keys }
 *
 * Strategy — try from most specific to least:
 *   "clinics.clinicCard" → try file "clinics.clinicCard" first (doesn't exist)
 *                        → then try file "clinics" + prefix "clinicCard" ✅
 *   "clinics"            → try file "clinics" + no prefix ✅
 *   "common"             → try file "common" + no prefix ✅
 */
function resolveNamespace(
  namespace: string,
  localeFiles: Record<string, Record<string, string>>
): { file: string; prefix: string; keys: Record<string, string> } | null {
  const parts = namespace.split(".");

  // Try progressively shorter file names with longer prefixes
  for (let splitAt = parts.length; splitAt >= 1; splitAt--) {
    const filePart   = parts.slice(0, splitAt).join(".");
    const prefixPart = parts.slice(splitAt).join(".");

    if (localeFiles[filePart]) {
      return {
        file:   filePart,
        prefix: prefixPart,
        keys:   localeFiles[filePart],
      };
    }
  }

  return null; // couldn't find any matching file
}

/**
 * Check if a key exists given a resolved namespace.
 * If prefix is "clinicCard", then key "doctors" → looks for "clinicCard.doctors"
 * If prefix is "",           then key "noDoctorsFound" → looks for "noDoctorsFound"
 */
function keyExists(
  key: string,
  resolved: { file: string; prefix: string; keys: Record<string, string> }
): boolean {
  const fullKey = resolved.prefix ? `${resolved.prefix}.${key}` : key;
  return fullKey in resolved.keys;
}

/** Get all source files recursively */
function getSourceFiles(): string[] {
  const files: string[] = [];

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && !item.name.startsWith(".") && item.name !== "node_modules") {
        scan(fullPath);
      } else if (item.isFile() && SOURCE_EXTENSIONS.includes(path.extname(item.name))) {
        files.push(fullPath);
      }
    }
  }

  for (const dir of SOURCE_DIRS) scan(path.join(process.cwd(), dir));
  return files;
}

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Issue {
  file: string;
  line: number;
  varName: string;
  namespace: string;
  key: string;
  reason: "missing_key" | "missing_namespace";
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

function main() {
  console.log(BOLD("\n🔍 i18n Usage Checker\n"));

  // 1. Load locale files
  const localeFiles = loadLocaleFiles(SOURCE_LOCALE);
  const fileNames = Object.keys(localeFiles);

  console.log(CYAN(`📂 Loaded ${fileNames.length} locale file(s) from "${SOURCE_LOCALE}":`));
  for (const fileName of fileNames) {
    const keyCount = Object.keys(localeFiles[fileName]).length;
    console.log(GRAY(`   • ${fileName}.json  (${keyCount} flattened keys)`));
  }
  console.log();

  // 2. Scan source files
  const sourceFiles = getSourceFiles();
  console.log(GRAY(`   Scanning ${sourceFiles.length} source file(s)...\n`));
  console.log(BOLD("─── File Analysis ────────────────────────────────────────\n"));

  const issues: Issue[] = [];
  let filesWithTranslations = 0;

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    // Find all: const t = useTranslations("clinics.clinicCard")
    const declarations = [
      ...content.matchAll(
        /const\s+(\w+)\s*=\s*(?:use|get)Translations\(\s*["'`]([^"'`]+)["'`]\s*\)/g
      ),
    ];

    if (declarations.length === 0) continue;

    filesWithTranslations++;
    const relFile = path.relative(process.cwd(), file);
    console.log(CYAN(`  📄 ${relFile}`));

    // Build map: varName → { namespace, resolved }
    const varMap = new Map<string, {
      namespace: string;
      resolved: ReturnType<typeof resolveNamespace>;
    }>();

    for (const [, varName, namespace] of declarations) {
      const resolved = resolveNamespace(namespace, localeFiles);
      varMap.set(varName, { namespace, resolved });

      if (!resolved) {
        console.log(RED(`      ${varName}  →  "${namespace}"  ⚠️  no matching locale file found!`));
        issues.push({ file: relFile, line: 0, varName, namespace, key: "(namespace missing)", reason: "missing_namespace" });
      } else {
        const prefixInfo = resolved.prefix ? `prefix: "${resolved.prefix}"` : "no prefix";
        console.log(GRAY(`      ${varName}  →  "${namespace}"  (${resolved.file}.json, ${prefixInfo})`));
      }
    }

    // Scan each line for varName("key") calls
    for (let i = 0; i < lines.length; i++) {
      const lineContent = lines[i];

      for (const [varName, { namespace, resolved }] of varMap.entries()) {
        if (!resolved) continue;

        const keyRegex = new RegExp(`\\b${varName}\\(\\s*["'\`]([^"'\`]+)["'\`]`, "g");

        for (const keyMatch of lineContent.matchAll(keyRegex)) {
          const key = keyMatch[1];
          if (key.includes("${")) continue; // skip dynamic keys

          if (!keyExists(key, resolved)) {
            const fullKey = resolved.prefix ? `${resolved.prefix}.${key}` : key;
            console.log(
              RED(`      ❌ Line ${String(i + 1).padEnd(4)} ${varName}("${key}")`) +
              GRAY(` → looking for "${fullKey}" in ${resolved.file}.json — not found`)
            );
            issues.push({ file: relFile, line: i + 1, varName, namespace, key, reason: "missing_key" });
          }
        }
      }
    }

    const fileIssues = issues.filter((iss) => iss.file === relFile);
    console.log(fileIssues.length === 0 ? GREEN("      ✅ All keys valid") : "");
    console.log();
  }

  // 3. Summary
  console.log(BOLD("─── Summary ──────────────────────────────────────────────"));
  console.log(GRAY(`   Files with translations: ${filesWithTranslations}\n`));

  if (issues.length === 0) {
    console.log(GREEN("  ✅ All translation keys used in code exist in locale files!\n"));
    process.exit(0);
  }

  const missingNs   = issues.filter((i) => i.reason === "missing_namespace");
  const missingKeys = issues.filter((i) => i.reason === "missing_key");

  if (missingNs.length > 0) {
    console.log(RED(`  ❌ ${missingNs.length} missing namespace(s):`));
    for (const issue of missingNs) {
      console.log(RED(`      • "${issue.namespace}"`));
      console.log(GRAY(`        used as "${issue.varName}" in ${issue.file}`));
    }
    console.log();
  }

  if (missingKeys.length > 0) {
    console.log(RED(`  ❌ ${missingKeys.length} missing key(s):\n`));
    const byFile = missingKeys.reduce<Record<string, Issue[]>>((acc, issue) => {
      acc[issue.file] = acc[issue.file] ?? [];
      acc[issue.file].push(issue);
      return acc;
    }, {});

    for (const [file, fileIssues] of Object.entries(byFile)) {
      console.log(YELLOW(`      📄 ${file}`));
      for (const issue of fileIssues) {
        console.log(
          GRAY(`         Line ${String(issue.line).padEnd(4)} `) +
          RED(`${issue.varName}("${issue.key}")`) +
          GRAY(`  namespace: "${issue.namespace}"`)
        );
      }
      console.log();
    }
  }

  process.exit(1);
}

main();