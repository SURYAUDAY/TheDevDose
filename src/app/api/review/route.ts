import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { buildDueQueue } from "@/lib/review";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!dbConfigured) {
    return NextResponse.json({ authed: false, dbConfigured: false, cards: [], dueCount: 0, newCount: 0 });
  }
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ authed: false, dbConfigured: true, cards: [], dueCount: 0, newCount: 0 });
  }
  const queue = await buildDueQueue(userId);
  return NextResponse.json({ authed: true, dbConfigured: true, ...queue });
}
