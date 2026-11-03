import { fileURLToPath } from "node:url";
import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
};
export default nextConfig;
