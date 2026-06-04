import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Load a user's sticky note for a topic: { authed, body }. */
export async function GET(req: Request) {
  if (!dbConfigured) return NextResponse.json({ authed: false, body: "" });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ authed: false, body: "" });

  const topicId = new URL(req.url).searchParams.get("topicId");
  if (!topicId) return NextResponse.json({ authed: true, body: "" });

  const note = await prisma.topicNote.findUnique({
    where: { userId_topicId: { userId, topicId } },
    select: { body: true },
  });
  return NextResponse.json({ authed: true, body: note?.body ?? "" });
}

/** Save (upsert) a user's note for a topic. */
export async function POST(req: Request) {
  if (!dbConfigured) return NextResponse.json({ ok: false });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { topicId?: string; body?: string }
    | null;
  if (!body?.topicId || typeof body.body !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const text = body.body.slice(0, 20000);
  await prisma.topicNote.upsert({
    where: { userId_topicId: { userId, topicId: body.topicId } },
    create: { userId, topicId: body.topicId, body: text },
    update: { body: text },
  });
  return NextResponse.json({ ok: true });
}
