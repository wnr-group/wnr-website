// Brand imagery manifest. We use real photography (not illustration) to keep
// the site grounded and enterprise. Set a value to a path under /public; leave
// null to render a component's built-in fallback.

export interface BrandImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const media: Record<string, BrandImage | null> = {
  hero: {
    src: "/brand/photo-team.webp",
    alt: "Two WnR colleagues reviewing a live operational dashboard together in a bright office",
    width: 1920,
    height: 1086,
  },
  office: {
    src: "/brand/photo-office.webp",
    alt: "A calm, modern WnR workspace — glass meeting rooms, warm wood, forest-green furniture and daylight",
    width: 1920,
    height: 1086,
  },
};
