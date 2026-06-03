import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { completeTopic } from "@/lib/progress";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!dbConfigured) {
    return NextResponse.json({ ok: false, reason: "db-not-configured" }, { status: 503 });
  }
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ ok: false, reason: "unauthenticated" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { topicId?: string } | null;
  const topicId = body?.topicId;
  if (!topicId) return NextResponse.json({ ok: false, reason: "missing-topicId" }, { status: 400 });

  try {
    const summary = await completeTopic(userId, topicId);
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    return NextResponse.json(
      { ok: false, reason: (err as Error).message },
      { status: 400 },
    );
  }
}
