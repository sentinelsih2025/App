"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const locations = [
  { label: "New Delhi", lat: 28.6139, lng: 77.209 },
  { label: "Haryana", lat: 30.726, lng: 76.865 },
  { label: "Jammu & Kashmir", lat: 32.93, lng: 75.15 },
  { label: "West Bengal", lat: 22.55, lng: 88.23 },
  { label: "Maharashtra", lat: 18.52, lng: 73.88 },
  { label: "Uttar Pradesh", lat: 26.817359, lng: 80.941464 },
  { label: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { label: "Himachal Pradesh", lat: 31.1, lng: 77.1 },
];

const placeCoordinates = Object.fromEntries(
  locations.map(loc => [loc.label, { lat: loc.lat, lng: loc.lng }])
);

export default function Map() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const markerArrRef = useRef<maplibregl.Marker[]>([]);
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const MAPTILER_KEY = "DFbBU6xGl4Fm0lY056Bo";
    const map = new maplibregl.Map({
      container: "mapContainer",
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
      center: [78.6569, 22.9734],
      zoom: 4.8,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  function goToLocation(selected: string) {
    if (!selected || !placeCoordinates[selected] || !mapRef.current) return;
    const { lat, lng } = placeCoordinates[selected];
    markerRef.current?.remove();
    markerRef.current = new maplibregl.Marker({ color: "blue" })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
    mapRef.current.flyTo({ center: [lng, lat], zoom: 10 });
    if (statusRef.current) statusRef.current.textContent = `Moved to ${selected}`;
  }

  function showAllLocations() {
    if (!mapRef.current) return;
    markerArrRef.current.forEach(marker => marker.remove());
    markerArrRef.current = [];
    const bounds = new maplibregl.LngLatBounds();
    locations.forEach(({ label, lat, lng }) => {
      const marker = new maplibregl.Marker({ color: "purple" })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup().setText(label))
        .addTo(mapRef.current!);
      markerArrRef.current.push(marker);
      bounds.extend([lng, lat]);
    });
    mapRef.current.fitBounds(bounds, { padding: 60 });
    if (statusRef.current) statusRef.current.textContent = "Showing all locations across India.";
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div id="inputBox"
        style={{
          position: "absolute", top: 10, left: 10, zIndex: 1000,
          background: "white", padding: 10, borderRadius: 5,
          fontFamily: "sans-serif", fontSize: 13,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          maxWidth: 260,
        }}>
        <h4>Go to a Location</h4>
        <select id="locationSelect"
          style={{ width: "100%", marginTop: 6 }}
          onChange={e => goToLocation(e.target.value)}
        >
          <option value="">-- Select a place --</option>
          {locations.map(loc => (
            <option value={loc.label} key={loc.label}>{loc.label}</option>
          ))}
        </select>
        <button
          style={{ width: "100%", marginTop: 6 }}
          onClick={() => {
            const selectEl = document.getElementById("locationSelect") as HTMLSelectElement;
            goToLocation(selectEl?.value);
          }}>Go</button>
        <button
          style={{ width: "100%", marginTop: 6 }}
          onClick={showAllLocations}
        >Show All Locations</button>
        <div id="status" ref={statusRef} style={{ marginTop: 6, fontSize: 11, color: "#555" }}></div>
      </div>
      <div id="mapContainer"
        style={{
          position: "absolute", top: 0, bottom: 0, left: 0, right: 0
        }} />
    </div>
  );
}
