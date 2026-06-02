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

export interface DriverLocation {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

interface RouteMapInnerProps {
  stops: StopWithCoords[];
  completedStopIds: Set<string>;
  driverLocation?: DriverLocation | null;
  mapHeightPx?: number;
}

function formatAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 10) return "Just now";
  if (secs < 60) return `${secs}s ago`;
  return `${Math.floor(secs / 60)}m ago`;
}

export function RouteMapInner({
  stops,
  completedStopIds,
  driverLocation,
  mapHeightPx = 400,
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
      : driverLocation
        ? [driverLocation.latitude, driverLocation.longitude]
        : MAP_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={MAP_DEFAULT_ZOOM}
      style={{ height: mapHeightPx, width: "100%" }}
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
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isCompleted ? "Completed" : "Pending"}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {driverLocation && (
        <>
          {/* Outer halo ring */}
          <CircleMarker
            center={[driverLocation.latitude, driverLocation.longitude]}
            radius={20}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#2563eb",
              fillOpacity: 0.12,
              weight: 1.5,
            }}
          />
          {/* Inner dot */}
          <CircleMarker
            center={[driverLocation.latitude, driverLocation.longitude]}
            radius={9}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#2563eb",
              fillOpacity: 0.95,
              weight: 2.5,
            }}
          >
            <Popup>
              <div className="min-w-[160px] space-y-1 p-1">
                <p className="font-semibold text-blue-700">📍 Driver location</p>
                <p className="text-xs text-gray-500">
                  Last updated: {formatAgo(driverLocation.updatedAt)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        </>
      )}
    </MapContainer>
  );
}
