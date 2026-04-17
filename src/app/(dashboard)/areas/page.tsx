"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { Map, MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";

interface Area {
  id: string;
  name: string;
  description: string | null;
  centerLat: number | null;
  centerLng: number | null;
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error("Failed to load areas");
    return res.json();
  });

export default function AreasPage() {
  const { data, error, isLoading } = useSWR<Area[]>("/api/areas", fetcher);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message ?? "Failed to create area");
        return;
      }
      setName("");
      setDescription("");
      mutate("/api/areas");
      toast.success("Area created");
    } catch {
      toast.error("Failed to create area");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Coverage"
        icon={<Map className="size-5" />}
        title="Barangays"
        description="Define the collection areas across the Municipality of Socorro."
      />

      {error ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            {error.message}
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold tracking-tight">
            Add barangay
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Add a new area that can be assigned to collection routes.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="max-w-xl space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Brgy. Poblacion"
                className="h-10 bg-background/80"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes or landmarks"
                className="h-10 bg-background/80"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 gap-2 shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="size-4" />
              {isSubmitting ? "Saving..." : "Save barangay"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              All barangays
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {data?.length ?? 0} registered
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : data?.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((area) => (
                <div
                  key={area.id}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/30 hover:bg-background hover:shadow-md"
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/8 blur-2xl opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="relative flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                      <MapPin className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {area.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {area.description ?? "No description"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Map className="size-5" />
              </div>
              <p className="mt-3 text-sm font-medium">No barangays yet</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Add your first barangay using the form above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
