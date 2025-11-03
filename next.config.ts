/** @type {import('next').NextConfig} */
// next.config.js
import { connectToDatabase } from './src/lib/mongodb' 

(async () => {
  try {
    await connectToDatabase();
    console.log("MongoDB connected during build");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*", // Matches all API routes
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD,CONNECT,TRACE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/userProfile/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/products/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/paymentSlip/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/invoice/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/invoiceSign/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/invoices/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/catalogues/**',
      },
      {
        protocol: 'https',
        hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
        pathname: '/brands/**',
      },
      {
      protocol: 'https',
      hostname: 'jaypee-images.s3.ap-south-1.amazonaws.com',
      pathname: '/**',   // ✅ Allow all paths & folders
    },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
