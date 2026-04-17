"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { Plus, Truck as TruckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  StatusBadge,
  truckStatusToTone,
} from "@/components/dashboard/status-badge";

interface Truck {
  id: string;
  code: string;
  plateNumber: string | null;
  capacityKg: number | null;
  status: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TrucksPage() {
  const { data, isLoading } = useSWR<Truck[]>("/api/trucks", fetcher);
  const [code, setCode] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/trucks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          plateNumber: plateNumber || null,
          capacityKg: capacityKg ? Number.parseInt(capacityKg, 10) : null,
        }),
      });
      if (!res.ok) {
        toast.error("Failed to create truck");
        return;
      }
      setCode("");
      setPlateNumber("");
      setCapacityKg("");
      mutate("/api/trucks");
      toast.success("Truck created");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Fleet"
        icon={<TruckIcon className="size-5" />}
        title="Trucks"
        description="Register the fleet used for garbage collection and monitor their availability."
      />

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold tracking-tight">
            Add truck
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Give it a unique code so it can be assigned to routes.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid gap-4 md:grid-cols-4"
          >
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. TRK-01"
                className="h-10 bg-background/80"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate">Plate number</Label>
              <Input
                id="plate"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="Optional"
                className="h-10 bg-background/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (kg)</Label>
              <Input
                id="capacity"
                value={capacityKg}
                onChange={(e) => setCapacityKg(e.target.value)}
                type="number"
                min={0}
                placeholder="Optional"
                className="h-10 bg-background/80"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full gap-2 shadow-md transition-all hover:shadow-lg"
              >
                <Plus className="size-4" />
                {isSubmitting ? "Saving..." : "Save truck"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              All trucks
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {data?.length ?? 0} in fleet
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data?.length ? (
            <div className="overflow-hidden rounded-xl border border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2.5 text-left">Code</th>
                      <th className="px-4 py-2.5 text-left">Plate</th>
                      <th className="px-4 py-2.5 text-right">Capacity (kg)</th>
                      <th className="px-4 py-2.5 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((truck) => (
                      <tr
                        key={truck.id}
                        className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <TruckIcon className="size-3.5" />
                            </span>
                            <span className="font-mono text-xs font-semibold">
                              {truck.code}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle text-muted-foreground">
                          {truck.plateNumber ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right align-middle tabular-nums">
                          {truck.capacityKg ?? "—"}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <StatusBadge
                            label={truck.status
                              .toLowerCase()
                              .replace(/_/g, " ")}
                            tone={truckStatusToTone(truck.status)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TruckIcon className="size-5" />
              </div>
              <p className="mt-3 text-sm font-medium">No trucks yet</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Add your first truck using the form above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
