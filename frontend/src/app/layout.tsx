import type { Metadata } from "next";
import "./tailwind.css";
import "@/lib/suppressHydrationWarning";
import { SiteConfigProvider } from "@/components/SiteConfigProvider";

export const metadata: Metadata = {
  title: "Hostreams - Directorio de Radio y TV",
  description: "Descubre y disfruta de las mejores radios y canales de televisión en vivo",
  icons: {
    icon: '/images/favicon.png',
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SiteConfigProvider>
          {children}
        </SiteConfigProvider>
      </body>
    </html>
  );
}
