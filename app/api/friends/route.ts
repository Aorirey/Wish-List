import { NextResponse } from "next/server";
import { searchUsers } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("q") ?? "";
  const items = await searchUsers(term);
  return NextResponse.json({ items });
}
