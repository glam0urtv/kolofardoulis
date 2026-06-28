import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"
import { LenisProvider } from "@/components/lenis-provider"
import { PurchaseAnimationOverlay } from "@/components/purchase-animation-overlay"

export const metadata: Metadata = {
  title: {
    default: "Kolofardoulis.gr — Trading Card Games",
    template: "%s | Kolofardoulis.gr",
  },
  description:
    "Boutique κατάστημα trading card games. One Piece TCG, Pokémon, Magic: The Gathering. Singles, Booster Boxes, Promo κάρτες.",
  metadataBase: new URL("https://kolofardoulis.gr"),
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: "Kolofardoulis.gr",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="el" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        <LenisProvider>
          <Navbar />
          <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-20 md:px-8">
            {children}
          </main>
          <CartDrawer />
          <Footer />
        </LenisProvider>
        <PurchaseAnimationOverlay />
      </body>
    </html>
  )
}
