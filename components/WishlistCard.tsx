"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Wishlist } from "@/lib/types";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { Card } from "@/components/ui/card";
import { formatPrice, formatRelative } from "@/lib/utils";

interface Props {
  wishlist: Wishlist;
  ownerName?: string;
  href?: string;
  delay?: number;
}

export function WishlistCard({ wishlist, ownerName, href, delay = 0 }: Props) {
  const linkHref = href ?? `/wishlist/${wishlist.id}`;
  const total = wishlist.items.reduce((s, i) => s + i.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <Link href={linkHref} className="block group">
        <Card className="overflow-hidden transition-shadow duration-300 group-hover:shadow-glow">
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-indigo-600/40 via-violet-600/30 to-fuchsia-600/30">
            {wishlist.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={wishlist.coverUrl}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="h-12 w-12 text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-white/70">
                  {wishlist.items.length}{" "}
                  {wishlist.items.length === 1
                    ? "товар"
                    : wishlist.items.length > 1 && wishlist.items.length < 5
                      ? "товара"
                      : "товаров"}
                </p>
                <p className="text-white font-semibold truncate">
                  {wishlist.title}
                </p>
              </div>
              <VisibilityBadge value={wishlist.visibility} />
            </div>
          </div>
          <div className="p-5 flex items-center justify-between gap-3">
            <div>
              {ownerName && (
                <p className="text-xs text-muted-foreground">{ownerName}</p>
              )}
              <p className="text-sm text-muted-foreground">
                обновлён {formatRelative(wishlist.updatedAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Сумма</p>
              <p className="text-sm font-semibold">{formatPrice(total)}</p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
