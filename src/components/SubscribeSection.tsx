import { ShieldCheck, MessageSquare, MapPin } from "lucide-react";
import SubscribeForm from "./SubscribeForm";

export default function SubscribeSection() {
  return (
    <section id="subscribe" className="glass-bg py-16">
      <div className="container grid gap-10 lg:grid-cols-2 items-center">
        <div className="text-primary-foreground">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Subscribe to Emergency Alerts</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-lg">
            Get free email and in-app warnings when floods or severe weather threaten your area.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-accent" /> Instant email and app notifications</li>
            <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-accent" /> Alerts for your city or region</li>
            <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-accent" /> Your email is never shared</li>
          </ul>
        </div>
        <div className="glass-card p-6 md:p-8 text-primary-foreground">
          <SubscribeForm />
        </div>
      </div>
    </section>
  );
}
