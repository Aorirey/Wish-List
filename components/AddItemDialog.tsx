"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/api";
import { useWishlistStore } from "@/lib/store";
import type { Category, Store } from "@/lib/types";

interface Props {
  wishlistId: string;
  trigger: React.ReactNode;
}

const STORES: Store[] = ["Ozon", "WB", "Я.Маркет", "ДНС", "М.Видео", "Lamoda"];

export function AddItemDialog({ wishlistId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const addItem = useWishlistStore((s) => s.addItem);
  const pushToast = useWishlistStore((s) => s.pushToast);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Электроника");
  const [store, setStore] = useState<Store>("Ozon");
  const [price, setPrice] = useState<string>("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setTitle("");
    setCategory("Электроника");
    setStore("Ozon");
    setPrice("");
    setUrl("");
    setImageUrl("");
    setDescription("");
  };

  const submit = () => {
    if (!title.trim()) return;
    const numeric = Number(price.replace(/[^\d]/g, "")) || 0;
    addItem(wishlistId, {
      title: title.trim(),
      category,
      store,
      price: numeric,
      currency: "RUB",
      url: url.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
    });
    pushToast({
      kind: "success",
      title: "Товар добавлен",
      description: title.trim(),
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-300" /> Новый товар
          </DialogTitle>
          <DialogDescription>
            Заполните основные данные. Позже можно будет отредактировать.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Название
            </span>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, iPhone 15 Pro"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Категория
              </span>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Магазин
              </span>
              <Select
                value={store}
                onChange={(e) => setStore(e.target.value as Store)}
              >
                {STORES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Цена, ₽
              </span>
              <Input
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d\s]/g, ""))}
                placeholder="89 990"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Ссылка на товар
              </span>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ozon.ru/…"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Изображение (URL)
            </span>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…/image.jpg"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Заметка
            </span>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Размер, цвет, пожелания"
            />
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={submit} disabled={!title.trim()}>
            Добавить в вишлист
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
