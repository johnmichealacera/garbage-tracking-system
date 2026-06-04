"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { BASURAHAN } from "@/lib/terminology";

const StopLocationMapInner = dynamic(
  () =>
    import("./stop-location-map-inner").then((m) => m.StopLocationMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(42vh,320px)] items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading map…</p>
      </div>
    ),
  },
);

function formatCoord(n: number): string {
  return n.toFixed(6);
}

interface StopLocationPickerProps {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
  disabled?: boolean;
}

export function StopLocationPicker({
  latitude,
  longitude,
  onChange,
  disabled,
}: StopLocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [draftLat, setDraftLat] = useState(latitude);
  const [draftLng, setDraftLng] = useState(longitude);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        disabled={disabled}
        onClick={() => {
          setDraftLat(latitude);
          setDraftLng(longitude);
          setOpen(true);
        }}
      >
        <MapPin className="mr-1.5 size-4" />
        Pick on map
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border bg-background shadow-lg">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">{BASURAHAN.setLocationDialogTitle}</h3>
              <p className="text-sm text-muted-foreground">
                Map of Socorro, Surigao del Norte. Click the map to place this{" "}
                {BASURAHAN.helper}. You can still edit the coordinates below.
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <StopLocationMapInner
                latitude={draftLat}
                longitude={draftLng}
                onLocationChange={(lat, lng) => {
                  setDraftLat(formatCoord(lat));
                  setDraftLng(formatCoord(lng));
                }}
              />
            </div>
            <div className="grid gap-3 border-t p-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Latitude
                </label>
                <input
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={draftLat}
                  onChange={(e) => setDraftLat(e.target.value)}
                  placeholder="9.621"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Longitude
                </label>
                <input
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={draftLng}
                  onChange={(e) => setDraftLng(e.target.value)}
                  placeholder="125.964"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t px-4 py-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const pl = parseFloat(draftLat.trim());
                  const pn = parseFloat(draftLng.trim());
                  if (Number.isFinite(pl) && Number.isFinite(pn)) {
                    onChange(formatCoord(pl), formatCoord(pn));
                  } else {
                    onChange(draftLat.trim(), draftLng.trim());
                  }
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
