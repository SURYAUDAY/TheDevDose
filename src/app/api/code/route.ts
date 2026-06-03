import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Load a user's saved playground code for a topic: { authed, files: { name: source } }. */
export async function GET(req: Request) {
  if (!dbConfigured) return NextResponse.json({ authed: false, files: {} });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ authed: false, files: {} });

  const topicId = new URL(req.url).searchParams.get("topicId");
  if (!topicId) return NextResponse.json({ authed: true, files: {} });

  const rows = await prisma.savedCode.findMany({
    where: { userId, topicId },
    select: { fileName: true, source: true },
  });
  const files: Record<string, string> = {};
  for (const r of rows) files[r.fileName] = r.source;
  return NextResponse.json({ authed: true, files });
}

/** Save (upsert) a user's edited files for a topic. */
export async function POST(req: Request) {
  if (!dbConfigured) return NextResponse.json({ ok: false });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { topicId?: string; files?: { name: string; source: string }[] }
    | null;
  if (!body?.topicId || !Array.isArray(body.files)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.$transaction(
    body.files.slice(0, 5).map((f) =>
      prisma.savedCode.upsert({
        where: { userId_topicId_fileName: { userId, topicId: body.topicId!, fileName: f.name } },
        create: { userId, topicId: body.topicId!, fileName: f.name, source: String(f.source).slice(0, 50000) },
        update: { source: String(f.source).slice(0, 50000) },
      }),
    ),
  );
  return NextResponse.json({ ok: true });
}
