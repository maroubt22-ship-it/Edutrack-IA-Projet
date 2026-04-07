import { NextResponse } from "next/server";
import { getRemoteOrMockDashboardData } from "@/lib/remote-data";

export async function GET() {
  const result = await getRemoteOrMockDashboardData();
  return NextResponse.json(result);
}
