import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloodMap from "@/components/FloodMap";

export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold mb-2">Live Flood Map</h1>
          <p className="text-muted-foreground">
            Interactive map of India showing flood-prone zones and current risk levels. Click on markers for details.
          </p>
        </div>
        <div className="h-[600px]">
          <FloodMap />
        </div>
      </main>
      <Footer />
    </div>
  );
}
