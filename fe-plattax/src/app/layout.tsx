import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/client-layout";

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
    <html lang="en" suppressHydrationWarning>
      <meta name="apple-mobile-web-app-title" content="SD-WAN Tableau Telkom" />
      <body className={``}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
