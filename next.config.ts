import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The pipeline scripts under scripts/ are run with tsx, not Next's compiler.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
