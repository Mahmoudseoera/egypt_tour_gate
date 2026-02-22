import { z } from "zod";

/* ─────────────────────────────────────────────────────────────
   Security helpers — same pipeline used in contact.schema.ts
   Every field: sanitise → injection check → field-specific rules
   ───────────────────────────────────────────────────────────── */

const INJECTION_PATTERNS: RegExp[] = [
  /* SQL */
  /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bTRUNCATE\b|\bALTER\b|\bCREATE\b|\bEXEC\b|\bEXECUTE\b|\bUNION\b|\bCAST\b|\bCONVERT\b)/i,
  /('|--|;|\/\*|\*\/|xp_|0x[0-9a-f]{2,})/i,
  /\bOR\b\s+['"\d]/i,
  /\bAND\b\s+['"\d]/i,
  /SLEEP\s*\(\s*\d+\s*\)/i,
  /BENCHMARK\s*\(/i,

  /* XSS / HTML */
  /<\s*script[\s\S]*?>[\s\S]*?<\/\s*script\s*>/i,
  /<[a-z][a-z0-9]*(?:\s[^>]*)?\s*\/?>/i,
  /<\/[a-z][a-z0-9]*\s*>/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /on\w+\s*=\s*["'`]?[^"'`>]+/i,
  /&#x?[0-9a-f]+;/i,

  /* SSTI */
  /\{\{[\s\S]*?\}\}/,
  /\{%[\s\S]*?%\}/,
  /\{#[\s\S]*?#\}/,
  /\$\{[\s\S]*?\}/,
  /#\{[\s\S]*?\}/,

  /* PHP */
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
  /preg_replace\s*\(\s*['"`].*[eis]/i,

  /* Java / JSP */
  /<%[\s\S]*?%>/,
  /Runtime\.getRuntime\s*\(\s*\)/i,
  /ProcessBuilder/i,
  /\$\{T\s*\(/i,

  /* Node.js */
  /require\s*\(\s*['"`][^'"`]+['"`]\s*\)/i,
  /process\s*\.\s*env/i,
  /child_process/i,
  /\bfs\s*\.\s*(read|write|unlink|rmdir|mkdir|appendFile|rename)/i,
  /Function\s*\(\s*['"`]/i,
  /\bnew\s+Function\b/i,
  /\.constructor\s*\(\s*['"`]/i,

  /* Shell / OS */
  /[|`]\s*(cat|ls|rm|wget|curl|bash|sh|python|perl|ruby|nc|ncat|netcat|whoami|id|uname)\b/i,
  /;\s*(cat|ls|rm|wget|curl|bash|sh|python|perl)\b/i,
  /\.\.\//,
  /%2e%2e%2f/i,
  /%00/,

  /* NoSQL */
  /\$where\s*:/i,
  /\$gt\s*:\s*""/i,
  /\$ne\s*:\s*null/i,
  /\$regex\s*:/i,

  /* XXE */
  /<!ENTITY/i,
  /<!DOCTYPE[\s\S]*?\[/i,
  /SYSTEM\s+["'][^"']*["']/i,

  /* Null byte */
  /\x00/,
];

function isClean(value: string): boolean {
  if (/\x00/.test(value)) return false;
  return INJECTION_PATTERNS.every((re) => !re.test(value));
}

function sanitise(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF\u00AD\u2028\u2029]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Base safe string: sanitise → injection check */
const safeStr = (label: string) =>
  z
    .string()
    .transform(sanitise)
    .refine(isClean, { message: `${label} contains invalid or unsafe content` });

/* ─────────────────────────────────────────────────────────────
   Per-child age schema (used for the dynamic child age array)
   ───────────────────────────────────────────────────────────── */
export const childAgeItemSchema = safeStr("Child age").pipe(
  z
    .string()
    .min(1, "Child age is required")
    .max(3, "Enter a valid age")
    .regex(/^\d{1,2}$/, "Age must be a number between 0 and 17")
    .refine((v) => {
      const n = parseInt(v, 10);
      return !isNaN(n) && n >= 0 && n <= 17;
    }, "Child age must be between 0 and 17")
);

/* ─────────────────────────────────────────────────────────────
   Tour Details Booking Schema
   ───────────────────────────────────────────────────────────── */
export const tourDetailsSchema = z
  .object({
    /** Full name */
    name: safeStr("Name").pipe(
      z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name is too long")
        .regex(
          /^[\p{L}\p{M}'\-\s.]+$/u,
          "Name may only contain letters, spaces, hyphens, apostrophes, or dots"
        )
    ),

    /** Email */
    email: safeStr("Email").pipe(
      z
        .string()
        .toLowerCase()
        .email("Please enter a valid email address")
        .max(254, "Email is too long")
        .refine(
          (v) => !/[<>()\[\]\\,;:"']/.test(v.split("@")[0] ?? ""),
          "Email contains invalid characters"
        )
    ),

    /** Nationality — selected from a controlled list */
    nationality: safeStr("Nationality").pipe(
      z
        .string()
        .min(1, "Please select your nationality")
        .max(100, "Nationality value is too long")
        .regex(/^[\p{L}\p{M}\s,\-.]+$/u, "Nationality contains invalid characters")
    ),

    /** Phone country code — digits only */
    countryCode: safeStr("Country code").pipe(
      z
        .string()
        .min(1, "Country code is required")
        .max(10, "Country code is too long")
        .regex(/^\+?\d{1,6}$/, "Country code must be numeric (e.g. +20)")
    ),

    /** Phone number */
    phone: safeStr("Phone").pipe(
      z
        .string()
        .min(6, "Phone number must be at least 6 digits")
        .max(20, "Phone number is too long")
        .regex(
          /^[0-9+()\-\s]+$/,
          "Phone may only contain digits, +, -, (, ), and spaces"
        )
    ),

    /** Check-in date — ISO date string YYYY-MM-DD */
    checkIn: z
      .string()
      .min(1, "Check-in date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Check-in date must be a valid date")
      .refine(
        (v) => !isNaN(Date.parse(v)) && new Date(v) >= new Date(new Date().toDateString()),
        "Check-in date cannot be in the past"
      ),

    /** Check-out date */
    checkOut: z
      .string()
      .min(1, "Check-out date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Check-out date must be a valid date")
      .refine((v) => !isNaN(Date.parse(v)), "Check-out date must be valid"),

    /** Adults count */
    adults: z
      .number({ invalid_type_error: "Adults must be a number" })
      .int("Adults must be a whole number")
      .min(1, "At least one adult is required")
      .max(20, "Maximum 20 adults"),

    /** Children count */
    children: z
      .number({ invalid_type_error: "Children must be a number" })
      .int("Children must be a whole number")
      .min(0, "Children cannot be negative")
      .max(20, "Maximum 20 children"),

    /**
     * Dynamic per-child ages: array of age strings.
     * Length must equal children count (validated in superRefine).
     */
    childAges: z
      .array(
        safeStr("Child age").pipe(
          z
            .string()
            .min(1, "Child age is required")
            .max(2, "Enter a valid age (0–17)")
            .regex(/^\d{1,2}$/, "Age must be 0–17")
            .refine((v) => {
              const n = parseInt(v, 10);
              return !isNaN(n) && n >= 0 && n <= 17;
            }, "Child age must be between 0 and 17")
        )
      )
      .default([]),

    /** Optional message */
    message: safeStr("Message").pipe(
      z.string().max(1500, "Message is too long")
    ).optional().default(""),
  })
  .superRefine((data, ctx) => {
    /* Check-out after check-in */
    if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out date must be after check-in date",
      });
    }

    /* childAges length must match children count */
    if (data.children > 0 && data.childAges.length !== data.children) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childAges"],
        message: `Please provide the age for all ${data.children} child${data.children > 1 ? "ren" : ""}`,
      });
    }
  });

export type TourDetailsFormData = z.infer<typeof tourDetailsSchema>;
