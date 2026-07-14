import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    optimizePackageImports: [
      "motion",
      "framer-motion",
      "@base-ui/react",
      "lucide-react",
    ],
  },
};

export default nextConfig;
