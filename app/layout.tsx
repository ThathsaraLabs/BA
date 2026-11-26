import { sitePath } from "./site-path";
import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = {
  title: "Business Advisor Business Summit · Daegu, South Korea",
  description: "Booking Ministry presents the Business Networking Meeting on 12 December and the Business Advisor Business Summit on 13 December 2026 at Yeungjin University in Daegu, South Korea.",
  icons: {
    icon: sitePath("/favicon.svg"),
    shortcut: sitePath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><link rel="preload" as="image" href={sitePath("/images/daegu-portal-v1.webp")} /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
