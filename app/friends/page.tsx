import type { Metadata } from "next";
import { FriendSearch } from "@/components/FriendSearch";
import { WishlistCard } from "@/components/WishlistCard";
import { getPublicWishlists, MOCK_USERS } from "@/lib/api";

export const metadata: Metadata = {
  title: "Друзья",
  description: "Ищите друзей и следите за их публичными вишлистами.",
};

export default async function FriendsPage() {
  const wishlists = await getPublicWishlists();
  const owners = Object.fromEntries(MOCK_USERS.map((u) => [u.id, u]));

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Друзья</h1>
        <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
          Подписывайтесь на людей и следите за их открытыми вишлистами — так
          проще выбирать подарки.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <FriendSearch />

        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Публичные вишлисты друзей
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {wishlists.map((w, idx) => (
              <WishlistCard
                key={w.id}
                wishlist={w}
                ownerName={owners[w.ownerId]?.name}
                delay={idx * 0.04}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
