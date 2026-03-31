import { useQuery } from "@tanstack/react-query";
import { INDIAN_CITIES, type IndianCity } from "@/data/indianCities";

export interface WeatherData {
  city: IndianCity;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  weatherCode: number;
  isDay: boolean;
}

async function fetchWeatherForCity(city: IndianCity): Promise<WeatherData> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,is_day&timezone=Asia/Kolkata`
  );
  if (!res.ok) throw new Error(`Failed to fetch weather for ${city.name}`);
  const data = await res.json();
  return {
    city,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    rainfall: data.current.precipitation,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
  };
}

export function useWeatherData() {
  return useQuery({
    queryKey: ["weather-all-cities"],
    queryFn: async () => {
      const results = await Promise.allSettled(INDIAN_CITIES.map(fetchWeatherForCity));
      return results
        .filter((r): r is PromiseFulfilledResult<WeatherData> => r.status === "fulfilled")
        .map((r) => r.value);
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 3 * 60 * 1000,
  });
}

export interface FloodApiData {
  city: IndianCity;
  dailyDischarge: number[];
  dates: string[];
}

export function useFloodData() {
  return useQuery({
    queryKey: ["flood-discharge"],
    queryFn: async () => {
      const riverCities = INDIAN_CITIES.filter((c) => c.riverName);
      const results = await Promise.allSettled(
        riverCities.map(async (city) => {
          const res = await fetch(
            `https://flood-api.open-meteo.com/v1/flood?latitude=${city.lat}&longitude=${city.lon}&daily=river_discharge&forecast_days=7`
          );
          if (!res.ok) throw new Error(`Failed for ${city.name}`);
          const data = await res.json();
          return {
            city,
            dailyDischarge: data.daily?.river_discharge || [],
            dates: data.daily?.time || [],
          } as FloodApiData;
        })
      );
      return results
        .filter((r): r is PromiseFulfilledResult<FloodApiData> => r.status === "fulfilled")
        .map((r) => r.value);
    },
    refetchInterval: 15 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}
