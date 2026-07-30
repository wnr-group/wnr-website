import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/sections/ProductDetail";
import { getProduct } from "@/content/products";

const eduos = getProduct("eduos");

export const metadata: Metadata = {
  title: "EduOS: The Operating Brain for Schools",
  description: eduos?.oneLiner,
};

export default function EduOSPage() {
  if (!eduos) notFound();
  return (
    <ProductDetail
      product={eduos}
      ctaHeading="Ready to bring EduOS to your school?"
      ctaBody="Let's talk about how EduOS can become the operational brain of your institution."
    />
  );
}
