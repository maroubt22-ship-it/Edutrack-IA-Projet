import { NextResponse } from "next/server";
import { generateParentReport } from "@/lib/ai";

export async function GET() {
  const text = generateParentReport("Sara", "mathematiques", 20);

  return NextResponse.json({
    ok: true,
    text,
  });
}
