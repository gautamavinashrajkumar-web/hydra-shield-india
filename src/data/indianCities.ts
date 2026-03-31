export interface IndianCity {
  name: string;
  state: string;
  lat: number;
  lon: number;
  riverName?: string;
}

export const INDIAN_CITIES: IndianCity[] = [
  { name: "Delhi", state: "Delhi", lat: 28.6139, lon: 77.209, riverName: "Yamuna" },
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lon: 72.8777 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, riverName: "Adyar" },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, riverName: "Hooghly" },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lon: 78.4867, riverName: "Musi" },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, riverName: "Sabarmati" },
  { name: "Patna", state: "Bihar", lat: 25.6093, lon: 85.1376, riverName: "Ganga" },
  { name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, riverName: "Brahmaputra" },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, riverName: "Gomti" },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126 },
];

export const FLOOD_ZONES = [
  { name: "Brahmaputra Basin", state: "Assam", lat: 26.2, lon: 92.0, risk: "danger" as const, description: "Highly flood-prone during monsoon season" },
  { name: "Kosi River Basin", state: "Bihar", lat: 25.8, lon: 86.9, risk: "danger" as const, description: "Known as the 'Sorrow of Bihar'" },
  { name: "Godavari Delta", state: "Andhra Pradesh", lat: 16.5, lon: 82.0, risk: "warning" as const, description: "Seasonal flooding during heavy rains" },
  { name: "Mumbai Coastal", state: "Maharashtra", lat: 19.1, lon: 72.9, risk: "warning" as const, description: "Urban flooding during monsoon" },
  { name: "Yamuna Floodplain", state: "Delhi", lat: 28.65, lon: 77.25, risk: "watch" as const, description: "Periodic flooding when Yamuna swells" },
  { name: "Sundarbans Delta", state: "West Bengal", lat: 21.9, lon: 88.9, risk: "danger" as const, description: "Cyclone and tidal surge flooding" },
  { name: "Mahanadi Basin", state: "Odisha", lat: 20.3, lon: 84.0, risk: "warning" as const, description: "River overflow during monsoons" },
  { name: "Kerala Backwaters", state: "Kerala", lat: 9.5, lon: 76.3, risk: "watch" as const, description: "Flash floods and landslides" },
  { name: "Cauvery Delta", state: "Tamil Nadu", lat: 10.8, lon: 79.7, risk: "watch" as const, description: "Cyclone-related flooding" },
  { name: "Tapi River Basin", state: "Gujarat", lat: 21.2, lon: 72.8, risk: "warning" as const, description: "River flooding during heavy rainfall" },
];

export type RiskLevel = "safe" | "watch" | "warning" | "danger";
