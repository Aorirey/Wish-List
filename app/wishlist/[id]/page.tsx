import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { getUserById, getWishlistById } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { WishlistDetailClient } from "./WishlistDetailClient";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const w = await getWishlistById(params.id);
  return {
    title: w ? w.title : "Вишлист не найден",
    description: w?.description ?? "Детальный просмотр вишлиста",
  };
}

export default async function WishlistPage({
  params,
}: {
  params: { id: string };
}) {
  const wishlist = await getWishlistById(params.id);

  if (!wishlist) {
    // Может быть user-created вишлист из zustand store — рендерим клиентскую страницу.
    return <WishlistDetailClient wishlistId={params.id} />;
  }

  const owner = await getUserById(wishlist.ownerId);
  const total = wishlist.items.reduce((s, i) => s + i.price, 0);

  return (
    <div className="container py-10 md:py-14">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/friends">
          <ArrowLeft className="h-4 w-4" /> Все вишлисты
        </Link>
      </Button>

      <header className="glass rounded-2xl overflow-hidden">
        <div className="relative aspect-[16/6] w-full bg-gradient-to-br from-indigo-600/40 via-violet-600/30 to-fuchsia-600/30">
          {wishlist.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wishlist.coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="p-5 md:p-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            {owner && (
              <Link
                href={`/friends/${owner.id}`}
                className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
              >
                <Avatar src={owner.avatarUrl} name={owner.name} size={32} />
                <div>
                  <p className="text-sm font-medium leading-none">{owner.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    @{owner.username}
                  </p>
                </div>
              </Link>
            )}
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <p className="text-xs text-muted-foreground">
              {wishlist.items.length} товаров
            </p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatPrice(total)}
            </p>
          </div>
        </div>
      </header>

      <WishlistDetailClient wishlistId={wishlist.id} initialWishlist={wishlist} />
    </div>
  );
}
