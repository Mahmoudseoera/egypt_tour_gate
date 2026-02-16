import { z } from "zod";

export const tourDetailsSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    nationality: z.string().trim().min(1, "Please select your nationality"),
    countryCode: z.string().trim().min(1, "Country code is required"),
    phone: z
      .string()
      .trim()
      .min(6, "Phone number must be at least 6 characters")
      .max(20, "Phone number is too long")
      .regex(/^[0-9+()\-\s]+$/, "Phone number contains invalid characters"),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    adults: z.number().int().min(1, "At least one adult is required").max(20),
    children: z.number().int().min(0).max(20),
    childAge: z.string().optional().default(""),
    message: z.string().trim().max(1500, "Message is too long").optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.checkOut < data.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out date cannot be before check-in date",
      });
    }

    if (data.children > 0 && !data.childAge.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childAge"],
        message: "Please provide child age(s) when children are included",
      });
    }
  });

export type TourDetailsFormData = z.infer<typeof tourDetailsSchema>;
