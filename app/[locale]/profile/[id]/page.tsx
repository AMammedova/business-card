import PageClient from "@/containers/PageClient";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Digital Business Card",
  description: "Create and Share Your Digital Business Card",
  openGraph: {
    title: "Digital Business Card",
    description: "Create and Share Your Digital Business Card",
    images: ["/favicon.ico"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Page({ params }: Props) {
  return <PageClient id={params.id} />;
}

