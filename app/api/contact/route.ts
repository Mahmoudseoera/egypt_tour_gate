import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("Contact Form Data:", body);

  // هنا تقدر:
  // - تبعت Email
  // - تخزن في DB
  // - تبعت لـ Laravel API

  return NextResponse.json({
    success: true,
    message: "Message received",
  });
}
