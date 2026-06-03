import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConfigured, prisma } from "@/lib/db";
import { EVENT_NAMES } from "@/lib/track";

export const dynamic = "force-dynamic";

const ALLOWED = new Set<string>(EVENT_NAMES);

export async function POST(req: Request) {
  if (!dbConfigured) return NextResponse.json({ ok: false });

  const body = (await req.json().catch(() => null)) as
    | { name?: string; props?: Record<string, unknown> }
    | null;
  if (!body?.name || !ALLOWED.has(body.name)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  // Keep props small to avoid abuse.
  let props = body.props ?? undefined;
  if (props && JSON.stringify(props).length > 2000) props = undefined;

  await prisma.event.create({ data: { userId, name: body.name, props: props as object | undefined } });
  return NextResponse.json({ ok: true });
}
