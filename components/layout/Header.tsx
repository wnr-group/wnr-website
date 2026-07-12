"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Cta } from "@/components/ui/Cta";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string; desc: string }[];
};

const nav: NavItem[] = [
  {
    href: "/capabilities",
    label: "Capabilities",
    children: [
      { href: "/capabilities#systems", label: "WnR Systems", desc: "Custom ERP, platforms & apps" },
      { href: "/capabilities#consulting", label: "WnR Consulting", desc: "Operations strategy & workflow design" },
      { href: "/capabilities#ai-labs", label: "WnR AI Labs", desc: "AI-native automation & intelligence" },
    ],
  },
  {
    href: "/products",
    label: "Products",
    children: [
      { href: "/products/eduos", label: "EduOS", desc: "The operating brain for schools" },
      { href: "/products/arenaos", label: "ArenaOS", desc: "The full OS for gaming cafes" },
      { href: "/products", label: "All products", desc: "The vertical SaaS portfolio" },
    ],
  },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-canvas/85 backdrop-blur-md transition-all duration-300",
          scrolled || menuOpen
            ? "border-b border-line shadow-[0_1px_20px_-8px_rgba(18,71,52,0.18)]"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-5 sm:px-6">
          <Link href="/" aria-label="WnR Group — home">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="group relative"
                  onMouseEnter={() => setOpenGroup(item.label)}
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      "text-body hover:text-forest",
                    )}
                    aria-expanded={openGroup === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      size={15}
                      className="text-muted transition-transform duration-200 group-hover:rotate-180"
                    />
                  </Link>

                  {/* Dropdown */}
                  <div
                    className={cn(
                      "invisible absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200",
                      "group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                    )}
                  >
                    <div className="overflow-hidden rounded-2xl border border-line bg-paper p-2 shadow-card">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-forest-wash"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest/40 transition-colors group-hover/item:bg-forest" />
                          <span className="flex flex-col">
                            <span className="text-sm font-semibold text-ink">
                              {child.label}
                            </span>
                            <span className="text-xs text-muted">{child.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-forest"
                      : "text-body hover:text-forest",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Cta href="/contact" variant="primary" className="ml-2 px-5 py-2.5">
              Let&rsquo;s Talk
            </Cta>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-18 z-40 flex flex-col overflow-y-auto bg-canvas px-5 py-6 lg:hidden">
          {nav.map((item) => (
            <div key={item.href} className="border-b border-line">
              <Link
                href={item.href}
                className="flex items-center justify-between py-4 font-display text-xl font-semibold text-ink"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="-mt-1 flex flex-col gap-1 pb-4 pl-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="flex items-center gap-2 py-2 text-[0.95rem] text-body"
                    >
                      <ArrowRight size={14} className="text-forest" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Cta href="/contact" variant="primary" className="mt-6 w-full py-4 text-base">
            Let&rsquo;s Talk
          </Cta>
        </div>
      )}
    </>
  );
}
