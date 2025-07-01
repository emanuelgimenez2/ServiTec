// app/page.tsx
import HeroCarousel from "@/components/home/hero-carousel"
import FeaturedServices from "@/components/home/featured-services"
import FeaturedProducts from "@/components/home/featured-products"
import Testimonials from "@/components/home/testimonials"
import WhyChooseUs from "@/components/home/why-choose-us"

// ✅ Esta función exportada se usa para definir metadatos en App Router
export const metadata = {
  title: "ServiTec",
  description: "Soluciones tecnológicas a tu alcance",
  keywords: [
    "paginas web",
    "reparacion de pc",
    "antena STARLINK",
    "instalacion de camaras",
    "productos",
    "tecnología"
  ],
  openGraph: {
    title: "ServiTec",
    description: "Soluciones tecnológicas a tu alcance",
    url: "https://servitec-cdelu.vercel.app/",
    siteName: "ServiTec",
    images: [
      {
        url: "https://servitec-cdelu.vercel.app/imgmetadatos.jpg",
        width: 1200,
        height: 630,
        alt: "ServiTec - Soluciones tecnológicas"
      }
    ],
    locale: "es_AR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiTec",
    description: "Soluciones tecnológicas a tu alcance",
    images: ["https://servitec-cdelu.vercel.app/imgmetadatos.jpg"]
  }
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroCarousel />
      <FeaturedServices />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
    </main>
  )
}
