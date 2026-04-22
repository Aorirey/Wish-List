export type Currency = "RUB" | "USD" | "EUR";

export type Store = "Ozon" | "WB" | "Я.Маркет" | "ДНС" | "М.Видео" | "Lamoda";

export type ItemStatus = "AVAILABLE" | "AWAITING" | "RESERVED";

export type Visibility = "PUBLIC" | "LINK" | "PRIVATE";

export type Category =
  | "Электроника"
  | "Одежда"
  | "Книги"
  | "Дом"
  | "Хобби"
  | "Красота"
  | "Спорт"
  | "Детям";

export interface Product {
  id: string;
  title: string;
  category: Category;
  price: number;
  currency: Currency;
  store: Store;
  image: string;
  url: string;
  rating: number;
  inStock: boolean;
  description?: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  title: string;
  description?: string;
  category: Category;
  url?: string;
  price: number;
  currency: Currency;
  store?: Store;
  imageUrl?: string;
  status: ItemStatus;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  coverUrl?: string;
  visibility: Visibility;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  followers: number;
  wishlists: number;
}

export interface FetchProductsParams {
  query?: string;
  category?: Category | "Все";
  store?: Store | "Все";
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  page?: number;
  pageSize?: number;
  sort?: "popular" | "price-asc" | "price-desc" | "rating";
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
