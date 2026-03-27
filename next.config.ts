import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/about-tacklers-consulting-group",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/operational-excellence-services-uk",
        destination: "/operational-excellence-consulting-uk",
        permanent: true,
      },
      {
        source: "/lean-services",
        destination: "/lean-training-uk",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/book-a-discovery-call",
        destination: "/discovery-call",
        permanent: true,
      },
      {
        source: "/book-lean-training-session",
        destination: "/book-lean-training",
        permanent: true,
      },
      {
        source: "/request-an-on-site-assessment",
        destination: "/on-site-assessment",
        permanent: true,
      },
      {
        source: "/terms-condition",
        destination: "/terms-and-conditions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
