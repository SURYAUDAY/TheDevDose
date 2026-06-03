import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { gradeCard } from "@/lib/review";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!dbConfigured) return NextResponse.json({ ok: false }, { status: 503 });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { cardKey?: string; grade?: number }
    | null;
  const grade = Number(body?.grade);
  if (!body?.cardKey || ![1, 3, 4, 5].includes(grade)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const next = await gradeCard(userId, body.cardKey, grade);
  return NextResponse.json({ ok: true, ...next });
}
