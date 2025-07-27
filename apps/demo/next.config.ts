import type { NextConfig } from "next";

const monoRepoPackages = ["@rozoai/deeplink-core", "@rozoai/deeplink-react"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: monoRepoPackages,
};

export default nextConfig;
