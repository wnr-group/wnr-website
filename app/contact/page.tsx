import type { Metadata } from "next";
import { MapPin, Building2, MessageCircle } from "lucide-react";
import { Eyebrow } from "@/components/ui/Section";
import { LeadForm } from "@/components/ui/LeadForm";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Contact — Let's Talk About Your Operations",
  description:
    "Tell us about your business. We'll tell you how we can help. WnR Group — Tamil Nadu → India → Europe.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-18">
      <div
        className="grid-blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Info */}
        <div className="flex flex-col gap-8">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 font-display text-[length:var(--text-hero)] font-bold leading-[1.05] text-ink">
              Let&rsquo;s talk about your <span className="text-forest">operations.</span>
            </h1>
            <p className="mt-6 max-w-md text-[length:var(--text-lead)] leading-relaxed text-body">
              Whether you&rsquo;re streamlining operations, building a custom
              platform, or adopting an industry operating system — WnR is ready.
            </p>
          </div>

          <dl className="flex flex-col gap-5 border-t border-line pt-8">
            <Detail icon={<MapPin size={18} />} label="Headquarters" value={company.hq} />
            <Detail icon={<Building2 size={18} />} label="Category" value={company.category} />
            <Detail icon={<MessageCircle size={18} />} label="Reach" value={company.geography} />
          </dl>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-line bg-paper p-7 shadow-card md:p-9">
          <LeadForm />
        </div>
      </div>
    </section>
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
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-wash text-forest">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
          {label}
        </dt>
        <dd className="mt-0.5 text-[0.95rem] text-ink">{value}</dd>
      </div>
    </div>
  );
}
