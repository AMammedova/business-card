import LandingHomePage from "@/components/LandingHomePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCard - Digital Business Cards",
  description: "Create and share digital business cards instantly. Modern, eco-friendly way to network and share contact information.",
  openGraph: {
    title: "MCard - Digital Business Cards",
    description: "Create and share digital business cards instantly. Modern, eco-friendly way to network and share contact information.",
    url: "https://mcard.az",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "MCard Digital Business Cards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCard - Digital Business Cards",
    description: "Create and share digital business cards instantly. Modern, eco-friendly way to network and share contact information.",
  },
};

export default function HomePage() {
  return <LandingHomePage />;
} 