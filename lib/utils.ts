import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  value: number,
  currency: string = "RUB",
  locale: string = "ru-RU",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

export function formatDate(
  date: Date | string | number,
  locale: string = "ru-RU",
): string {
  const d = typeof date === "object" ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatRelative(
  date: Date | string | number,
  locale: string = "ru-RU",
): string {
  const d = typeof date === "object" ? date : new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diff < 60) return rtf.format(-Math.round(diff), "second");
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), "hour");
  if (diff < 2592000) return rtf.format(-Math.round(diff / 86400), "day");
  if (diff < 31536000) return rtf.format(-Math.round(diff / 2592000), "month");
  return rtf.format(-Math.round(diff / 31536000), "year");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-z0-9а-я\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function truncate(value: string, max = 120): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
