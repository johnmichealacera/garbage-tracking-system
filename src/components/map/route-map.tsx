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
  /** Override helper text when no coordinates (e.g. public schedule vs staff). */
  emptyMessage?: string;
  /** Map height in pixels (default 400). */
  mapHeightPx?: number;
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
  const { emptyMessage, mapHeightPx, ...rest } = props;
  const stopsWithCoords = props.stops.filter(
    (s) => s.latitude != null && s.longitude != null,
  );

  if (stopsWithCoords.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border bg-muted/30 px-4 text-center"
        style={{ height: mapHeightPx ?? 400 }}
      >
        <p className="text-sm text-muted-foreground">
          {emptyMessage ??
            "No stop coordinates available. Add latitude/longitude to stops to see them on the map."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <RouteMapInner {...rest} mapHeightPx={mapHeightPx} />
    </div>
  );
}
