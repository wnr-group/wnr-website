import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/ui/Cta";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center bg-forest px-5 py-32 text-cream">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <span className="font-display text-8xl font-bold text-gold/30">404</span>
        <h1 className="font-display text-3xl font-bold text-cream">
          This page hasn&rsquo;t been built yet.
        </h1>
        <p className="text-cream/70">
          The page you&rsquo;re looking for doesn&rsquo;t exist — but the system
          that does is one click away.
        </p>
        <Cta href="/" variant="primary" className="mt-2">
          Back to Home
          <ArrowRight size={16} />
        </Cta>
      </div>
    </section>
  );
}
