import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-semibold">
          Socorro Garbage Tracking System
        </h1>
        <p className="text-muted-foreground text-sm">
          Municipality of Socorro, Surigao del Norte
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
            <Button className="w-full">Sign in (Staff)</Button>
          </Link>
          <Link href="/schedule">
            <Button variant="outline" className="w-full">
              View collection schedule
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

