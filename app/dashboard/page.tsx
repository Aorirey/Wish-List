import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Мои вишлисты",
  description: "Управляйте своими списками желаний, добавляйте и редактируйте товары.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
