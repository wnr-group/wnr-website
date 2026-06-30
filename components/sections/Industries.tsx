import {
  GraduationCap,
  Gamepad2,
  Truck,
  ShoppingBag,
  Ship,
  Briefcase,
  UtensilsCrossed,
  Building2,
} from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { industries } from "@/content/sections";

const icons: Record<string, React.ElementType> = {
  "Schools & Education": GraduationCap,
  "Gaming & Esports": Gamepad2,
  "Logistics & Freight": Truck,
  "B2B & D2C E-Commerce": ShoppingBag,
  Marine: Ship,
  "Training & Careers": Briefcase,
  "Food & Marketplace": UtensilsCrossed,
  "SMB Enterprises": Building2,
};

/* Section 10 — Industries. Calm grid, gold line-icons, subtle hover lift. */
export function Industries() {
  return (
    <Section id="industries" tone="cream">
      <div className="max-w-2xl">
        <Eyebrow>{industries.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest md:text-[2.75rem]">
          {industries.heading}
        </h2>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {industries.list.map((name) => {
          const Icon = icons[name] ?? Building2;
          return (
            <li key={name}>
              <div className="group flex h-full flex-col gap-4 rounded-xl border border-hairline bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_20px_40px_-28px_rgba(14,59,46,0.4)]">
                <Icon
                  size={26}
                  strokeWidth={1.5}
                  className="text-gold"
                  aria-hidden="true"
                />
                <span className="font-display text-[0.95rem] font-semibold leading-snug text-forest">
                  {name}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-sm text-muted">{industries.footnote}</p>
    </Section>
  );
}
