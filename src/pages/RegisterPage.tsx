import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscribeSection from "@/components/SubscribeSection";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 glass-bg flex items-center">
        <div className="w-full"><SubscribeSection /></div>
      </main>
      <Footer />
    </div>
  );
}
