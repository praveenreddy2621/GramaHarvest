import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter-400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-700.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
});

const playfair = localFont({
  src: [
    {
      path: "../../public/fonts/playfair-400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/playfair-700.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playfair",
});



export const metadata: Metadata = {
  metadataBase: new URL('https://gramaharvest.shop'),
  title: {
    default: 'Grama Harvest | Pure Traditional Bilona Ghee & Organic Spices',
    template: '%s | Grama Harvest'
  },
  description: "Shop authentic, hand-churned Bilona Buffalo Ghee, Guntur Chillies, and Aged Rice. Direct from farmers to your kitchen. 100% Preservative Free & Organic.",
  keywords: ["Ghee", "Buffalo Ghee", "Bilona Ghee", "Organic Ghee", "A2 Ghee", "Pure Ghee", "Cow Ghee", "Andhra Spices", "Guntur Chilli", "Handcrafted Foods", "Farm Fresh"],
  openGraph: {
    title: 'Grama Harvest | Authentic Farm Fresh Staples',
    description: 'Experience the taste of tradition with our Bilona Ghee and organic spices. Sourced directly from local farmers.',
    url: 'https://gramaharvest.shop',
    siteName: 'Grama Harvest', // Brand name
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/logo-new.png',
        width: 800,
        height: 600,
        alt: 'Grama Harvest Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grama Harvest',
    description: 'Authentic Bilona Ghee and Organic Staples from our village to your home.',
    images: ['/images/logo-new.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'Uu2MLruIWSSErsTvm0Yn0TBzubBPANEDi8jqcdxRlbs',
  },
};

export const viewport: Viewport = {
  themeColor: '#4A7C59',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Grama Harvest",
              "url": "https://gramaharvest.shop",
              "logo": "https://gramaharvest.shop/images/logo.jpg",
              "sameAs": [
                "https://instagram.com/gramaharvest",
                "https://facebook.com/gramaharvest"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9876543210", // Placeholder, update if real number known
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      <body className="antialiased bg-nature-cream text-nature-earth font-sans overflow-x-hidden selection:bg-nature-gold selection:text-white">
        {/* Global Grain Texture Overlay - Subtle Noise */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
