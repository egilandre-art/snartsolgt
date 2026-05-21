import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "snartsolgt — Din digitale eiendomsmegler",
    template: "%s | snartsolgt",
  },
  description:
    "Selg boligen din raskt og enkelt med snartsolgt. Heldigital eller med megler — du velger.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="nb" className={inter.variable}>
        <body className="min-h-screen bg-canvas text-fg antialiased">
          {children}
          <Toaster position="bottom-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
