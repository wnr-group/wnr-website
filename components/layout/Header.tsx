"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Cta } from "@/components/ui/Cta";
import { cn } from "@/lib/utils";

// Homepage anchor links + Company page. Order per spec.
const navLinks = [
  { href: "/#what-we-build", label: "What We Do" },
  { href: "/#approach", label: "Approach" },
  { href: "/#products", label: "Products" },
  { href: "/#industries", label: "Industries" },
  { href: "/#work", label: "Work" },
  { href: "/careers", label: "Company" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fill to solid forest after ~80px scroll (transparent over hero).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "border-b border-white/10 bg-forest-deep/95 backdrop-blur supports-[backdrop-filter]:bg-forest-deep/80"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-5 py-3.5 sm:px-6">
        <Link
          href="/"
          aria-label="WnR Group — home"
          onClick={() => setMenuOpen(false)}
        >
          <Logo light />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cream/80 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <Cta href="/contact" variant="primary" className="px-5 py-2.5">
            Let&rsquo;s Talk
          </Cta>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-cream lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>

    {/* Full-screen mobile overlay — sibling of <header> so the header's
        backdrop-filter doesn't trap it in a containing block. */}
    {menuOpen && (
      <div className="fixed inset-0 top-18 z-40 flex flex-col gap-1 bg-forest-deep px-5 py-8 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={cn(
              "border-b border-white/10 py-4 font-display text-2xl font-medium tracking-tight transition-colors",
              pathname === link.href ? "text-gold" : "text-cream hover:text-gold",
            )}
          >
            {link.label}
          </Link>
        ))}
        <Cta
          href="/contact"
          variant="primary"
          className="mt-6 w-full py-4 text-base"
        >
          Let&rsquo;s Talk
        </Cta>
      </div>
    )}
    </>
  );
}
