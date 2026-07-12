import { Hero } from "@/components/sections/Hero";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { Problem } from "@/components/sections/Problem";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { Approach } from "@/components/sections/Approach";
import { Products } from "@/components/sections/Products";
import { PhotoBand } from "@/components/sections/PhotoBand";
import { Industries } from "@/components/sections/Industries";
import { Work } from "@/components/sections/Work";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HeroVideo />
      <Problem />
      <WhatWeBuild />
      <Approach />
      <Products />
      <PhotoBand />
      <Industries />
      <Work showLink />
    </>
  );
}
