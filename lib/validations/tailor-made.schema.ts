import { z } from "zod";

export const timeOptionSchema = z.enum(["exact", "month", "days"]);

export const tailorMadeSchema = z
  .object({
    cities: z.array(z.string()).min(1, "Please select at least one city"),
    checkIn: z.string().optional().default(""),
    checkOut: z.string().optional().default(""),
    monthSelect: z.string().optional().default(""),
    vacationDays: z.string().optional().default(""),
    timeOption: timeOptionSchema,
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phoneCode: z.string().trim().min(1, "Please select a phone code"),
    phoneNumber: z
      .string()
      .trim()
      .min(6, "Phone number must be at least 6 digits")
      .max(20, "Phone number is too long")
      .regex(/^[0-9+()\-\s]+$/, "Phone number contains invalid characters"),
    nationality: z.string().trim().min(1, "Please select a nationality"),
    hotel: z.string().trim().min(1, "Please select a hotel preference"),
    additionalInfo: z.string().trim().max(1000, "Additional info is too long").optional().default(""),
    adults: z.number().int().min(1, "At least one adult is required").max(10),
    children: z.number().int().min(0).max(10),
    infants: z.number().int().min(0).max(10),
    priceMin: z.number().min(0, "Minimum price must be 0 or greater"),
    priceMax: z.number().min(0, "Maximum price must be 0 or greater"),
  })
  .superRefine((data, ctx) => {
    if (data.priceMax < data.priceMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceMax"],
        message: "Maximum price must be greater than or equal to minimum price",
      });
    }

    if (data.timeOption === "exact") {
      if (!data.checkIn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["checkIn"],
          message: "Please select a check-in date",
        });
      }
      if (!data.checkOut) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["checkOut"],
          message: "Please select a check-out date",
        });
      }
      if (data.checkIn && data.checkOut && data.checkOut < data.checkIn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["checkOut"],
          message: "Check-out date cannot be before check-in date",
        });
      }
    }

    if (data.timeOption === "month" && !data.monthSelect) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["monthSelect"],
        message: "Please select an approximate month",
      });
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
