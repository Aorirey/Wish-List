import { Globe2, Link2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Visibility } from "@/lib/types";

const CONFIG: Record<
  Visibility,
  { label: string; icon: typeof Globe2; variant: "primary" | "accent" | "warning" }
> = {
  PUBLIC: { label: "Публичный", icon: Globe2, variant: "primary" },
  LINK: { label: "По ссылке", icon: Link2, variant: "accent" },
  PRIVATE: { label: "Приватный", icon: Lock, variant: "warning" },
};

export function VisibilityBadge({ value }: { value: Visibility }) {
  const { label, icon: Icon, variant } = CONFIG[value];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
