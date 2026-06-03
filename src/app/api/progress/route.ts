import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { getProgressSummary } from "@/lib/progress";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!dbConfigured) {
    return NextResponse.json(await getProgressSummary(null, false));
  }
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  return NextResponse.json(await getProgressSummary(userId, true));
}
