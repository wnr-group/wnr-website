import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/sections/ProductDetail";
import { getProduct } from "@/content/products";

const arenaos = getProduct("arenaos");

export const metadata: Metadata = {
  title: "ArenaOS — The Full Business OS for Gaming Cafes",
  description: arenaos?.oneLiner,
};

export default function ArenaOSPage() {
  if (!arenaos) notFound();
  return (
    <ProductDetail
      product={arenaos}
      ctaHeading="Ready to run your gaming cafe on ArenaOS?"
      ctaBody="Let's talk about how ArenaOS can transform how you operate."
    />
  );
}
