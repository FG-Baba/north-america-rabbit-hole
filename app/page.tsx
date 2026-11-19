import type { Metadata } from "next";
import { Report } from "./Report";

export const metadata: Metadata = {
  title: "How Did So Much of North America Become Just Two Countries?",
  description:
    "A scroll-driven terrain story about how geology assembled North America, water shaped routes, Indigenous Nations made homelands, and colonial power made two giant states.",
  openGraph: {
    title: "How Did So Much of North America Become Just Two Countries?",
    description:
      "Rock made the land. Water shaped the routes. Power drew the lines.",
    siteName: "North America: Three Layers",
    type: "article",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "A field-atlas cover showing North American terrain beneath the report title.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Did So Much of North America Become Just Two Countries?",
    description: "Rock made the land. Water shaped the routes. Power drew the lines.",
    images: ["/og.png"],
  },
};

export default function Home() {
  return <Report />;
}
