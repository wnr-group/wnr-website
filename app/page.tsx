import { Hero } from "@/components/sections/Hero";
import { ProofBar } from "@/components/sections/ProofBar";
import { Problem } from "@/components/sections/Problem";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { Approach } from "@/components/sections/Approach";
import { MisSection } from "@/components/sections/MisSection";
import { WhyUs } from "@/components/sections/WhyUs";
import { Values } from "@/components/sections/Values";
import { Divisions } from "@/components/sections/Divisions";
import { Products } from "@/components/sections/Products";
import { Industries } from "@/components/sections/Industries";
import { Work } from "@/components/sections/Work";
import { Technology } from "@/components/sections/Technology";
import { InsideWnr } from "@/components/sections/InsideWnr";
import { Vision } from "@/components/sections/Vision";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofBar />
      <Problem />
      <WhatWeBuild />
      <Approach />
      <MisSection />
      <WhyUs />
      <Values />
      <Divisions />
      <Products />
      <Industries />
      <Work />
      <Technology />
      <InsideWnr />
      <Vision />
      <FinalCta />
    </>
  );
}
