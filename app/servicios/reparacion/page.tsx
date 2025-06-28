"use client"

import Image from "next/image"
import { Monitor, CheckCircle, Clock, Shield, Star, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const services = [
  {
    title: "Limpieza Completa",
    description: "Limpieza interna y externa, cambio de pasta térmica",
    price: "",
    duration: "2-3 horas",
  },
  {
    title: "Cambio de Componentes",
    description: "RAM, disco duro, teclado, pantalla, batería",
    price: "",
    duration: "1-2 días",
  },
  {
    title: "Reparación de Software",
    description: "Eliminación de virus, optimización del sistema",
    price: "",
    duration: "2-4 horas",
  },
  {
    title: "Formateo e Instalación",
    description: "Windows 11, drivers, programas básicos",
    price: "",
    duration: "4-6 horas",
  },
  {
    title: "Recuperación de Datos",
    description: "Recuperación de archivos perdidos o dañados",
    price: "",
    duration: "1-3 días",
  },
  {
    title: "Instalación de Programas",
    description: "Office, antivirus, programas específicos con licencia",
    price: "",
    duration: "1-2 horas",
  },
]

const portfolio = [
  {
    id: 1,
    title: "Notebook HP Pavilion - Limpieza Completa",
    description: "Limpieza interna, cambio de pasta térmica, optimización",
    image: "/placeholder.svg?height=300&width=400",
    before: "Sobrecalentamiento constante",
    after: "Temperatura normal, rendimiento óptimo",
  },
  {
    id: 2,
    title: "PC Gamer - Upgrade Completo",
    description: "Cambio de RAM, SSD, tarjeta gráfica",
    image: "/placeholder.svg?height=300&width=400",
    before: "Lentitud en juegos",
    after: "Rendimiento gaming excelente",
  },
  {
    id: 3,
    title: "Notebook Dell - Recuperación de Datos",
    description: "Recuperación de 500GB de archivos importantes",
    image: "/placeholder.svg?height=300&width=400",
    before: "Disco duro dañado",
    after: "100% de datos recuperados",
  },
]

const process = [
  { step: 1, title: "Diagnóstico Gratuito", description: "Evaluamos el problema y te damos un presupuesto sin costo" },
  {
    step: 2,
    title: "Presupuesto Detallado",
    description: "Te explicamos qué necesita tu equipo y los costos involucrados",
  },
  { step: 3, title: "Reparación", description: "Realizamos el trabajo con repuestos originales y garantía" },
  {
    step: 4,
    title: "Pruebas y Entrega",
    description: "Probamos todo funcione correctamente antes de entregarte tu equipo",
  },
]

const testimonials = [
  {
    name: "Carlos Rodríguez",
    comment:
      "Mi notebook tenía problemas graves y pensé que no tenía arreglo. Los chicos de ServiTec la dejaron como nueva.",
    rating: 5,
    service: "Reparación completa",
  },
  {
    name: "María González",
    comment: "Excelente servicio, muy profesionales. Recuperaron todos mis archivos importantes.",
    rating: 5,
    service: "Recuperación de datos",
  },
  {
    name: "Roberto Silva",
    comment: "Rápido y eficiente. El precio fue muy justo y la garantía me dio mucha tranquilidad.",
    rating: 5,
    service: "Cambio de componentes",
  },
]

export default function ReparacionPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 text-white py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div>
              <div className="flex items-center mb-4 sm:mb-6">
                <Monitor className="w-8 h-8 sm:w-12 sm:h-12 mr-3 sm:mr-4" />
                <Badge className="bg-white/20 text-white text-xs sm:text-sm">Servicio Técnico</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-6">Reparación de Computadoras</h1>
              <p className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90">
                Servicio técnico especializado en notebooks y PCs de escritorio. Diagnóstico gratuito y garantía en
                todos nuestros trabajos.
              </p>
              <div className="flex flex-col gap-3 sm:gap-4">
                <Button
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold text-xs sm:text-sm lg:text-base"
                  onClick={() => (window.location.href = "/contacto")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Solicitar Información
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent text-xs sm:text-sm lg:text-base"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  +54 9 3442 646670
                </Button>
              </div>
            </div>
            <div className="relative mt-6 lg:mt-0">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Reparación de computadoras"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">
              Soluciones completas para todos los problemas de tu equipo
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-start mb-2 sm:mb-4">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 leading-tight">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-purple-600">{service.price}</p>
                      <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {service.duration}
                      </p>
                    </div>
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Nuestro Proceso</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">
              Así trabajamos para garantizar la mejor experiencia
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                  {item.step}
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Trabajos Realizados
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">Algunos de nuestros casos de éxito</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {portfolio.map((work) => (
              <Card key={work.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-32 sm:h-40 lg:h-48">
                  <Image src={work.image || "/placeholder.svg"} alt={work.title} fill className="object-cover" />
                </div>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                    {work.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {work.description}
                  </p>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-start">
                      <span className="text-xs sm:text-sm font-medium text-red-600 mr-1 sm:mr-2 flex-shrink-0">
                        Antes:
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 line-clamp-1">{work.before}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-xs sm:text-sm font-medium text-green-600 mr-1 sm:mr-2 flex-shrink-0">
                        Después:
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 line-clamp-1">{work.after}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center mb-2 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
