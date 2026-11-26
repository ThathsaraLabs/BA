import { sitePath } from "./site-path";
import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = {
  title: "Business Summit – South Korea",
  description: "Business Summit – South Korea takes place on 13 December 2026 at Yeungjin University in Daegu. Organised by Booking Ministry.",
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
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: 'try { if (localStorage.getItem("ba-theme") === "light") document.documentElement.dataset.theme = "light"; } catch {}' }} /><link rel="preload" as="image" href={sitePath("/images/daegu-portal-v1.webp")} /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
