"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

interface RouteMapInnerProps {
  stops: StopWithCoords[];
  completedStopIds: Set<string>;
}

export function RouteMapInner({
  stops,
  completedStopIds,
}: RouteMapInnerProps) {
  const stopsWithCoords = stops.filter(
    (s): s is StopWithCoords & { latitude: number; longitude: number } =>
      s.latitude != null && s.longitude != null,
  );

  const center: [number, number] =
    stopsWithCoords.length > 0
      ? [
          stopsWithCoords.reduce((a, s) => a + s.latitude, 0) /
            stopsWithCoords.length,
          stopsWithCoords.reduce((a, s) => a + s.longitude, 0) /
            stopsWithCoords.length,
        ]
      : MAP_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={MAP_DEFAULT_ZOOM}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stopsWithCoords.map((stop) => {
        const isCompleted = completedStopIds.has(stop.id);
        return (
          <CircleMarker
            key={stop.id}
            center={[stop.latitude, stop.longitude]}
            radius={10}
            pathOptions={{
              color: isCompleted ? "#22c55e" : "#6b7280",
              fillColor: isCompleted ? "#22c55e" : "#6b7280",
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[180px] space-y-1 p-1">
                <p className="font-semibold">
                  #{stop.sequence} {stop.name ?? stop.address ?? "Stop"}
                </p>
                {stop.address && (
                  <p className="text-sm text-muted-foreground">
                    {stop.address}
                  </p>
                )}
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    isCompleted
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {isCompleted ? "Completed" : "Pending"}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
