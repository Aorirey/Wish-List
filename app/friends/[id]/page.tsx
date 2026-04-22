import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistCard } from "@/components/WishlistCard";
import { getUserById, MOCK_WISHLISTS } from "@/lib/api";

export default async function FriendPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserById(params.id);
  if (!user) notFound();

  const lists = MOCK_WISHLISTS.filter(
    (w) => w.ownerId === user.id && w.visibility !== "PRIVATE",
  );

  return (
    <div className="container py-10 md:py-14">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/friends">
          <ArrowLeft className="h-4 w-4" /> К списку друзей
        </Link>
      </Button>

      <div className="glass rounded-2xl p-5 md:p-8 flex flex-col sm:flex-row items-start gap-5">
        <Avatar src={user.avatarUrl} name={user.name} size={80} />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {user.name}
          </h1>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          {user.bio && (
            <p className="mt-2 text-sm leading-relaxed max-w-xl">{user.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="primary">{user.followers} подписчиков</Badge>
            <Badge variant="accent">{lists.length} публичных вишлистов</Badge>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">
          Публичные списки
        </h2>
        {lists.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-sm text-muted-foreground">
            Пока нет публичных вишлистов.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((w, idx) => (
              <WishlistCard
                key={w.id}
                wishlist={w}
                ownerName={user.name}
                delay={idx * 0.04}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
