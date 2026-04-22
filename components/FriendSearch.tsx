"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, UserCheck, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_USERS } from "@/lib/api";
import { useWishlistStore } from "@/lib/store";

export function FriendSearch() {
  const [query, setQuery] = useState("");
  const following = useWishlistStore((s) => s.following);
  const toggleFollow = useWishlistStore((s) => s.toggleFollow);
  const pushToast = useWishlistStore((s) => s.pushToast);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_USERS;
    return MOCK_USERS.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Найти друзей
          </h2>
          <p className="text-sm text-muted-foreground">
            Ищите по нику, имени или email.
          </p>
        </div>
        <Badge variant="primary" className="gap-1.5">
          <Users className="h-3 w-3" /> {following.length} подписок
        </Badge>
      </div>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="@username или email"
          className="pl-11"
          aria-label="Поиск друзей"
        />
      </label>

      <ul className="mt-4 flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {filtered.map((u) => {
            const isFollowing = following.includes(u.id);
            return (
              <motion.li
                key={u.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 md:p-4"
              >
                <Avatar src={u.avatarUrl} name={u.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <span className="text-xs text-muted-foreground">
                      @{u.username}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.bio ?? u.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="hidden sm:inline-flex"
                  >
                    <Link href={`/friends/${u.id}`}>Списки</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant={isFollowing ? "secondary" : "default"}
                    onClick={() => {
                      toggleFollow(u.id);
                      pushToast({
                        kind: isFollowing ? "info" : "success",
                        title: isFollowing ? "Отписались" : "Подписались",
                        description: u.name,
                      });
                    }}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="h-4 w-4" /> В друзьях
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" /> Подписаться
                      </>
                    )}
                  </Button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <li className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
            Пользователей не найдено
          </li>
        )}
      </ul>
    </div>
  );
}
