# Вишлист — MVP

Production-ready MVP веб-приложения для создания личных вишлистов и просмотра
списков друзей. Стек: **Next.js 14 (App Router) · TypeScript · Tailwind CSS ·
shadcn/ui · Framer Motion · Zustand · Prisma**.

## Быстрый старт

```bash
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

Откройте <http://localhost:3000>.

## Основные фичи

- Создание/редактирование вишлистов (видимость: публичный / по ссылке / приватный)
- Добавление товаров с категорией, ценой, магазином, ссылкой, изображением
- Статусы товаров: **В наличии / Ожидается / Куплено в подарок** (последний скрыт от владельца)
- Каталог из 60+ товаров с реальными ценами рынка РФ 2024–2025
- Поиск друзей по нику/email, подписка, просмотр публичных списков
- Share-кнопка (Web Share API + clipboard fallback), копирование товара
- Mobile-first адаптив, тёмная тема, glassmorphism, плавные анимации

## Структура

```
app/
├── layout.tsx             // Inter, тёмная тема, метаданные, NextAuth placeholder
├── page.tsx               // Лендинг + каталог
├── dashboard/             // Мои вишлисты
├── friends/               // Поиск друзей
├── friends/[id]/          // Профиль друга
├── wishlist/[id]/         // Детальный просмотр (owner/guest)
└── api/                   // products, wishlists, friends
components/
├── Header.tsx / Footer.tsx / Toaster.tsx
├── WishlistCard.tsx / ProductCard.tsx / ProductCatalog.tsx
├── AddToWishlistModal.tsx / AddItemDialog.tsx / CreateWishlistDialog.tsx
├── FriendSearch.tsx / VisibilityBadge.tsx / WishlistItemCard.tsx
└── ui/                    // shadcn-compatible примитивы
lib/
├── api.ts                 // Mock продукты + users + wishlists
├── store.ts               // Zustand (persist)
├── types.ts
└── utils.ts
prisma/schema.prisma
```

## Подключение реальных API

В `lib/api.ts` есть `fetchMockProducts()`. Замените её содержимое на вызов
Ozon/WB/Я.Маркет Affiliate API — интерфейс `Product` уже описывает ожидаемые
поля (`title, category, price, currency, store, image, url, rating, inStock`).

## NextAuth

Каркас настроен: `app/layout.tsx` содержит placeholder для `SessionProvider`.
Добавьте `app/api/auth/[...nextauth]/route.ts` и оберните `<SessionProvider>`
вокруг дерева, когда выберете провайдера.

## Prisma

`prisma/schema.prisma` содержит модели `User`, `Follow`, `Wishlist`, `Item`,
`Reservation` с enum `Visibility` и `ItemStatus`. По умолчанию SQLite — для
prod поменяйте `provider` на `postgresql`.
