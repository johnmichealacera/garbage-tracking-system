"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Truck {
  id: string;
  code: string;
}

interface Area {
  id: string;
  name: string;
}

interface Driver {
  id: string;
  name: string;
  email: string;
}

interface RouteStop {
  id: string;
  sequence: number;
  name: string | null;
  address: string | null;
  type: string;
  expectedVolumeKg: number | null;
  latitude: number | null;
  longitude: number | null;
}

interface RouteData {
  id: string;
  name: string;
  scheduledDate: string;
  truckId: string;
  areaId: string;
  driverId: string | null;
  stops: RouteStop[];
}

interface StopInput {
  name: string;
  address: string;
  type: string;
  expectedVolumeKg: string;
  latitude: string;
  longitude: string;
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error("Failed to load");
    return res.json();
  });

export default function EditRoutePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: route, error } = useSWR<RouteData>(
    id ? `/api/routes/${id}` : null,
    fetcher,
  );
  const { data: trucks } = useSWR<Truck[]>("/api/trucks", fetcher);
  const { data: areas } = useSWR<Area[]>("/api/areas", fetcher);
  const { data: drivers } = useSWR<Driver[]>("/api/users/drivers", fetcher);

  const [name, setName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [truckId, setTruckId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [stops, setStops] = useState<StopInput[]>([
    {
      name: "",
      address: "",
      type: "RESIDENTIAL",
      expectedVolumeKg: "",
      latitude: "",
      longitude: "",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (route) {
      setName(route.name);
      setScheduledDate(route.scheduledDate.slice(0, 10));
      setTruckId(route.truckId);
      setAreaId(route.areaId);
      setDriverId(route.driverId ?? "");
      setStops(
        route.stops.length
          ? route.stops.map((s) => ({
              name: s.name ?? "",
              address: s.address ?? "",
              type: s.type,
              expectedVolumeKg: s.expectedVolumeKg?.toString() ?? "",
              latitude: s.latitude?.toString() ?? "",
              longitude: s.longitude?.toString() ?? "",
            }))
          : [
              {
                name: "",
                address: "",
                type: "RESIDENTIAL",
                expectedVolumeKg: "",
                latitude: "",
                longitude: "",
              },
            ],
      );
    }
  }, [route]);

  function addStop() {
    setStops((s) => [
      ...s,
      {
        name: "",
        address: "",
        type: "RESIDENTIAL",
        expectedVolumeKg: "",
        latitude: "",
        longitude: "",
      },
    ]);
  }

  function removeStop(index: number) {
    setStops((s) => s.filter((_, i) => i !== index));
  }

  function updateStop(index: number, field: keyof StopInput, value: string) {
    setStops((s) =>
      s.map((stop, i) => (i === index ? { ...stop, [field]: value } : stop)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !scheduledDate || !truckId || !areaId) {
      toast.error("Please fill required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/routes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          scheduledDate,
          truckId,
          areaId,
          driverId: driverId || null,
          stops: stops
            .filter((s) => s.name.trim() || s.address.trim())
            .map((s, i) => ({
              sequence: i + 1,
              name: s.name.trim() || null,
              address: s.address.trim() || null,
              type: s.type,
              expectedVolumeKg: s.expectedVolumeKg
                ? parseInt(s.expectedVolumeKg, 10)
                : null,
              latitude: s.latitude.trim()
                ? parseFloat(s.latitude)
                : null,
              longitude: s.longitude.trim()
                ? parseFloat(s.longitude)
                : null,
            })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message ?? "Failed to update route");
        return;
      }
      toast.success("Route updated");
      router.push(`/routes/${id}`);
    } catch {
      toast.error("Failed to update route");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href={`/routes/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        </Link>
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={`/routes/${id}`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 size-4" />
          Back to route
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit route</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Route name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Scheduled date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="truck">Truck *</Label>
                <select
                  id="truck"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={truckId}
                  onChange={(e) => setTruckId(e.target.value)}
                  required
                >
                  <option value="">Select truck</option>
                  {trucks?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area *</Label>
                <select
                  id="area"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  required
                >
                  <option value="">Select area</option>
                  {areas?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">Driver</Label>
                <select
                  id="driver"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                >
                  <option value="">No driver assigned</option>
                  {drivers?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Stops</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStop}>
                  <Plus className="mr-1 size-4" />
                  Add stop
                </Button>
              </div>
              <div className="mt-2 space-y-3">
                {stops.map((stop, i) => (
                  <div key={i} className="flex gap-2 rounded-lg border p-3">
                    <div className="flex-1 grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                      <Input
                        placeholder="Name"
                        value={stop.name}
                        onChange={(e) => updateStop(i, "name", e.target.value)}
                      />
                      <Input
                        placeholder="Address"
                        value={stop.address}
                        onChange={(e) => updateStop(i, "address", e.target.value)}
                      />
                      <select
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                        value={stop.type}
                        onChange={(e) => updateStop(i, "type", e.target.value)}
                      >
                        <option value="RESIDENTIAL">Residential</option>
                        <option value="COMMERCIAL">Commercial</option>
                        <option value="MIXED">Mixed</option>
                      </select>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Expected kg"
                        value={stop.expectedVolumeKg}
                        onChange={(e) =>
                          updateStop(i, "expectedVolumeKg", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        step="any"
                        placeholder="Latitude (e.g. 9.6)"
                        value={stop.latitude}
                        onChange={(e) =>
                          updateStop(i, "latitude", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        step="any"
                        placeholder="Longitude (e.g. 125.9)"
                        value={stop.longitude}
                        onChange={(e) =>
                          updateStop(i, "longitude", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStop(i)}
                      disabled={stops.length <= 1}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
              <Link href={`/routes/${id}`}>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer transition-colors hover:bg-accent"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
