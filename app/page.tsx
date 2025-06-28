import HeroCarousel from "@/components/home/hero-carousel"
import FeaturedServices from "@/components/home/featured-services"
import FeaturedProducts from "@/components/home/featured-products"
import Testimonials from "@/components/home/testimonials"
import WhyChooseUs from "@/components/home/why-choose-us"
import Newsletter from "@/components/home/newsletter"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroCarousel />
      <FeaturedServices />
      <FeaturedProducts />
      <Testimonials />
      <WhyChooseUs />
      <Newsletter />
    </main>
  )
}
