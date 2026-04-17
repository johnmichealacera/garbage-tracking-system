import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  icon,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10 sm:p-6",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-teal-500/10 text-primary ring-1 ring-inset ring-primary/20">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
