import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Section";
import { CareerApplicationForm } from "@/components/CareerApplicationForm";

export const metadata: Metadata = {
  title: "Apply — Careers",
  description:
    "Submit your application to WnRTech. We review every application and respond within 5 business days if there's a match.",
  alternates: { canonical: "/careers/apply" },
  openGraph: {
    title: "Apply — Careers | WnRTech",
    description: "Submit your application to WnRTech.",
    url: "/careers/apply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply — Careers | WnRTech",
    description: "Submit your application to WnRTech.",
  },
};

interface ApplyPageProps {
  searchParams: Promise<{ role?: string }>;
}

export default async function CareersApplyPage({ searchParams }: ApplyPageProps) {
  const params = await searchParams;
  const role = typeof params.role === "string" ? params.role : "";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://wnrtech.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Careers",
        item: "https://wnrtech.com/careers",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Apply",
        item: "https://wnrtech.com/careers/apply",
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WnRTech",
    url: "https://wnrtech.com",
    sameAs: ["https://wnrtech.com"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, organizationSchema]),
        }}
      />

      <section className="relative overflow-hidden bg-canvas pt-24">
        {/* Blueprint grid texture */}
        <div
          className="grid-blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-[1200px] gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Info column */}
          <div className="flex flex-col gap-8">
            <Link
              href="/careers"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              aria-label="Back to Careers"
            >
              <ArrowLeft size={15} />
              Back to Careers
            </Link>

            <div>
              <Eyebrow>Apply</Eyebrow>
              <h1 className="mt-5 font-display text-[length:var(--text-hero)] font-bold leading-[1.05] text-ink">
                {role ? (
                  <>
                    Apply for{" "}
                    <span className="text-forest">{role}</span>
                  </>
                ) : (
                  <>
                    Join the{" "}
                    <span className="text-forest">WnR team.</span>
                  </>
                )}
              </h1>
              <p className="mt-6 max-w-md text-[length:var(--text-lead)] leading-relaxed text-body">
                We review every application and respond within 5 business days
                if there&rsquo;s a match. No ghosting, no black box.
              </p>
            </div>

            <dl className="flex flex-col gap-4 border-t border-line pt-8">
              <ProcessStep num="01" label="Apply" body="Complete the form and upload your resume." />
              <ProcessStep num="02" label="Review" body="We review every submission. No automated filters." />
              <ProcessStep num="03" label="Screen" body="A 30-minute call with our team within 5 business days." />
              <ProcessStep num="04" label="Offer" body="Fast decisions, no whiteboard trivia." />
            </dl>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-line bg-paper p-7 shadow-card md:p-9">
            <CareerApplicationForm initialRole={role} />
          </div>
        </div>
      </section>
    </>
  );
}

function ProcessStep({
  num,
  label,
  body,
}: {
  num: string;
  label: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-wash text-sm font-bold text-forest">
        {num}
      </span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
          {label}
        </dt>
        <dd className="mt-0.5 text-[0.95rem] text-body">{body}</dd>
      </div>
    </div>
  );
}
