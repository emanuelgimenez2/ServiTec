import { Monitor, Satellite, Camera, Globe, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
  {
    icon: Monitor,
    title: "Reparación de Computadoras",
    description: "",
    features: ["Limpieza completa", "Cambio de componentes", "Instalación de software", "Recuperación de datos"],
    link: "/servicios/reparacion",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    icon: Satellite,
    title: "Instalación Starlink",
    description: "",
    features: ["Instalación profesional", "Configuración completa", "Soporte técnico", "Garantía incluida"],
    link: "/servicios/starlink",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Camera,
    title: "Cámaras de Seguridad",
    description: "",
    features: ["Instalación profesional", "Configuración remota", "Grabación en la nube", "Monitoreo 24/7"],
    link: "/servicios/camaras",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Globe,
    title: "Desarrollo Web",
    description: "",
    features: ["Diseño responsive", "E-commerce", "SEO optimizado", "Mantenimiento"],
    link: "/servicios/desarrollo",
    gradient: "from-cyan-500 to-blue-500",
  },
]

export default function FeaturedServices() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos soluciones tecnológicas integrales para particulares y empresas
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden h-full flex flex-col"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Icon Header */}
                  <div className={`bg-gradient-to-br ${service.gradient} p-4 sm:p-6 text-white`}>
                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-2 sm:mb-4 mx-auto">
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-center min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                      {service.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 text-center flex-shrink-0">
                      {service.description}
                    </p>

                    <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 flex-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-xs sm:text-sm text-gray-700">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full mr-2 sm:mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href={service.link} className="mt-auto">
                      <Button className="w-full text-xs sm:text-sm px-3 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-purple-600 hover:to-violet-600 text-white group-hover:shadow-lg transition-all duration-300 border border-purple-200 hover:border-purple-400">
                        Ver más detalles
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>


        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">¿Necesitas un servicio personalizado?</p>
          <Link href="/contacto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Contactanos ahora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
