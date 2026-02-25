import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "../components/Providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The BOSHI BOARD | Next-Gen Token Hub",
  description: "A token dashboard, gallery, and cross-chain bridge for Counterparty BOSHI tokens powered by Emblem Vault.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased selection:bg-fuchsia-500/30`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
