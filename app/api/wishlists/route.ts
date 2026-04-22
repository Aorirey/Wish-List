import { NextResponse } from "next/server";
import { getPublicWishlists } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const lists = await getPublicWishlists();
  return NextResponse.json({ items: lists });
}

// CRUD-заготовка: в проде замените на Prisma + Auth.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        id: `w-${Date.now().toString(36)}`,
        ownerId: "u-me",
        title: body.title,
        description: body.description ?? null,
        visibility: body.visibility ?? "PUBLIC",
        coverUrl: body.coverUrl ?? null,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
}
