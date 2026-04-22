import Link from "next/link";
import { ArrowRight, Gift, Link2, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistCard } from "@/components/WishlistCard";
import { ProductCatalog } from "@/components/ProductCatalog";
import { getPublicWishlists, MOCK_USERS } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Создавайте списки за секунды",
    text: "Добавляйте товары из любых магазинов, указывайте приоритет и видимость.",
  },
  {
    icon: Users,
    title: "Подписывайтесь на друзей",
    text: "Следите за списками близких и выбирайте подарки без согласований.",
  },
  {
    icon: Link2,
    title: "Делитесь по ссылке",
    text: "Публичный, по ссылке или приватный — решаете вы. Красивые превью.",
  },
  {
    icon: Gift,
    title: "Статусы подарков",
    text: "«Куплено в подарок» скрывается от владельца, чтобы сюрприз остался сюрпризом.",
  },
];

export default async function HomePage() {
  const wishlists = await getPublicWishlists();
  const owners = Object.fromEntries(MOCK_USERS.map((u) => [u.id, u]));

  return (
    <>
      <section className="container relative pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="primary" className="mb-5">
            Новое поколение вишлистов · RU
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight leading-tight md:text-6xl">
            Соберите идеальный{" "}
            <span className="text-gradient">список желаний</span>
            <br className="hidden sm:block" /> и делитесь с близкими
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Тёмная тема, мягкие анимации, категории, фильтры и цены с Ozon,
            Wildberries, Яндекс Маркета и ДНС. Без хаоса в заметках и скринов.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Создать первый вишлист <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/friends">Посмотреть друзей</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="glass rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl btn-gradient shadow-glow">
                <Icon className="h-5 w-5 text-white" />
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Публичные вишлисты
            </h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Быстрый доступ к спискам сообщества — может, найдёте идею для
              подарка.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/friends">Все друзья</Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishlists.map((w, idx) => (
            <WishlistCard
              key={w.id}
              wishlist={w}
              ownerName={owners[w.ownerId]?.name}
              delay={idx * 0.04}
            />
          ))}
        </div>
      </section>

      <ProductCatalog />
    </>
  );
}
