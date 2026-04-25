import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import "../styles/tokens.css";
import "../styles/board.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "CTA Home Board",
  description: "Chicago CTA arrivals board for a dedicated home display.",
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
