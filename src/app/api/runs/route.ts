import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { recordRun } from "@/lib/progress";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!dbConfigured) return NextResponse.json({ ok: false });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ ok: false }); // anon runs aren't persisted

  const body = (await req.json().catch(() => null)) as
    | { topicId?: string; language?: string; passed?: boolean; durationMs?: number }
    | null;
  if (!body?.topicId || !body.language) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await recordRun(userId, {
    topicId: body.topicId,
    language: body.language,
    passed: Boolean(body.passed),
    durationMs: typeof body.durationMs === "number" ? body.durationMs : undefined,
  });
  return NextResponse.json({ ok: true });
}
