import "./globals.css";
import "@radix-ui/themes/styles.css";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { UserProvider } from "@/app/context/UserContext";

const barlowCondensed = localFont({
  src: [
    { path: "../../public/fonts/barlow-condensed-100.ttf", weight: "100", style: "normal" },
    { path: "../../public/fonts/barlow-condensed-300.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/barlow-condensed-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/barlow-condensed-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/barlow-condensed-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/barlow-condensed-700.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/barlow-condensed-800.ttf", weight: "800", style: "normal" },
    { path: "../../public/fonts/barlow-condensed-900.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={barlowCondensed.variable}>
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
