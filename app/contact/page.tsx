import type { Metadata } from "next";
import { MapPin, Building2, MessageCircle } from "lucide-react";
import { LeadForm } from "@/components/ui/LeadForm";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Contact — Let's Talk About Your Operations",
  description:
    "Tell us about your business. We'll tell you how we can help. WnR Group — Tamil Nadu → India → Europe.",
};

export default function ContactPage() {
  return (
    <>
      <div className="bg-forest pt-18" aria-hidden="true" />
      <section className="bg-forest px-5 pb-24 pt-16 text-cream sm:px-6 md:pb-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Info */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="flex items-center gap-3 text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-gold">
                <span className="h-px w-8 bg-gold" />
                Contact
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-cream md:text-5xl">
                Let&rsquo;s talk about your operations.
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/70">
                Whether you&rsquo;re streamlining operations, building a custom
                platform, or adopting an industry operating system — WnR is ready.
              </p>
            </div>

            <dl className="flex flex-col gap-5 border-t border-white/10 pt-8">
              <Detail icon={<MapPin size={18} />} label="Headquarters" value={company.hq} />
              <Detail icon={<Building2 size={18} />} label="Category" value={company.category} />
              <Detail icon={<MessageCircle size={18} />} label="Reach" value={company.geography} />
            </dl>
          </div>

          {/* Form on a cream card */}
          <div className="rounded-2xl bg-cream p-7 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)] md:p-9">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-2 text-gold">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
          {label}
        </dt>
        <dd className="mt-0.5 text-[0.95rem] text-cream/85">{value}</dd>
      </div>
    </div>
  );
}
