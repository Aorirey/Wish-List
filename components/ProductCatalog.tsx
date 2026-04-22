"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { AddToWishlistModal } from "@/components/AddToWishlistModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, PRODUCTS } from "@/lib/api";
import type { Category, Product, Store } from "@/lib/types";

const STORES: (Store | "Все")[] = [
  "Все",
  "Ozon",
  "WB",
  "Я.Маркет",
  "ДНС",
  "М.Видео",
  "Lamoda",
];

const SORTS = [
  { id: "popular", label: "Популярные" },
  { id: "price-asc", label: "Цена ↑" },
  { id: "price-desc", label: "Цена ↓" },
  { id: "rating", label: "Рейтинг" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export function ProductCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Все">("Все");
  const [store, setStore] = useState<Store | "Все">("Все");
  const [sort, setSort] = useState<SortId>("popular");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);

  const pageSize = 12;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = PRODUCTS.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (category !== "Все" && p.category !== category) return false;
      if (store !== "Все" && p.store !== store) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    items = [...items].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
        default:
          return b.rating * 10 + (b.inStock ? 1 : 0) - (a.rating * 10 + (a.inStock ? 1 : 0));
      }
    });
    return items;
  }, [query, category, store, sort, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = () => setPage(1);

  return (
    <section className="container py-12 md:py-16">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Каталог подарков
            </h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Больше 60 товаров с реальными ценами и магазинами — добавляйте в
              свои вишлисты или отправляйте друзьям.
            </p>
          </div>
          <Badge variant="accent" className="w-max gap-1.5">
            <SlidersHorizontal className="h-3 w-3" />
            {filtered.length} товаров
          </Badge>
        </div>

        <div className="glass rounded-2xl p-4 md:p-5 grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder="Поиск по названию…"
              className="pl-11"
              aria-label="Поиск"
            />
          </label>
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as Category | "Все");
              resetPage();
            }}
            aria-label="Категория"
            className="md:min-w-[160px]"
          >
            <option value="Все">Все категории</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            value={store}
            onChange={(e) => {
              setStore(e.target.value as Store | "Все");
              resetPage();
            }}
            aria-label="Магазин"
            className="md:min-w-[140px]"
          >
            {STORES.map((s) => (
              <option key={s} value={s}>
                {s === "Все" ? "Все магазины" : s}
              </option>
            ))}
          </Select>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            aria-label="Сортировка"
            className="md:min-w-[140px]"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant={inStockOnly ? "default" : "outline"}
            onClick={() => {
              setInStockOnly((v) => !v);
              resetPage();
            }}
            className="md:min-w-[150px]"
          >
            {inStockOnly ? "Только в наличии" : "Все товары"}
          </Button>
        </div>

        {visible.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-lg font-medium">Ничего не найдено</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Попробуйте изменить фильтры или поисковый запрос.
            </p>
          </div>
        ) : (
          <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  delay={idx * 0.03}
                  onAdd={(prod) => setSelected(prod)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              Назад
            </Button>
            <span className="text-sm text-muted-foreground">
              {safePage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              Вперёд
            </Button>
          </div>
        )}
      </div>

      <AddToWishlistModal
        product={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
