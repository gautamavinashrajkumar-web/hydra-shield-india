import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Droplets, ShieldAlert, Phone, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getHelplineForState } from "@/data/helplineData";

interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
  feature_code?: string;
}

interface SearchResult extends GeoResult {
  rainfall: number;
  floodRisk: "Safe" | "Watch" | "Warning" | "Danger";
  helpline: string;
  helplineLabel: string;
}

function getFloodRisk(rainfall: number): SearchResult["floodRisk"] {
  if (rainfall >= 50) return "Danger";
  if (rainfall >= 10) return "Warning";
  if (rainfall > 0) return "Watch";
  return "Safe";
}

const RISK_STYLES: Record<SearchResult["floodRisk"], string> = {
  Safe: "bg-success text-success-foreground",
  Watch: "bg-warning text-warning-foreground",
  Warning: "bg-[hsl(25,90%,50%)] text-white",
  Danger: "bg-danger text-danger-foreground",
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json&country_code=IN`,
        { signal: controller.signal }
      );
      const geoData = await geoRes.json();
      const locations: GeoResult[] = geoData.results || [];

      if (locations.length === 0) {
        setResults([]);
        setOpen(true);
        setLoading(false);
        return;
      }

      // Fetch weather for all results in parallel
      const weatherPromises = locations.map(async (loc) => {
        try {
          const wRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=precipitation&timezone=auto`,
            { signal: controller.signal }
          );
          const wData = await wRes.json();
          return wData.current?.precipitation ?? 0;
        } catch {
          return 0;
        }
      });

      const rainfalls = await Promise.all(weatherPromises);

      const searchResults: SearchResult[] = locations.map((loc, i) => {
        const rainfall = rainfalls[i];
        const helplineInfo = getHelplineForState(loc.admin1);
        return {
          ...loc,
          rainfall,
          floodRisk: getFloodRisk(rainfall),
          helpline: helplineInfo.helpline,
          helplineLabel: helplineInfo.label,
        };
      });

      setResults(searchResults);
      setOpen(true);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setResults([]);
        setOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  function handleSelect(r: SearchResult) {
    setOpen(false);
    setQuery("");
    navigate(`/location/${r.latitude}/${r.longitude}/${encodeURIComponent(r.name)}${r.admin1 ? `?state=${encodeURIComponent(r.admin1)}` : ""}`);
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search any city, town or village..."
          className="pl-9 pr-9 h-9 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-primary-foreground/60" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-xl z-50 max-h-[420px] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching...
            </div>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="py-6 text-center text-muted-foreground text-sm">
              No locations found for "{query}"
            </div>
          )}
          {!loading && results.map((r) => (
            <button
              key={`${r.id}-${r.latitude}`}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 hover:bg-accent/10 border-b last:border-b-0 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent shrink-0" />
                    <span className="font-semibold text-foreground truncate">{r.name}</span>
                    {r.admin1 && <span className="text-xs text-muted-foreground">({r.admin1})</span>}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                    <span className="flex items-center gap-1 text-accent">
                      <Droplets className="h-3.5 w-3.5" />
                      <strong>{r.rainfall} mm</strong> rainfall
                    </span>
                    <Badge className={`${RISK_STYLES[r.floodRisk]} text-[10px] px-1.5 py-0`}>
                      <ShieldAlert className="h-3 w-3 mr-0.5" />
                      {r.floodRisk}
                    </Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {r.helpline}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
