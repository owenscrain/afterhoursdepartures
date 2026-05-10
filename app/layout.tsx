import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import "../styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brown Line Departures",
  description: "After-hours Brown Line departure display.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
