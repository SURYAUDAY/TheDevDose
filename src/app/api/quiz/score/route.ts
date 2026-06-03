import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!dbConfigured) return NextResponse.json({ ok: false });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ ok: false }); // anon quizzes aren't saved

  const body = (await req.json().catch(() => null)) as
    | { topicId?: string; score?: number; total?: number }
    | null;
  if (!body?.topicId || typeof body.score !== "number" || typeof body.total !== "number") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.quizScore.create({
    data: { userId, topicId: body.topicId, score: body.score, total: body.total },
  });
  await prisma.event.create({
    data: {
      userId,
      name: "quiz_answered",
      props: { topicId: body.topicId, score: body.score, total: body.total },
    },
  });
  return NextResponse.json({ ok: true });
}
