import { z } from "zod";

/* ─────────────────────────────────────────────────────────────
   Shared security helpers
   ───────────────────────────────────────────────────────────── */

/**
 * Strips / rejects strings that contain patterns commonly used in:
 *  - SQL injection
 *  - XSS / HTML injection
 *  - Template-literal / server-side template injection (SSTI)
 *  - PHP/Laravel/Java/JS server-side code injection
 *  - Shell command injection
 */
const INJECTION_PATTERNS = [
  /* SQL */
  /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bTRUNCATE\b|\bALTER\b|\bCREATE\b|\bEXEC\b|\bEXECUTE\b|\bUNION\b|\bCAST\b|\bCONVERT\b)/i,
  /('|--|;|\/\*|\*\/|xp_|0x[0-9a-f]+)/i,

  /* XSS / HTML injection */
  /<\s*script[\s\S]*?>[\s\S]*?<\/\s*script\s*>/i,
  /<[a-z][\s\S]*>/i,                        // any HTML tag
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /on\w+\s*=\s*["'`]?[^"'`>]+["'`]?/i,     // event handlers like onclick=

  /* SSTI — Jinja2, Twig, Blade, Thymeleaf … */
  /\{\{.*?\}\}/,
  /\{%.*?%\}/,
  /\{#.*?#\}/,
  /\$\{.*?\}/,                               // JS template literal
  /#\{.*?\}/,                                // Ruby ERB-style

  /* PHP */
  /<\?php/i,
  /<\?=/i,
  /\$_(GET|POST|REQUEST|COOKIE|SESSION|SERVER|FILES|ENV)\s*\[/i,
  /eval\s*\(/i,
  /base64_decode\s*\(/i,
  /system\s*\(/i,
  /exec\s*\(/i,
  /passthru\s*\(/i,
  /shell_exec\s*\(/i,
  /phpinfo\s*\(\s*\)/i,

  /* Java / JSP */
  /<%[\s\S]*?%>/,
  /Runtime\.getRuntime\s*\(\s*\)/i,
  /ProcessBuilder/i,

  /* JavaScript (server-side — Node/eval etc.) */
  /require\s*\(\s*['"`][^'"`]+['"`]\s*\)/i,
  /process\s*\.\s*env/i,
  /child_process/i,
  /fs\s*\.\s*(read|write|unlink|rmdir|mkdir)/i,
  /\beval\s*\(/i,
  /Function\s*\(/i,

  /* Shell command injection */
  /[|;&`$(){}[\]\\].*(\b(cat|ls|rm|wget|curl|bash|sh|python|perl|ruby|nc|ncat|netcat)\b)/i,
  /\.\.\//,                                  // path traversal

  /* LDAP injection */
  /[()!&|*\\]/,                              // broad LDAP special chars — applied only to specific fields below

  /* Null-byte */
  /\0/,
];

/** Reject strings that match any known injection pattern */
function noInjection(value: string) {
  // Always strip null bytes first
  if (/\0/.test(value)) return false;
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(value)) return false;
  }
  return true;
}

/**
 * Sanitise a plain-text string:
 *  1. Trim whitespace
 *  2. Collapse repeated whitespace into a single space
 *  3. Remove zero-width / invisible Unicode characters
 */
function sanitiseText(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "") // invisible chars
    .replace(/\s+/g, " ")
    .trim();
}

/** Zod refine helper that also sanitises and checks for injection */
const safeString = (label: string) =>
  z
    .string()
    .transform(sanitiseText)
    .refine((v) => noInjection(v), {
      message: `${label} contains invalid or unsafe characters`,
    });

/* ─────────────────────────────────────────────────────────────
   Contact Schema
   ───────────────────────────────────────────────────────────── */
export const contactSchema = z.object({
  name: safeString("Full name")
    .pipe(
      z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name is too long")
        .regex(
          /^[\p{L}\p{M}'\-\s.]+$/u,
          "Full name may only contain letters, spaces, hyphens, apostrophes, or dots"
        )
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(254, "Email address is too long")
    // No local-part tricks (e.g. user+<script>)
    .refine(
      (v) => !/[<>()[\]\\,;:\s@"']/.test(v.split("@")[0]),
      "Email contains invalid characters"
    ),

  code: z
    .string()
    .trim()
    .min(1, "Please select a phone code")
    .max(10, "Phone code is too long")
    .regex(/^\d+$/, "Phone code must be numeric"),

  phone: z
    .string()
    .trim()
    .min(6, "Phone number is required")
    .max(20, "Phone number is too long")
    .regex(
      /^[0-9+()\-\s]+$/,
      "Phone number may only contain digits, +, -, (, ), and spaces"
    ),

  subject: safeString("Subject").pipe(
    z
      .string()
      .min(3, "Subject must be at least 3 characters")
      .max(120, "Subject is too long")
  ),

  country: safeString("Country").pipe(
    z
      .string()
      .min(1, "Please select a country")
      .max(100, "Country name is too long")
      // Only Unicode letters, spaces, commas, and hyphens (handles "Bosnia-Herzegovina" etc.)
      .regex(
        /^[\p{L}\p{M}\s,\-.]+$/u,
        "Country contains invalid characters"
      )
  ),

  message: safeString("Message").pipe(
    z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(2000, "Message is too long")
  ),
});

export type ContactFormData = z.infer<typeof contactSchema>;
