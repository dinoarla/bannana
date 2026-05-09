const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https" as const, hostname: "**" }
    ]
  }
};

export default nextConfig;
