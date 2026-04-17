import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, Leaf, LogIn, MapPin } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[480px] w-[480px] rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid flex-1 items-center gap-6 lg:grid-cols-[1fr_1.03fr] lg:items-stretch lg:gap-10 xl:gap-14">
          <div className="flex flex-col items-center text-center lg:h-full lg:justify-center lg:items-start lg:text-left">
            <div className="mb-4 flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-1 rounded-[2rem] bg-linear-to-br from-primary/20 via-transparent to-teal-500/15 blur-md" />
                <div className="relative rounded-[1.5rem] border border-border/80 bg-card/90 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur-sm dark:bg-card/80 dark:ring-white/10">
                  <Image
                    src="/socorro_logo.png"
                    alt="Seal of the Municipality of Socorro, Surigao del Norte"
                    width={180}
                    height={180}
                    className="h-24 w-24 object-contain sm:h-32 sm:w-32"
                    priority
                  />
                </div>
              </div>
            </div>

            <p className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              Surigao del Norte
            </p>

            <h1 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.7rem] lg:leading-[1.08]">
              Socorro Garbage
              <span className="block bg-linear-to-r from-primary to-teal-600 bg-clip-text text-transparent dark:from-primary dark:to-teal-400">
                Tracking System
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:mx-0">
              A digital service for the Local Government Unit: plan collection
              routes across barangays, track pickups and missed stops, and keep
              residents informed—clearly and in one place.
            </p>

            <ul className="mt-4 flex flex-col gap-2 text-left text-sm text-muted-foreground sm:max-w-md">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Leaf className="size-3.5" />
                </span>
                <span>
                  <span className="font-medium text-foreground">
                    Cleaner barangays
                  </span>{" "}
                  — structured routes and documented collection activity.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarDays className="size-3.5" />
                </span>
                <span>
                  <span className="font-medium text-foreground">
                    Public schedule
                  </span>{" "}
                  — see today&apos;s runs without signing in.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex w-full flex-col justify-center lg:h-full">
            <div className="rounded-2xl border border-border/90 bg-card/95 p-5 shadow-2xl ring-1 ring-black/4 backdrop-blur-md dark:bg-card/90 dark:ring-white/6 sm:p-6 lg:flex lg:h-full lg:flex-col">
              <p className="text-xs font-medium text-muted-foreground">
                Get started
              </p>
              <p className="mt-0.5 text-lg font-semibold tracking-tight">
                Staff &amp; field teams
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Sign in to manage routes, trucks, drivers, and reports. Citizens
                can use the schedule link below without an account.
              </p>

              <div
                className="mt-4 min-h-28 flex-1 rounded-xl border border-primary/20 bg-cover bg-center shadow-inner sm:min-h-32 lg:min-h-0"
                style={{
                  backgroundImage:
                    "url('https://res.cloudinary.com/dofpspduc/image/upload/f_webp/v1776392930/lucid-origin_futuristic_smart_city_waste_management_system_glowing_digital_dashboard_interfac-0_eynr1k.jpg')",
                }}
                aria-hidden
              />

              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-10 w-full gap-2 text-sm shadow-md transition-all hover:shadow-lg",
                  )}
                >
                  <LogIn className="size-4" />
                  Sign in
                </Link>
                <Link
                  href="/schedule"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-10 w-full gap-2 border-primary/25 bg-background/80 text-sm hover:bg-primary/5",
                  )}
                >
                  <CalendarDays className="size-4" />
                  View collection schedule
                </Link>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                Official LGU tool for the{" "}
                <span className="font-medium text-foreground/90">
                  Municipality of Socorro
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-4 border-t border-border/60 pt-3 text-center text-xs text-muted-foreground">
          <p>
            Garbage Tracking System · Socorro LGU · Province of Surigao del Norte
          </p>
        </footer>
      </div>
    </main>
  );
}
