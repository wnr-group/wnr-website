import { ArrowRight } from "lucide-react";
import { Cta } from "@/components/ui/Cta";

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-canvas px-5 py-32 pt-40">
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
        aria-hidden="true"
      />
      <div className="relative flex max-w-md flex-col items-center gap-6 text-center">
        <span className="font-display text-8xl font-bold text-forest/20">404</span>
        <h1 className="font-display text-3xl font-bold text-ink">
          This page hasn&rsquo;t been built yet.
        </h1>
        <p className="text-body">
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
