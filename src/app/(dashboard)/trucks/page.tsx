"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Truck {
  id: string;
  code: string;
  plateNumber: string | null;
  capacityKg: number | null;
  status: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TrucksPage() {
  const { data } = useSWR<Truck[]>("/api/trucks", fetcher);
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Trucks</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add truck</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid gap-4 md:grid-cols-4"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium">Code</p>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Plate number</p>
              <Input
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Capacity (kg)</p>
              <Input
                value={capacityKg}
                onChange={(e) => setCapacityKg(e.target.value)}
                type="number"
                min={0}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All trucks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="text-left py-2 pr-4">Code</th>
                  <th className="text-left py-2 pr-4">Plate</th>
                  <th className="text-left py-2 pr-4">Capacity (kg)</th>
                  <th className="text-left py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((truck) => (
                  <tr key={truck.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{truck.code}</td>
                    <td className="py-2 pr-4">
                      {truck.plateNumber ?? "—"}
                    </td>
                    <td className="py-2 pr-4">
                      {truck.capacityKg ?? "—"}
                    </td>
                    <td className="py-2 pr-4">{truck.status}</td>
                  </tr>
                ))}
                {!data?.length && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-muted-foreground"
                    >
                      No trucks yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

