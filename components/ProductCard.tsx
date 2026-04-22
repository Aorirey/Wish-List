"use client";

import { motion } from "framer-motion";
import { ExternalLink, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Product;
  onAdd?: (p: Product) => void;
  delay?: number;
}

export function ProductCard({ product, onAdd, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-glow">
        <div className="relative aspect-square overflow-hidden bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <Badge variant="primary">{product.category}</Badge>
            {!product.inStock && <Badge variant="warning">Ожидается</Badge>}
          </div>
          <div className="absolute right-3 top-3">
            <Badge variant="outline" className="bg-black/40 backdrop-blur">
              {product.store}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug min-h-[2.5rem]">
            {product.title}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-foreground">{product.rating.toFixed(1)}</span>
            <span>·</span>
            <span>{product.inStock ? "В наличии" : "Ожидается"}</span>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Цена</p>
              <p className="text-base font-semibold">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                asChild
                variant="ghost"
                size="icon"
                aria-label="Открыть в магазине"
              >
                <a href={product.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              {onAdd && (
                <Button
                  onClick={() => onAdd(product)}
                  size="sm"
                  aria-label="В вишлист"
                >
                  <Plus className="h-4 w-4" />
                  В список
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
