import { cn } from "@/lib/utils";

export type StatusTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

const toneStyles: Record<StatusTone, string> = {
  neutral:
    "bg-muted/70 text-foreground/80 ring-border/80",
  primary:
    "bg-primary/10 text-primary ring-primary/25",
  success:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-400",
  danger:
    "bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-400",
  info:
    "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-400",
};

const dotStyles: Record<StatusTone, string> = {
  neutral: "bg-muted-foreground/70",
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset",
        toneStyles[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotStyles[tone])} />
      {label}
    </span>
  );
}

export function routeStatusToTone(status: string): StatusTone {
  const s = status.toUpperCase();
  if (s === "COMPLETED") return "success";
  if (s === "IN_PROGRESS" || s === "STARTED") return "info";
  if (s === "CANCELLED" || s === "CANCELED") return "danger";
  if (s === "PLANNED" || s === "SCHEDULED") return "primary";
  return "neutral";
}

export function truckStatusToTone(status: string): StatusTone {
  const s = status.toUpperCase();
  if (s === "ACTIVE" || s === "AVAILABLE") return "success";
  if (s === "MAINTENANCE" || s === "SERVICING") return "warning";
  if (s === "OUT_OF_SERVICE" || s === "RETIRED") return "danger";
  if (s === "IN_USE" || s === "ASSIGNED") return "info";
  return "neutral";
}
