import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daunku - Bring Serenity to Your Place With Interior Plants",
  description: "Find your dream plant for your home decoration with Daunku, and we will make it happen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
