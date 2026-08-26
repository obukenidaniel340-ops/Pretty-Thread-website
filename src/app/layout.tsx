import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pretty Threads | Elevated Casuals & Modern Traditional Wear",
  description: "Browse the exclusive modern traditional and streetwear collections from Pretty Threads. Effortlessly stylish fashion with premium craftsmanship.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
