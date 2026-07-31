import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Cta } from "@/components/ui/Cta";
import { Products } from "@/components/sections/Products";

export const metadata: Metadata = {
  title: "Products: Vertical Operating Systems",
  description:
    "EduOS and ArenaOS: purpose-built operating systems for schools and gaming cafes, productised from real operational experience.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Portfolio"
        title={
          <>
            Industry operating systems, <span className="text-forest">productised.</span>
          </>
        }
        lead="We turn real operational experience into vertical SaaS: software that runs an entire category of business, not just one department of it."
      >
        <Cta href="/contact" variant="primary">
          Talk to us
          <ArrowRight size={16} />
        </Cta>
      </PageHero>

      <Products heading="Vertical operating systems, shipping today." />
    </>
  );
}
