import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validations/contact.schema";

export async function POST(req: Request) {
  const body = await req.json();
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  console.log("Contact Form Data:", result.data);

  return NextResponse.json({
    success: true,
    message: "Message received",
  });
}
