"use client";

import { Suspense, useState } from "react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarDays, Home, Leaf, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInValues = z.infer<typeof signInSchema>;

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (!result || result.error) {
        toast.error("Invalid email or password");
        return;
      }

      router.push(callbackUrl);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-2 text-foreground sm:px-6">
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[460px] w-[460px] rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-2xl"
        aria-hidden
      />

      <Card className="relative w-full max-w-md border-border/80 bg-card/95 p-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-md dark:bg-card/90 dark:ring-white/10 sm:p-8">
        <CardHeader className="space-y-3 px-0 text-center">
          <div className="mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 rounded-[1.5rem] bg-linear-to-br from-primary/20 via-transparent to-teal-500/15 blur-md" />
              <div className="relative rounded-[1.2rem] border border-border/70 bg-card/90 shadow-lg">
                <Image
                  src="/socorro_logo.png"
                  alt="Seal of the Municipality of Socorro, Surigao del Norte"
                  width={80}
                  height={80}
                  className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                  priority
                />
              </div>
            </div>
          </div>

          <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <Leaf className="size-3.5 text-primary" />
            Official LGU Access
          </p>

          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Sign in to continue
            </CardTitle>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Manage routes, schedules, trucks, and reporting from one secure
              dashboard.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-0">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@lgu.gov.ph"
                className="h-11 bg-background/80"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 bg-background/80"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-11 w-full gap-2 text-sm shadow-md transition-all hover:shadow-lg"
              disabled={isSubmitting}
            >
              <LogIn className="size-4" />
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="border-t border-border/70 pt-5">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Public access
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/"
                className={cn(
                  "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-primary/20 bg-background/80 px-4 text-sm font-medium shadow-xs transition-colors",
                  "hover:bg-primary/5 hover:text-foreground",
                )}
              >
                <Home className="size-4 shrink-0" />
                Home
              </Link>
              <Link
                href="/schedule"
                className={cn(
                  "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-primary/20 bg-background/80 px-4 text-sm font-medium shadow-xs transition-colors",
                  "hover:bg-primary/5 hover:text-foreground",
                )}
              >
                <CalendarDays className="size-4 shrink-0" />
                View collection schedule
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
          <Card className="w-full max-w-md animate-pulse p-6 sm:p-8">
            <CardHeader className="px-0">
              <div className="mx-auto mb-2 h-12 w-12 rounded-2xl bg-muted" />
              <div className="mx-auto h-6 w-40 rounded bg-muted" />
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="h-11 rounded bg-muted" />
              <div className="h-11 rounded bg-muted" />
              <div className="h-11 rounded bg-muted" />
            </CardContent>
          </Card>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
