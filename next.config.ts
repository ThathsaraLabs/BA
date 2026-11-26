import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.GITHUB_PAGES === "true" && { output: "export", basePath: "/BA", trailingSlash: true }),
  env: { NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_PAGES === "true" ? "/BA" : "" },
};

export default nextConfig;
