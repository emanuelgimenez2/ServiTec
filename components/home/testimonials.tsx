"use client"

import { useState, useEffect } from "react"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "María González",
    role: "Propietaria de Café Central",
    rating: 5,
    comment:
      "Excelente servicio! Me instalaron las cámaras de seguridad en mi local y quedé muy conforme. Muy profesionales y el precio fue justo.",
    avatar: "/placeholder.svg?height=60&width=60",
    service: "Instalación de Cámaras",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Ingeniero",
    rating: 5,
    comment:
      "Mi notebook tenía problemas graves y pensé que no tenía arreglo. Los chicos de ServiTec la dejaron como nueva. Súper recomendable!",
    avatar: "/placeholder.svg?height=60&width=60",
    service: "Reparación de Computadoras",
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Contadora",
    rating: 5,
    comment:
      "Necesitaba internet en mi campo y me instalaron Starlink. El servicio fue impecable, desde la instalación hasta la configuración.",
    avatar: "/placeholder.svg?height=60&width=60",
    service: "Instalación Starlink",
  },
  {
    id: 4,
    name: "Roberto Silva",
    role: "Comerciante",
    rating: 5,
    comment:
      "Me desarrollaron la página web de mi negocio y quedó espectacular. Muy profesionales y atentos a todos los detalles.",
    avatar: "/placeholder.svg?height=60&width=60",
    service: "Desarrollo Web",
  },
  {
    id: 5,
    name: "Laura Fernández",
    role: "Arquitecta",
    rating: 5,
    comment:
      "Compré una notebook en ServiTec y el servicio post-venta es excelente. Siempre están disponibles para cualquier consulta.",
    avatar: "/placeholder.svg?height=60&width=60",
    service: "Venta de Productos",
  },
  {
    id: 6,
    name: "Laura Fernández",
    role: "Arquitecta",
    rating: 5,
    comment:
      "Compré una notebook en ServiTec y el servicio post-venta es excelente. Siempre están disponibles para cualquier consulta.",
    avatar: "/placeholder.svg?height=60&width=60",
    service: "Venta de Productos",
  },
]

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-4 sm:p-10">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
              </div>

              <blockquote className="text-sm sm:text-xl text-center mb-4 sm:mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].comment}"
              </blockquote>

              <div className="flex items-center justify-center mb-3 sm:mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < testimonials[currentTestimonial].rating ? "text-yellow-400 fill-current" : "text-gray-400"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <Avatar className="w-10 h-10 sm:w-14 sm:h-14">
                  <AvatarImage src={testimonials[currentTestimonial].avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs">
                    {testimonials[currentTestimonial].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-semibold text-sm sm:text-base">{testimonials[currentTestimonial].name}</div>
                  <div className="text-white/70 text-xs">{testimonials[currentTestimonial].role}</div>
                  <div className="text-orange-400 text-[10px]">{testimonials[currentTestimonial].service}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dots */}
        <div className="flex justify-center space-x-2 sm:space-x-3 mb-8 sm:mb-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTestimonial ? "bg-orange-400 scale-110" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Grid de testimonios (2 columnas en celus) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 transition-all duration-300"
            >
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-white/90 mb-2 text-xs leading-tight">"{testimonial.comment}"</p>

                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-[10px]">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-xs">{testimonial.name}</div>
                    <div className="text-white/60 text-[10px]">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
