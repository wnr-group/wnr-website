import { HeroVideo } from "@/components/sections/HeroVideo";
import { ThreeArmSection } from "@/components/home/ThreeArmSection";
import { StatsSection } from "@/components/home/StatsSection";
import { Products } from "@/components/sections/Products";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <ThreeArmSection />
      <StatsSection />
      <Products />
      <CaseStudiesSection />
      <WhyUsSection />
      <ContactSection />
    </>
  );
}


