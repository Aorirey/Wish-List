import { NextResponse } from "next/server";
import { fetchMockProducts } from "@/lib/api";
import type { Category, FetchProductsParams, Store } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const params: FetchProductsParams = {
    query: searchParams.get("query") ?? undefined,
    category: (searchParams.get("category") as Category | "Все" | null) ?? "Все",
    store: (searchParams.get("store") as Store | "Все" | null) ?? "Все",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    inStockOnly: searchParams.get("inStockOnly") === "true",
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 12),
    sort:
      (searchParams.get("sort") as FetchProductsParams["sort"] | null) ??
      "popular",
  };

  const data = await fetchMockProducts(params);
  return NextResponse.json(data);
}
