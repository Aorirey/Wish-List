"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AddItemDialog } from "@/components/AddItemDialog";
import { WishlistItemCard } from "@/components/WishlistItemCard";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store";
import type { Wishlist } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

interface Props {
  wishlistId: string;
  initialWishlist?: Wishlist;
}

export function WishlistDetailClient({ wishlistId, initialWishlist }: Props) {
  const ownWishlist = useWishlistStore((s) =>
    s.wishlists.find((w) => w.id === wishlistId),
  );
  const removeItem = useWishlistStore((s) => s.removeItem);
  const updateItem = useWishlistStore((s) => s.updateItem);
  const pushToast = useWishlistStore((s) => s.pushToast);

  const isOwner = Boolean(ownWishlist);
  const wishlist = ownWishlist ?? initialWishlist;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totals = useMemo(() => {
    if (!wishlist) return { count: 0, sum: 0 };
    return {
      count: wishlist.items.length,
      sum: wishlist.items.reduce((s, i) => s + i.price, 0),
    };
  }, [wishlist]);

  if (!wishlist) {
    if (!mounted) return null;
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-semibold">Вишлист не найден</h1>
        <p className="mt-2 text-muted-foreground">
          Возможно, он удалён или недоступен по ссылке.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" /> К моим вишлистам
          </Link>
        </Button>
      </div>
    );
  }

  const handleShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : `/wishlist/${wishlist.id}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: wishlist.title, url });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        pushToast({
          kind: "success",
          title: "Ссылка скопирована",
          description: url,
        });
      }
    } catch {
      pushToast({ kind: "error", title: "Не удалось поделиться" });
    }
  };

  const handleCopyItem = async (title: string, url?: string) => {
    const text = url ? `${title} — ${url}` : title;
    try {
      await navigator.clipboard.writeText(text);
      pushToast({ kind: "success", title: "Скопировано" });
    } catch {
      pushToast({ kind: "error", title: "Не удалось скопировать" });
    }
  };

  if (isOwner) {
    return (
      <div className="container py-10 md:py-14">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" /> К моим вишлистам
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-2xl p-5 md:p-7"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <VisibilityBadge value={wishlist.visibility} />
                <Badge variant="outline">
                  Создан {formatDate(wishlist.createdAt)}
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
                {wishlist.title}
              </h1>
              {wishlist.description && (
                <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {wishlist.description}
                </p>
              )}
            </div>
            <div className="flex items-start gap-2">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" /> Поделиться
              </Button>
              <AddItemDialog
                wishlistId={wishlist.id}
                trigger={
                  <Button>
                    <Plus className="h-4 w-4" /> Товар
                  </Button>
                }
              />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{totals.count}</strong> товаров
            </span>
            <span>
              <strong className="text-foreground">
                {formatPrice(totals.sum)}
              </strong>{" "}
              сумма
            </span>
          </div>
        </motion.div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {wishlist.items.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-10 text-center">
              <p className="text-lg font-medium">Список пока пустой</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Добавьте первый товар — вручную или из каталога.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <AddItemDialog
                  wishlistId={wishlist.id}
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4" /> Добавить товар
                    </Button>
                  }
                />
                <Button asChild variant="outline">
                  <Link href="/">К каталогу</Link>
                </Button>
              </div>
            </div>
          ) : (
            wishlist.items.map((item, idx) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                delay={idx * 0.04}
                isOwner
                onRemove={(id) => {
                  removeItem(wishlist.id, id);
                  pushToast({ kind: "info", title: "Товар удалён" });
                }}
                onCopy={(it) => handleCopyItem(it.title, it.url)}
              />
            ))
          )}
        </section>

        {/* Опционально: поменять статус (ожидается / в наличии) */}
        {wishlist.items.length > 0 && (
          <p className="mt-6 text-xs text-muted-foreground">
            Совет: коснитесь карточки товара в магазине, чтобы обновить цену.
          </p>
        )}
      </div>
    );
  }

  // Публичный просмотр — показываем items и возможность «зарезервировать».
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-2">
      {wishlist.items.length === 0 ? (
        <div className="col-span-full glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
          Вишлист пустой.
        </div>
      ) : (
        wishlist.items.map((item, idx) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            delay={idx * 0.04}
            isOwner={false}
            onCopy={(it) => handleCopyItem(it.title, it.url)}
            onReserve={(id) => {
              updateItem(wishlist.id, id, { status: "RESERVED" });
              pushToast({
                kind: "success",
                title: "Забронировано",
                description: "Товар отмечен как «куплено в подарок»",
              });
            }}
          />
        ))
      )}
    </section>
  );
}
