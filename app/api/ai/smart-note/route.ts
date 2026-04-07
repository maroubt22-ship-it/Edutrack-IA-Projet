import { NextResponse } from "next/server";
import { generateSmartTeacherNote } from "@/lib/ai";

export async function POST(request: Request) {
  const body = (await request.json()) as { rawNote?: string };
  const text = generateSmartTeacherNote(body.rawNote ?? "");

  return NextResponse.json({
    ok: true,
    text,
  });
}
