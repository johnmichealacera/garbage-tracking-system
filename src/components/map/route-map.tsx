"use client";

import dynamic from "next/dynamic";
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from "@/lib/constants";

interface StopWithCoords {
  id: string;
  sequence: number;
  name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  type?: string;
}

interface RouteMapProps {
  stops: StopWithCoords[];
  completedStopIds: Set<string>;
}

const RouteMapInner = dynamic(
  () =>
    import("./route-map-inner").then((mod) => mod.RouteMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    ),
  },
);

export function RouteMap(props: RouteMapProps) {
  const stopsWithCoords = props.stops.filter(
    (s) => s.latitude != null && s.longitude != null,
  );

  if (stopsWithCoords.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-sm text-muted-foreground">
          No stop coordinates available. Add latitude/longitude to stops to see
          them on the map.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <RouteMapInner {...props} />
    </div>
  );
}
