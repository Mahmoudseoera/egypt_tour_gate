import { z } from "zod";

/* ─────────────────────────────────────────────────────────────
   Security helpers
   ───────────────────────────────────────────────────────────── */
const INJECTION_PATTERNS: RegExp[] = [
  /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bTRUNCATE\b|\bALTER\b|\bCREATE\b|\bEXEC\b|\bEXECUTE\b|\bUNION\b|\bCAST\b|\bCONVERT\b)/i,
  /('|--|;|\/\*|\*\/|xp_|0x[0-9a-f]{2,})/i,
  /\bOR\b\s+['"\d]/i,
  /\bAND\b\s+['"\d]/i,
  /SLEEP\s*\(\s*\d+\s*\)/i,
  /BENCHMARK\s*\(/i,
  /<\s*script[\s\S]*?>[\s\S]*?<\/\s*script\s*>/i,
  /<[a-z][a-z0-9]*(?:\s[^>]*)?\s*\/?>/i,
  /<\/[a-z][a-z0-9]*\s*>/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /on\w+\s*=\s*["'`]?[^"'`>]+/i,
  /&#x?[0-9a-f]+;/i,
  /\{\{[\s\S]*?\}\}/,
  /\{%[\s\S]*?%\}/,
  /\{#[\s\S]*?#\}/,
  /\$\{[\s\S]*?\}/,
  /#\{[\s\S]*?\}/,
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
  /<%[\s\S]*?%>/,
  /Runtime\.getRuntime\s*\(\s*\)/i,
  /ProcessBuilder/i,
  /\$\{T\s*\(/i,
  /require\s*\(\s*['"`][^'"`]+['"`]\s*\)/i,
  /process\s*\.\s*env/i,
  /child_process/i,
  /\bfs\s*\.\s*(read|write|unlink|rmdir|mkdir|appendFile|rename)/i,
  /Function\s*\(\s*['"`]/i,
  /\bnew\s+Function\b/i,
  /\.constructor\s*\(\s*['"`]/i,
  /[|`]\s*(cat|ls|rm|wget|curl|bash|sh|python|perl|ruby|nc|ncat|netcat|whoami|id|uname)\b/i,
  /;\s*(cat|ls|rm|wget|curl|bash|sh|python|perl)\b/i,
  /\.\.\//,
  /%2e%2e%2f/i,
  /%00/,
  /\$where\s*:/i,
  /\$gt\s*:\s*""/i,
  /\$ne\s*:\s*null/i,
  /\$regex\s*:/i,
  /<!ENTITY/i,
  /<!DOCTYPE[\s\S]*?\[/i,
  /SYSTEM\s+["'][^"']*["']/i,
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

const safeStr = (label: string) =>
  z
    .string()
    .transform(sanitise)
    .refine(isClean, { message: `${label} contains invalid or unsafe content` });

/* ─────────────────────────────────────────────────────────────
   Date helpers — always in LOCAL time, never UTC
   ───────────────────────────────────────────────────────────── */

export function todayISO(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

/** Tomorrow — used as flatpickr minDate so the UI won't allow today */
export function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

/* ─────────────────────────────────────────────────────────────
   Tour Details Booking Schema
   ───────────────────────────────────────────────────────────── */
export const tourDetailsSchema = z
  .object({
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

    email: safeStr("Email").pipe(
      z
        .string()
        .toLowerCase()
        .email("Please enter a valid email address")
        .max(254, "Email is too long")
        .refine(
          (v) => !/[<>()[\]\\,;:"']/.test(v.split("@")[0] ?? ""),
          "Email contains invalid characters"
        )
    ),

    nationality: safeStr("Nationality").pipe(
      z
        .string()
        .min(1, "Please select your nationality")
        .max(100, "Nationality value is too long")
        .regex(/^[\p{L}\p{M}\s,\-.]+$/u, "Nationality contains invalid characters")
    ),

    countryCode: safeStr("Country code").pipe(
      z
        .string()
        .min(1, "Country code is required")
        .max(10, "Country code is too long")
        .regex(/^\+?\d{1,6}$/, "Country code must be numeric (e.g. +20)")
    ),

    phone: safeStr("Phone").pipe(
      z
        .string()
        .min(6, "Phone number must be at least 6 digits")
        .max(20, "Phone number is too long")
        .regex(/^\d+$/, "Phone number must contain digits only")
    ),

    /* Check-in must be today or later.
       Flatpickr minDate is set to tomorrowISO() in the component
       so the calendar already prevents selecting today,
       making the effective minimum "tomorrow" for the UI. */
    checkIn: z
      .string()
      .min(1, "Check-in date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Check-in date must be YYYY-MM-DD")
      .refine(
        (v) => v >= todayISO(),
        "Check-in date must be today or in the future"
      ),

    checkOut: z
      .string()
      .min(1, "Check-out date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Check-out date must be YYYY-MM-DD"),

    /* ── FIXED: z.coerce.number() — works in both Zod v3 and v4.
       Zod v4 removed the { invalid_type_error } option from z.number().
       z.coerce.number() automatically coerces string "1" → 1 and
       does not need any constructor options at all.            ── */
    adults: z.coerce
      .number()
      .int("Adults must be a whole number")
      .min(1, "At least one adult is required")
      .max(20, "Maximum 20 adults allowed"),

    children: z.coerce
      .number()
      .int("Children must be a whole number")
      .min(0, "Children cannot be negative")
      .max(20, "Maximum 20 children allowed"),

    childAges: z
      .array(
        safeStr("Child age").pipe(
          z
            .string()
            .min(1, "Child age is required")
            .max(2, "Enter an age between 0 and 17")
            .regex(/^\d{1,2}$/, "Age must be a whole number")
            .refine((v) => {
              const n = parseInt(v, 10);
              return !isNaN(n) && n >= 0 && n <= 17;
            }, "Child age must be between 0 and 17")
        )
      )
      .default([]),

    message: safeStr("Message")
      .pipe(z.string().max(1500, "Message is too long"))
      .optional()
      .default(""),
  })
  .superRefine((data, ctx) => {
    if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out date must be after check-in date",
      });
    }
    if (data.children > 0 && data.childAges.length !== data.children) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childAges"],
        message: `Please enter the age for all ${data.children} child${data.children > 1 ? "ren" : ""}`,
      });
    }
  });

export type TourDetailsFormData = z.infer<typeof tourDetailsSchema>;

/* ─────────────────────────────────────────────────────────────
   Per-field validation helpers (used for onBlur validation)
   ───────────────────────────────────────────────────────────── */

/**
 * Validates a single named field from the schema.
 * Returns the first error message, or undefined when valid.
 *
 * Pass currentFormData so cross-field rules (checkOut > checkIn)
 * are only enforced when both values are present.
 */
export function validateField(
  field: keyof TourDetailsFormData,
  value: unknown,
  currentFormData?: Partial<TourDetailsFormData>
): string | undefined {
  /* Build a fully-populated payload with safe defaults so
     superRefine cross-field checks don't fire falsely. */
  const payload: Record<string, unknown> = {
    name: "Placeholder",
    email: "placeholder@example.com",
    nationality: "Other",
    countryCode: "+1",
    phone: "000000",
    checkIn: tomorrowISO(),
    checkOut: tomorrowISO(),
    adults: 1,
    children: 0,
    childAges: [],
    message: "",
    ...currentFormData,
    [field]: value,
  };

  const result = tourDetailsSchema.safeParse(payload);
  if (result.success) return undefined;

  const issue = result.error.issues.find(
    (i) => String(i.path[0]) === String(field)
  );
  return issue?.message;
}

/**
 * Validates a single child-age entry by its array index.
 * Returns the first error message, or undefined when valid.
 */
export function validateChildAge(
  index: number,
  value: string,
  totalChildren: number
): string | undefined {
  const ages = Array(totalChildren)
    .fill("5")
    .map((v, i) => (i === index ? value : v));

  const result = tourDetailsSchema.safeParse({
    name: "x",
    email: "a@b.com",
    nationality: "Other",
    countryCode: "+1",
    phone: "123456",
    checkIn: tomorrowISO(),
    checkOut: tomorrowISO(),
    adults: 1,
    children: totalChildren,
    childAges: ages,
    message: "",
  });

  if (result.success) return undefined;
  const issue = result.error.issues.find(
    (i) => i.path[0] === "childAges" && i.path[1] === index
  );
  return issue?.message;
}
