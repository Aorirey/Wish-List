"use client";

import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useWishlistStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function AddToWishlistModal({ product, open, onClose }: Props) {
  const wishlists = useWishlistStore((s) => s.wishlists);
  const addItem = useWishlistStore((s) => s.addItem);
  const createWishlist = useWishlistStore((s) => s.createWishlist);
  const pushToast = useWishlistStore((s) => s.pushToast);

  const [selected, setSelected] = useState<string>(wishlists[0]?.id ?? "");
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    if (!product) return;
    let targetId = selected;
    if (creating) {
      const title = newTitle.trim() || "Новый вишлист";
      const w = createWishlist({ title, visibility: "PUBLIC" });
      targetId = w.id;
    }
    if (!targetId) {
      const w = createWishlist({ title: "Мой вишлист", visibility: "PUBLIC" });
      targetId = w.id;
    }
    addItem(targetId, {
      title: product.title,
      category: product.category,
      price: product.price,
      currency: product.currency,
      store: product.store,
      imageUrl: product.image,
      url: product.url,
    });
    pushToast({
      kind: "success",
      title: "Добавлено в вишлист",
      description: product.title,
    });
    setCreating(false);
    setNewTitle("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-300" /> Добавить в вишлист
          </DialogTitle>
          <DialogDescription>
            Выберите список, куда хотите добавить товар. Можно создать новый.
          </DialogDescription>
        </DialogHeader>

        {product && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt=""
              className="h-16 w-16 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.title}</p>
              <p className="text-xs text-muted-foreground">
                {product.store} · {formatPrice(product.price, product.currency)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!creating ? (
            <>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                  Ваш вишлист
                </span>
                <Select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {wishlists.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.items.length})
                    </option>
                  ))}
                </Select>
              </label>
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
              >
                <Plus className="h-4 w-4" /> Создать новый вишлист
              </button>
            </>
          ) : (
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Название нового вишлиста
              </span>
              <Input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Например, День рождения 2025"
              />
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="mt-2 text-xs text-muted-foreground hover:text-foreground"
              >
                ← выбрать существующий
              </button>
            </label>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
