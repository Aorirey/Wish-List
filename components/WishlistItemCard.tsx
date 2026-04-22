"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, ExternalLink, Gift, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ItemStatus, WishlistItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  item: WishlistItem;
  delay?: number;
  isOwner: boolean;
  onRemove?: (id: string) => void;
  onReserve?: (id: string) => void;
  onCopy?: (item: WishlistItem) => void;
}

const STATUS: Record<
  ItemStatus,
  { label: string; variant: "success" | "warning" | "accent"; icon: typeof Gift }
> = {
  AVAILABLE: { label: "В наличии", variant: "success", icon: CheckCircle2 },
  AWAITING: { label: "Ожидается", variant: "warning", icon: Clock },
  RESERVED: { label: "Куплено в подарок", variant: "accent", icon: Gift },
};

export function WishlistItemCard({
  item,
  delay = 0,
  isOwner,
  onRemove,
  onReserve,
  onCopy,
}: Props) {
  // Для владельца скрываем RESERVED чтобы не раскрыть сюрприз.
  const effectiveStatus: ItemStatus =
    isOwner && item.status === "RESERVED" ? "AVAILABLE" : item.status;
  const cfg = STATUS[effectiveStatus];
  const Icon = cfg.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
    >
      <Card className="flex flex-col overflow-hidden sm:flex-row transition-shadow duration-300 hover:shadow-glow">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-white/5 sm:aspect-square sm:w-48">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Gift className="h-10 w-10 text-white/40" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge variant={cfg.variant} className="gap-1">
              <Icon className="h-3 w-3" />
              {cfg.label}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold leading-snug">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.category}
                {item.store ? ` · ${item.store}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Цена</p>
              <p className="text-base font-semibold">
                {formatPrice(item.price, item.currency)}
              </p>
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            {item.url && (
              <Button asChild variant="outline" size="sm">
                <a href={item.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> В магазин
                </a>
              </Button>
            )}
            {onCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(item)}
                aria-label="Скопировать"
              >
                Скопировать
              </Button>
            )}
            {!isOwner && onReserve && effectiveStatus !== "RESERVED" && (
              <Button
                size="sm"
                onClick={() => onReserve(item.id)}
                className="ml-auto"
              >
                <Gift className="h-4 w-4" /> В подарок
              </Button>
            )}
            {isOwner && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-rose-300 hover:bg-rose-500/10"
                onClick={() => onRemove(item.id)}
                aria-label="Удалить"
              >
                <Trash2 className="h-4 w-4" /> Удалить
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.article>
  );
}
