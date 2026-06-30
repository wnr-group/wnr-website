import type { Metadata } from "next";
import { Products } from "@/components/sections/Products";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Products — Vertical Operating Systems",
  description:
    "EduOS and ArenaOS — purpose-built operating systems for schools and gaming cafes, productised from real operational experience.",
};

export default function ProductsPage() {
  return (
    <>
      {/* spacing so the fixed header clears the dark section top */}
      <div className="bg-forest pt-18" aria-hidden="true" />
      <Products />
      <FinalCta />
    </>
  );
}
