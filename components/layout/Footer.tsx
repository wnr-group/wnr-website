import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Cta } from "@/components/ui/Cta";
import { company } from "@/content/company";

const columns: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Company",
    links: [
      { href: "/#what-we-build", label: "What We Do" },
      { href: "/#approach", label: "Our Approach" },
      { href: "/#divisions", label: "Divisions" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    heading: "Products",
    links: [
      { href: "/products/eduos", label: "EduOS" },
      { href: "/products/arenaos", label: "ArenaOS" },
      { href: "/#products", label: "All Products" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { href: "/#industries", label: "Education" },
      { href: "/#industries", label: "Gaming & Esports" },
      { href: "/#industries", label: "Logistics" },
      { href: "/#work", label: "Selected Work" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-forest-deep text-cream/70">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-4">
            <Logo light />
            <p className="max-w-xs text-sm leading-relaxed text-cream/60">
              {company.tagline}. Operational intelligence for modern business.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav
              key={col.heading}
              aria-label={col.heading}
              className="md:col-span-2"
            >
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-gold">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Mini-CTA */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
              Let&rsquo;s talk
            </h3>
            <p className="text-sm text-cream/60">
              Let&rsquo;s talk about your operations.
            </p>
            <Cta href="/contact" variant="primary" className="w-full px-4 py-2.5">
              Let&rsquo;s Talk
            </Cta>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-cream/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name} ·{" "}
            <span className="text-gold/70">{company.geography}</span> ·{" "}
            {company.tagline}
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gold">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gold">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
