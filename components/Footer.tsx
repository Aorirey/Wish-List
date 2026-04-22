import Link from "next/link";
import { Gift } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/60 mt-16">
      <div className="container py-10 grid gap-10 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl btn-gradient">
              <Gift className="h-4 w-4 text-white" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              Виш<span className="text-gradient">лист</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
            Платформа для создания личных списков желаний и выбора подарков для
            друзей. Mobile-first, тёмная тема, плавные анимации.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Навигация
            </p>
            <ul className="space-y-2">
              <li>
                <Link className="hover:text-foreground text-muted-foreground" href="/">
                  Главная
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground text-muted-foreground" href="/dashboard">
                  Мои списки
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground text-muted-foreground" href="/friends">
                  Друзья
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Магазины
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Ozon</li>
              <li>Wildberries</li>
              <li>Яндекс Маркет</li>
              <li>ДНС</li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-muted-foreground leading-relaxed">
          <p>© {new Date().getFullYear()} Вишлист. Все права защищены.</p>
          <p className="mt-2">
            Цены указаны ориентировочно для российского рынка 2024–2025 и могут
            отличаться в магазинах-партнёрах.
          </p>
        </div>
      </div>
    </footer>
  );
}
