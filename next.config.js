/** @type {import('next').NextConfig} */
const nextConfig = {
  // 출력 타입 설정
  output: 'standalone',

  // ESLint 빌드 시 무시
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript 검사 무시
  typescript: {
    ignoreBuildErrors: true,
  },

  // 외부 이미지 도메인 설정
  images: {
    domains: [
      'pub-b520cb8ed3989e8182bdb020ade36495.r2.dev'
    ],
    unoptimized: true,
  },

  // 실험적 기능
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  // public 폴더의 영상 파일에 대한 캐시 설정
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
