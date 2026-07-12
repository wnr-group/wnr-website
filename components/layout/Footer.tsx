import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Cta } from "@/components/ui/Cta";
import { company, recognition } from "@/content/company";

const columns: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Capabilities",
    links: [
      { href: "/capabilities#systems", label: "WnR Systems" },
      { href: "/capabilities#consulting", label: "WnR Consulting" },
      { href: "/capabilities#ai-labs", label: "WnR AI Labs" },
    ],
  },
  {
    heading: "Products",
    links: [
      { href: "/products/eduos", label: "EduOS" },
      { href: "/products/arenaos", label: "ArenaOS" },
      { href: "/products", label: "All Products" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/insights", label: "Insights" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-forest-deep text-white/70">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-14 sm:px-6 md:flex-row md:items-center md:justify-between md:py-16">
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight text-white md:text-4xl">
            Build the operational brain of your business.
          </h2>
          <Cta href="/contact" variant="on-dark" className="shrink-0 px-7 py-3.5 text-base">
            Get in Touch
            <ArrowUpRight size={18} />
          </Cta>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 md:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-4">
            <Logo light />
            <p className="max-w-xs text-sm leading-relaxed text-white/55">
              {company.subTagline} Built from {company.hq}, for the world.
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {recognition.map((r) => (
                <li key={r} className="flex items-center gap-2 text-sm text-white/60">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading} className="md:col-span-2">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="col-span-2 flex flex-col gap-3 md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Reach
            </h3>
            <p className="text-sm leading-relaxed text-white/70">{company.geography}</p>
            <Link
              href="/contact"
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-white transition-colors hover:text-white/80"
            >
              Contact us
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name} · {company.motto}
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
