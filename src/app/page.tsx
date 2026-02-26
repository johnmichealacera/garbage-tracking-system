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
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-semibold">
          Garbage Tracking System
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to manage garbage collection routes, trucks, and pickups.
        </p>
        <Link href="/sign-in">
          <Button>Go to sign in</Button>
        </Link>
      </div>
    </main>
  );
}

