/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGitHubPages
    ? {
        basePath: "/a1-deutsch-trainer",
        assetPrefix: "/a1-deutsch-trainer/",
      }
    : {}),
};

export default nextConfig;
