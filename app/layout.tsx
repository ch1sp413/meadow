import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meadow",
  description: "A sanctuary operations platform for animal care, people, compliance, and giving."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
