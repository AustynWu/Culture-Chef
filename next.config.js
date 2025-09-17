/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // 若有用 next/image
  // 若你的頁面會放在子目錄（例如 username.github.io/repo-name），加：
  // basePath: '/<repo-name>',
  // assetPrefix: '/<repo-name>/',
};
module.exports = nextConfig;