import { z } from "zod";

const INJECTION_PATTERNS: RegExp[] = [
  /<\s*script[\s\S]*?>[\s\S]*?<\/\s*script\s*>/i,
  /<\?php/i,
  /\b(javascript|vbscript|typescript|java|php|python|bash|sh|powershell|ruby|perl)\b/i,
  /on\w+\s*=\s*["'`]?[^"'`>]+/i,
  /\$\{[\s\S]*?\}/,
  /<\/?[a-z][a-z0-9]*(?:\s[^>]*)?>/i,
  /\b(eval|exec|system|shell_exec|passthru|Runtime\.getRuntime|ProcessBuilder)\s*\(/i,
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|UNION)\b/i,
  /\.{2}\//,
  /%2e%2e%2f/i,
  /\x00|%00/,
];

const sanitise = (value: string) => value.replace(/[\u200B-\u200D\uFEFF\u00AD\u2028\u2029]/g, "").replace(/\s+/g, " ").trim();
const isClean = (value: string) => INJECTION_PATTERNS.every((pattern) => !pattern.test(value));

const safeStr = (label: string) =>
  z.string().transform(sanitise).refine(isClean, {
    message: `${label} contains invalid or unsafe content`,
  });

const timeOptionSchema = z.enum(["exact", "month", "days"]);

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const monthRegex = /^\d{4}-\d{2}$/;

export const tailorMadeSchema = z
  .object({
    cities: z.array(z.string()).min(1, "Please select at least one city"),
    checkIn: z.string().optional().default(""),
    checkOut: z.string().optional().default(""),
    monthSelect: z.string().optional().default(""),
    vacationDays: z.string().optional().default(""),
    timeOption: timeOptionSchema,
    fullName: safeStr("Full name").pipe(
      z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(120, "Full name is too long")
        .regex(/^[\p{L}\p{M}'\-\s.]+$/u, "Full name may only contain letters")
    ),
    email: safeStr("Email").pipe(z.string().toLowerCase().email("Please enter a valid email address")),
    phoneCode: safeStr("Phone code").pipe(z.string().min(1, "Please select a phone code").regex(/^\+?\d{1,6}$/, "Phone code is invalid")),
    phoneNumber: safeStr("Phone number")
      .pipe(
        z
          .string()
          .min(6, "Phone number must be at least 6 digits")
          .max(20, "Phone number is too long")
          .regex(/^\d+$/, "Phone number must contain digits only")
      ),
    nationality: safeStr("Nationality").pipe(z.string().min(1, "Please select a nationality").max(100)),
    hotel: safeStr("Hotel preference").pipe(z.string().min(1, "Please select a hotel preference").max(120)),
    additionalInfo: safeStr("Additional info").pipe(z.string().max(1000, "Additional info is too long")).optional().default(""),
    adults: z.number().int().min(1, "At least one adult is required").max(10),
    children: z.number().int().min(0).max(10),
    infants: z.number().int().min(0).max(10),
    priceMin: z.number().min(0, "Minimum price must be 0 or greater"),
    priceMax: z.number().min(0, "Maximum price must be 0 or greater"),
  })
  .superRefine((data, ctx) => {
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = today.slice(0, 7);

    if (data.priceMax < data.priceMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceMax"],
        message: "Maximum price must be greater than or equal to minimum price",
      });
    }

    if (data.timeOption === "exact") {
      if (!data.checkIn) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checkIn"], message: "Please select a check-in date" });
      } else if (!dateRegex.test(data.checkIn)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checkIn"], message: "Check-in date must be YYYY-MM-DD" });
      } else if (data.checkIn < today) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checkIn"], message: "Check-in date cannot be in the past" });
      }

      if (!data.checkOut) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checkOut"], message: "Please select a check-out date" });
      } else if (!dateRegex.test(data.checkOut)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checkOut"], message: "Check-out date must be YYYY-MM-DD" });
      }

      if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["checkOut"],
          message: "Check-out date must be after check-in date",
        });
      }
    }

    if (data.timeOption === "month") {
      if (!data.monthSelect) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["monthSelect"], message: "Please select an approximate month" });
      } else if (!monthRegex.test(data.monthSelect)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["monthSelect"], message: "Month must be YYYY-MM" });
      } else if (data.monthSelect < currentMonth) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["monthSelect"], message: "Travel month cannot be in the past" });
      }
    }

    if (data.timeOption === "days") {
      const parsedDays = Number(data.vacationDays);
      if (!data.vacationDays || Number.isNaN(parsedDays) || parsedDays < 1 || parsedDays > 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vacationDays"],
          message: "Vacation days must be between 1 and 30",
        });
      }
    }
  });

export type TailorMadeFormData = z.infer<typeof tailorMadeSchema>;
