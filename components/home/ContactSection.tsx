"use client";

import { Section, Eyebrow } from "@/components/ui/Section";
import { ContactForm } from "@/components/ContactForm";

/**
 * Homepage Contact Section (`ContactSection`)
 * Reuses the exact ContactForm and soft rounded card container from `/contact`,
 * placed immediately after the Stats section, centered cleanly without the left-side details.
 */
export function ContactSection() {
  return (
    <Section
      id="contact"
      tone="canvas"
      className="scroll-mt-24 py-20 md:py-24 lg:py-28"
      containerClassName="flex flex-col items-center justify-center"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center mb-10 sm:mb-12">
        <Eyebrow>Contact</Eyebrow>
        <h2 className="mt-4 font-display text-[length:var(--text-h2)] font-bold leading-[1.05] text-ink">
          Let&rsquo;s talk about your <span className="text-forest">operations.</span>
        </h2>
        <p className="mt-4 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-body text-pretty">
          Whether you&rsquo;re streamlining operations, building a custom
          platform, or adopting an industry operating system — WnR is ready.
        </p>
      </div>

      <div
        id="contact-form-card"
        className="mx-auto w-full max-w-[720px] rounded-2xl border border-line bg-paper p-6 shadow-card sm:p-8 md:p-10"
      >
        <ContactForm />
      </div>
    </Section>
  );
}
