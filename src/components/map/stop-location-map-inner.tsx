"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  MAP_DEFAULT_ZOOM,
  SOCORRO_CENTER,
  SOCORRO_MAX_BOUNDS,
} from "@/lib/constants";

function MapClickHandler({
  onLocation,
}: {
  onLocation: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function parseCoord(s: string): number | null {
  const n = parseFloat(s.trim());
  return Number.isFinite(n) ? n : null;
}

export function StopLocationMapInner({
  latitude,
  longitude,
  onLocationChange,
}: {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  const lat = parseCoord(latitude);
  const lng = parseCoord(longitude);

  const center = useMemo<[number, number]>(() => {
    if (lat != null && lng != null) return [lat, lng];
    return [SOCORRO_CENTER[0], SOCORRO_CENTER[1]];
  }, [lat, lng]);

  const hasMarker = lat != null && lng != null;

  return (
    <MapContainer
      center={center}
      zoom={MAP_DEFAULT_ZOOM}
      minZoom={11}
      maxBounds={SOCORRO_MAX_BOUNDS}
      maxBoundsViscosity={0.85}
      style={{ height: "min(42vh, 320px)", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler
        onLocation={(la, ln) => {
          onLocationChange(la, ln);
        }}
      />
      {hasMarker ? (
        <CircleMarker
          center={[lat, lng]}
          radius={11}
          pathOptions={{
            color: "#0d9488",
            fillColor: "#14b8a6",
            fillOpacity: 0.85,
            weight: 2,
          }}
        />
      ) : null}
    </MapContainer>
  );
}
