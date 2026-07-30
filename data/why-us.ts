import { Handshake, Users, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

export interface WhyUsItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const whyUsItems: WhyUsItem[] = [
  {
    id: "partnership",
    title: "Long-term Partnership",
    description: "We don't just launch projects. We stay to optimize, scale, and grow with your business. Our relationship begins where most engagements end.",
    icon: Handshake,
  },
  {
    id: "people",
    title: "People Before Platforms",
    description: "Great businesses are built by great people. Every solution we create empowers both your customers and your employees, making work simpler and experiences better.",
    icon: Users,
  },
  {
    id: "privacy",
    title: "Privacy by Design",
    description: "Your data is your competitive advantage. We never monetize or sell it. Every solution is built with security, transparency, and trust at its core.",
    icon: ShieldCheck,
  },
  {
    id: "ai",
    title: "AI-Native Innovation",
    description: "AI isn't an add-on. It's how we build. We embed intelligent automation into everyday operations to improve efficiency, decision-making, and continuous growth.",
    icon: Sparkles,
  },
];
