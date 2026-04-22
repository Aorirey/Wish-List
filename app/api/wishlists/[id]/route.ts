import { NextResponse } from "next/server";
import { getWishlistById } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const w = await getWishlistById(params.id);
  if (!w) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(w);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const current = await getWishlistById(params.id);
  if (!current)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  try {
    const patch = await req.json();
    return NextResponse.json({
      ...current,
      ...patch,
      id: current.id,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const current = await getWishlistById(params.id);
  if (!current)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, id: params.id });
}
