import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { FLOOD_ZONES, type RiskLevel } from "@/data/indianCities";
import "leaflet/dist/leaflet.css";

const RISK_COLORS: Record<RiskLevel, string> = {
  safe: "#22c55e",
  watch: "#eab308",
  warning: "#f97316",
  danger: "#ef4444",
};

const RISK_LABELS: Record<RiskLevel, string> = {
  safe: "Safe",
  watch: "Watch",
  warning: "Warning",
  danger: "Danger",
};

function FitIndia() {
  const map = useMap();
  useEffect(() => {
    map.setView([22.5, 82], 5);
  }, [map]);
  return null;
}

export default function FloodMap() {
  return (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        center={[22.5, 82]}
        zoom={5}
        scrollWheelZoom
        className="w-full h-full min-h-[500px]"
      >
        <FitIndia />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {FLOOD_ZONES.map((zone) => (
          <CircleMarker
            key={zone.name}
            center={[zone.lat, zone.lon]}
            radius={zone.risk === "danger" ? 18 : zone.risk === "warning" ? 14 : 10}
            pathOptions={{
              color: RISK_COLORS[zone.risk],
              fillColor: RISK_COLORS[zone.risk],
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-base">{zone.name}</strong>
                <br />
                <span className="text-muted-foreground">{zone.state}</span>
                <br />
                <span
                  className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: RISK_COLORS[zone.risk] }}
                >
                  {RISK_LABELS[zone.risk]}
                </span>
                <p className="mt-1 text-xs">{zone.description}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur border rounded-lg p-3 text-xs">
        <div className="font-semibold mb-2">Risk Level</div>
        {(["danger", "warning", "watch", "safe"] as RiskLevel[]).map((level) => (
          <div key={level} className="flex items-center gap-2 mb-1">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: RISK_COLORS[level] }} />
            <span>{RISK_LABELS[level]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
