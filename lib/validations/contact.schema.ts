import { z } from "zod";

/* ─────────────────────────────────────────────────────────────
   Security helpers
   ─────────────────────────────────────────────────────────────
   Every text field (including name, email local-part, phone,
   subject, country, and message) is run through the same
   injection-detection pipeline before any field-specific rules.
   ───────────────────────────────────────────────────────────── */

const INJECTION_PATTERNS: RegExp[] = [
  /* ── SQL injection ── */
  /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bTRUNCATE\b|\bALTER\b|\bCREATE\b|\bEXEC\b|\bEXECUTE\b|\bUNION\b|\bCAST\b|\bCONVERT\b)/i,
  /('|--|;|\/\*|\*\/|xp_|0x[0-9a-f]{2,})/i,
  /\bOR\b\s+['"\d]/i,         // OR 1=1 / OR 'a'='a'
  /\bAND\b\s+['"\d]/i,        // AND 1=1
  /SLEEP\s*\(\s*\d+\s*\)/i,   // time-based blind SQLi
  /BENCHMARK\s*\(/i,

  /* ── XSS / HTML injection ── */
  /<\s*script[\s\S]*?>[\s\S]*?<\/\s*script\s*>/i,
  /<[a-z][a-z0-9]*(?:\s[^>]*)?\s*\/?>/i,  // any opening HTML tag
  /<\/[a-z][a-z0-9]*\s*>/i,               // any closing HTML tag
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,               // data: URI XSS
  /on\w+\s*=\s*["'`]?[^"'`>]+/i,         // event handlers onclick=, etc.
  /&#x?[0-9a-f]+;/i,                      // HTML entity encoding tricks

  /* ── SSTI — Jinja2, Twig, Blade, Thymeleaf, ERB … ── */
  /\{\{[\s\S]*?\}\}/,        // {{ expr }}
  /\{%[\s\S]*?%\}/,          // {% tag %}
  /\{#[\s\S]*?#\}/,          // {# comment #}
  /\$\{[\s\S]*?\}/,          // ${expr}  — JS template literal
  /#\{[\s\S]*?\}/,           // #{expr}  — Ruby ERB / Thymeleaf

  /* ── PHP ── */
  /<\?php/i,
  /<\?=/i,
  /\$_(GET|POST|REQUEST|COOKIE|SESSION|SERVER|FILES|ENV)\s*\[/i,
  /\beval\s*\(/i,
  /base64_decode\s*\(/i,
  /\bsystem\s*\(/i,
  /\bexec\s*\(/i,
  /\bpassthru\s*\(/i,
  /\bshell_exec\s*\(/i,
  /phpinfo\s*\(\s*\)/i,
  /preg_replace\s*\(\s*['"`].*[eis]/i,    // preg_replace /e modifier RCE

  /* ── Java / JSP / Spring EL ── */
  /<%[\s\S]*?%>/,
  /Runtime\.getRuntime\s*\(\s*\)/i,
  /ProcessBuilder/i,
  /\$\{T\s*\(/i,              // Spring EL RCE: ${T(java.lang...)}

  /* ── JavaScript (server-side Node / Deno) ── */
  /require\s*\(\s*['"`][^'"`]+['"`]\s*\)/i,
  /process\s*\.\s*env/i,
  /child_process/i,
  /\bfs\s*\.\s*(read|write|unlink|rmdir|mkdir|appendFile|rename)/i,
  /Function\s*\(\s*['"`]/i,              // new Function("code")
  /\bnew\s+Function\b/i,
  /\.constructor\s*\(\s*['"`]/i,        // [].constructor("code")

  /* ── Shell / OS command injection ── */
  /[|`]\s*(cat|ls|rm|wget|curl|bash|sh|python|perl|ruby|nc|ncat|netcat|whoami|id|uname)\b/i,
  /;\s*(cat|ls|rm|wget|curl|bash|sh|python|perl)\b/i,
  /\.\.\//,                             // path traversal ../
  /%2e%2e%2f/i,                         // URL-encoded path traversal
  /%00/,                                // URL-encoded null byte

  /* ── LDAP injection ── */
  /\(\s*(objectClass|cn|uid|mail)\s*=\s*\*/i,

  /* ── NoSQL injection (MongoDB) ── */
  /\$where\s*:/i,
  /\$gt\s*:\s*""/i,
  /\$ne\s*:\s*null/i,
  /\$regex\s*:/i,

  /* ── XML / XXE injection ── */
  /<!ENTITY/i,
  /<!DOCTYPE[\s\S]*?\[/i,
  /SYSTEM\s+["'][^"']*["']/i,

  /* ── Null byte ── */
  /\x00/,
];

/**
 * Returns false (= invalid) if the value matches any injection pattern.
 * Applied uniformly to every string field.
 */
function isClean(value: string): boolean {
  if (/\x00/.test(value)) return false;
  return INJECTION_PATTERNS.every((re) => !re.test(value));
}

/**
 * Sanitises a plain-text string before validation:
 *   1. Remove invisible / zero-width Unicode characters
 *   2. Collapse runs of whitespace → single space
 *   3. Trim leading/trailing whitespace
 */
function sanitise(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF\u00AD\u2028\u2029]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Base for every string field:
 *   sanitise → injection check → field-specific rules via .pipe()
 */
const safeBase = (fieldLabel: string) =>
  z
    .string()
    .transform(sanitise)
    .refine(isClean, {
      message: `${fieldLabel} contains invalid or unsafe content`,
    });

/* ─────────────────────────────────────────────────────────────
   Contact Schema
   ───────────────────────────────────────────────────────────── */
export const contactSchema = z.object({

  /* ── Full Name ── */
  name: safeBase("Full name").pipe(
    z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long")
      .regex(
        /^[\p{L}\p{M}'\-\s.]+$/u,
        "Full name may only contain letters, spaces, hyphens, apostrophes, or dots"
      )
  ),

  /* ── Email ──
     Sanitise → injection check → RFC-5321 validation.
     The local-part check prevents tricks like user+<img src=x>.
  */
  email: safeBase("Email").pipe(
    z
      .string()
      .toLowerCase()
      .email("Invalid email address")
      .max(254, "Email address is too long")
      .refine(
        (v) => {
          const [local] = v.split("@");
          // Disallow special chars that could survive HTML encoding in email local-part
          return !/[<>()\[\]\\,;:"']/.test(local ?? "");
        },
        "Email local-part contains invalid characters"
      )
  ),

  /* ── Phone code ── */
  code: safeBase("Phone code").pipe(
    z
      .string()
      .min(1, "Please select a phone code")
      .max(10, "Phone code is too long")
      .regex(/^\d+$/, "Phone code must be numeric only")
  ),

  /* ── Phone number ── */
  phone: safeBase("Phone number").pipe(
    z
      .string()
      .min(6, "Phone number is required")
      .max(20, "Phone number is too long")
      .regex(/^\d+$/, "Phone number must contain digits only")
  ),

  /* ── Subject ── */
  subject: safeBase("Subject").pipe(
    z
      .string()
      .min(3, "Subject must be at least 3 characters")
      .max(120, "Subject is too long")
  ),

  /* ── Country ── */
  country: safeBase("Country").pipe(
    z
      .string()
      .min(1, "Please select a country")
      .max(100, "Country name is too long")
      .regex(
        /^[\p{L}\p{M}\s,\-.]+$/u,
        "Country contains invalid characters"
      )
  ),

  /* ── Message ──
     Richest field — same injection rules as all others,
     then length bounds.
  */
  message: safeBase("Message").pipe(
    z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(2000, "Message is too long")
  ),
});

export type ContactFormData = z.infer<typeof contactSchema>;
