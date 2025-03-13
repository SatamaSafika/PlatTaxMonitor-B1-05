import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/client-layout";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Plat-Tax Monitor",
    template: "%s | Plat-Tax Monitor",
  },
  description: "Created with 💖 by B1_05",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className={`antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
