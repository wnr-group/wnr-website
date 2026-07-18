import { HeroVideo } from "@/components/sections/HeroVideo";
import { Products } from "@/components/sections/Products";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { ThreeArmSection } from "@/components/home/ThreeArmSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <Products />
      <CaseStudiesSection />
      <ThreeArmSection />
      <WhyUsSection />
      <StatsSection />
      <ContactSection />
    </>
  );
}


