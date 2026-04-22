"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_WISHLISTS } from "./api";
import type { ItemStatus, Visibility, Wishlist, WishlistItem } from "./types";

type WishlistInput = {
  title: string;
  description?: string;
  visibility: Visibility;
  coverUrl?: string;
};

type ItemInput = Omit<WishlistItem, "id" | "wishlistId" | "createdAt" | "status"> & {
  status?: ItemStatus;
};

type ToastKind = "success" | "error" | "info";
export interface Toast {
  id: string;
  title: string;
  description?: string;
  kind: ToastKind;
}

interface WishlistStore {
  wishlists: Wishlist[];
  following: string[];
  toasts: Toast[];

  createWishlist: (input: WishlistInput) => Wishlist;
  updateWishlist: (id: string, patch: Partial<WishlistInput>) => void;
  deleteWishlist: (id: string) => void;

  addItem: (wishlistId: string, item: ItemInput) => WishlistItem | null;
  updateItem: (wishlistId: string, itemId: string, patch: Partial<WishlistItem>) => void;
  removeItem: (wishlistId: string, itemId: string) => void;

  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;

  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const ownInitial: Wishlist[] = [
  {
    id: "w-me-default",
    ownerId: "u-me",
    title: "Мой первый вишлист",
    description: "Вещи, которые хочу в этом году.",
    visibility: "PUBLIC",
    coverUrl:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=70",
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlists: ownInitial,
      following: ["u-anna", "u-lena"],
      toasts: [],

      createWishlist: (input) => {
        const now = new Date().toISOString();
        const w: Wishlist = {
          id: `w-${uid()}`,
          ownerId: "u-me",
          title: input.title,
          description: input.description,
          visibility: input.visibility,
          coverUrl: input.coverUrl,
          items: [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ wishlists: [w, ...s.wishlists] }));
        return w;
      },

      updateWishlist: (id, patch) =>
        set((s) => ({
          wishlists: s.wishlists.map((w) =>
            w.id === id
              ? { ...w, ...patch, updatedAt: new Date().toISOString() }
              : w,
          ),
        })),

      deleteWishlist: (id) =>
        set((s) => ({ wishlists: s.wishlists.filter((w) => w.id !== id) })),

      addItem: (wishlistId, item) => {
        const exists = get().wishlists.find((w) => w.id === wishlistId);
        if (!exists) return null;
        const now = new Date().toISOString();
        const newItem: WishlistItem = {
          id: `i-${uid()}`,
          wishlistId,
          status: item.status ?? "AVAILABLE",
          title: item.title,
          category: item.category,
          price: item.price,
          currency: item.currency,
          store: item.store,
          imageUrl: item.imageUrl,
          url: item.url,
          description: item.description,
          createdAt: now,
        };
        set((s) => ({
          wishlists: s.wishlists.map((w) =>
            w.id === wishlistId
              ? { ...w, items: [newItem, ...w.items], updatedAt: now }
              : w,
          ),
        }));
        return newItem;
      },

      updateItem: (wishlistId, itemId, patch) =>
        set((s) => ({
          wishlists: s.wishlists.map((w) =>
            w.id === wishlistId
              ? {
                  ...w,
                  updatedAt: new Date().toISOString(),
                  items: w.items.map((i) =>
                    i.id === itemId ? { ...i, ...patch } : i,
                  ),
                }
              : w,
          ),
        })),

      removeItem: (wishlistId, itemId) =>
        set((s) => ({
          wishlists: s.wishlists.map((w) =>
            w.id === wishlistId
              ? { ...w, items: w.items.filter((i) => i.id !== itemId) }
              : w,
          ),
        })),

      toggleFollow: (userId) =>
        set((s) => ({
          following: s.following.includes(userId)
            ? s.following.filter((id) => id !== userId)
            : [...s.following, userId],
        })),

      isFollowing: (userId) => get().following.includes(userId),

      pushToast: (toast) =>
        set((s) => ({
          toasts: [...s.toasts, { ...toast, id: uid() }],
        })),

      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "wishlist-mvp-store",
      partialize: (s) => ({ wishlists: s.wishlists, following: s.following }),
    },
  ),
);

// Re-export для удобства страниц с friends
export const MOCK_WISHLIST_IDS = MOCK_WISHLISTS.map((w) => w.id);
