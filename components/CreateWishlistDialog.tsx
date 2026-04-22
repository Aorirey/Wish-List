"use client";

import { Sparkles } from "lucide-react";
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
import { useWishlistStore } from "@/lib/store";
import type { Visibility } from "@/lib/types";

interface Props {
  trigger: React.ReactNode;
  onCreated?: (id: string) => void;
}

export function CreateWishlistDialog({ trigger, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [cover, setCover] = useState("");

  const create = useWishlistStore((s) => s.createWishlist);
  const pushToast = useWishlistStore((s) => s.pushToast);

  const submit = () => {
    const trimmed = title.trim() || "Новый вишлист";
    const w = create({
      title: trimmed,
      description: description.trim() || undefined,
      visibility,
      coverUrl: cover.trim() || undefined,
    });
    pushToast({ kind: "success", title: "Вишлист создан", description: trimmed });
    setOpen(false);
    setTitle("");
    setDescription("");
    setVisibility("PUBLIC");
    setCover("");
    onCreated?.(w.id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-300" /> Новый вишлист
          </DialogTitle>
          <DialogDescription>
            Назовите список, добавьте описание и выберите видимость.
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
              placeholder="День рождения 2025"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Описание
            </span>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Чего хочется в этом году"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Видимость
              </span>
              <Select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
              >
                <option value="PUBLIC">Публичный</option>
                <option value="LINK">По ссылке</option>
                <option value="PRIVATE">Приватный</option>
              </Select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Обложка (URL)
              </span>
              <Input
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://…"
              />
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={submit}>Создать вишлист</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
