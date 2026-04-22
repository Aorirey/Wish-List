"use client";

import { motion } from "framer-motion";
import { ExternalLink, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Product;
  onAdd?: (p: Product) => void;
  delay?: number;
}

export function ProductCard({ product, onAdd, delay = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative h-full"
    >
      <div className="ios-glass ios-specular relative flex h-full flex-col overflow-hidden rounded-3xl transition-shadow duration-300 group-hover:shadow-glow">
        {/* image */}
        <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-gradient-to-br from-white/10 via-white/5 to-white/0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />

          {/* subtle gradient under badges */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 via-black/10 to-transparent"
          />

          {/* floating glass chips: category + stock */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="ios-glass-chip inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium text-white">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="ios-glass-chip inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium text-amber-100">
                Ожидается
              </span>
            )}
          </div>

          {/* store chip */}
          <div className="absolute right-3 top-3">
            <span className="ios-glass-chip inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium text-white/90">
              {product.store}
            </span>
          </div>

          {/* rating chip */}
          <div className="absolute left-3 bottom-3">
            <span className="ios-glass-chip inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-white">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col px-4 pt-3 pb-3">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-snug tracking-[-0.01em] text-foreground">
            {product.title}
          </h3>

          <div className="mt-1 text-[11px] text-muted-foreground">
            {product.inStock ? "В наличии" : "Ожидается"}
          </div>

          {/* iOS-style bottom glass bar with price + actions */}
          <div className="mt-3 ios-glass-chip relative flex items-center justify-between gap-2 rounded-2xl px-3 py-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Цена
              </p>
              <p className="truncate text-[15px] font-semibold tabular-nums">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <motion.a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Открыть в магазине"
                whileTap={{ scale: 0.9 }}
                className="ios-glass-btn inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </motion.a>
              {onAdd && (
                <motion.button
                  type="button"
                  onClick={() => onAdd(product)}
                  aria-label="В вишлист"
                  whileTap={{ scale: 0.94 }}
                  className="relative inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold text-white btn-gradient shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_24px_-12px_rgba(99,102,241,0.7)] transition-[filter] duration-200 hover:brightness-110"
                >
                  <Plus className="h-3.5 w-3.5" />
                  В список
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
