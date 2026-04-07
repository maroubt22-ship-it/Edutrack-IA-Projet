import { NextResponse } from "next/server";
import { calculateProgressTrend } from "@/lib/ai";

export async function POST(request: Request) {
  const body = (await request.json()) as { history?: number[] };
  const history = Array.isArray(body.history) ? body.history : [];

  const trend = calculateProgressTrend(history);

  return NextResponse.json({
    ok: true,
    trend,
  });
}
