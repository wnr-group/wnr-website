"use client";

import { useState } from "react";
import { Check } from "lucide-react";

/* Lead form (UI only for now — no backend). Fields per landing brief:
   name, business, email, phone, what they need. On submit it shows an
   optimistic success state; wiring to email/CRM is a later phase. */

const fieldBase =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/25";

const labelBase = "text-sm font-medium text-ink";

export function LeadForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-forest/20 bg-forest-wash p-8">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white">
          <Check size={20} />
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">
          Thank you. Message received.
        </h3>
        <p className="text-[0.95rem] text-body">
          A member of our team will be in touch within one business day. In the
          meantime, feel free to explore what we&rsquo;ve built.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-5"
      aria-label="Contact WnRTech"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelBase}>
            Name <span className="text-forest">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={fieldBase}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="business" className={labelBase}>
            Business
          </label>
          <input
            id="business"
            name="business"
            type="text"
            autoComplete="organization"
            placeholder="Your company"
            className={fieldBase}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelBase}>
            Email <span className="text-forest">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldBase}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={labelBase}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 ..."
            className={fieldBase}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="need" className={labelBase}>
          What are you looking to solve? <span className="text-forest">*</span>
        </label>
        <textarea
          id="need"
          name="need"
          required
          rows={4}
          placeholder="Tell us about your operations and what you're trying to fix..."
          className={`${fieldBase} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 sm:w-auto"
      >
        Start Your Journey
      </button>
    </form>
  );
}
