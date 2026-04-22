"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { CreateWishlistDialog } from "@/components/CreateWishlistDialog";
import { WishlistCard } from "@/components/WishlistCard";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export function DashboardClient() {
  const wishlists = useWishlistStore((s) => s.wishlists);
  const deleteWishlist = useWishlistStore((s) => s.deleteWishlist);
  const pushToast = useWishlistStore((s) => s.pushToast);

  const stats = useMemo(() => {
    const items = wishlists.reduce((s, w) => s + w.items.length, 0);
    const total = wishlists.reduce(
      (s, w) => s + w.items.reduce((ss, i) => ss + i.price, 0),
      0,
    );
    return { items, total };
  }, [wishlists]);

  return (
    <div className="container py-10 md:py-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Мои вишлисты
          </motion.h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {wishlists.length} {wishlists.length === 1 ? "список" : "списков"} ·
            {" "}
            {stats.items} товаров · сумма {formatPrice(stats.total)}
          </p>
        </div>
        <CreateWishlistDialog
          trigger={
            <Button size="lg">
              <Plus className="h-4 w-4" /> Новый вишлист
            </Button>
          }
        />
      </div>

      {wishlists.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl btn-gradient shadow-glow">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Создайте первый вишлист</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Дайте ему имя и добавляйте товары из каталога или вручную.
          </p>
          <div className="mt-5">
            <CreateWishlistDialog
              trigger={
                <Button size="lg">
                  <Plus className="h-4 w-4" /> Начать
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishlists.map((w, idx) => (
            <div key={w.id} className="group relative">
              <WishlistCard wishlist={w} delay={idx * 0.04} />
              <div className="pointer-events-none absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 bg-black/50 backdrop-blur"
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm(`Удалить вишлист «${w.title}»?`)) {
                      deleteWishlist(w.id);
                      pushToast({
                        kind: "info",
                        title: "Вишлист удалён",
                        description: w.title,
                      });
                    }
                  }}
                  aria-label="Удалить вишлист"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Link
            href="/#catalog"
            className="group flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 p-8 text-center text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-transform duration-300 group-hover:scale-105">
              <Plus className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium">Посмотреть каталог</p>
            <p className="text-xs">Найдите идеи в каталоге на главной</p>
          </Link>
        </div>
      )}
    </div>
  );
}
