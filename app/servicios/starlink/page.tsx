"use client"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Satellite, Wifi, Globe, Zap, Shield, Clock, Award, Users } from "lucide-react"

export default function StarlinkPage() {
  const [showCalculator, setShowCalculator] = useState(false)
  const [showAllPlans, setShowAllPlans] = useState(false)
  const [residentialPlan, setResidentialPlan] = useState("lite")
  const [itinerantePlan, setItinerantePlan] = useState("10gb")

  const residentialData = {
    lite: {
      price: "$38.000",
      specs: ["45-130 Mbps descarga", "11-26 Mbps carga", "25-60ms latencia", "Datos ilimitados (sin prioridad)"],
    },
    comun: {
      price: "$56.100",
      specs: ["45-230 Mbps descarga", "10-25 Mbps carga", "25-60ms latencia", "Datos ilimitados (mayor prioridad)"],
    },
  }

  const itineranteData = {
    "10gb": {
      price: "$12.000",
      specs: ["45-230 Mbps descarga", "10-25 Mbps carga", "25-60ms latencia", "10 GB/mes (pago por GB extra)"],
    },
    "50gb": {
      price: "$63.000",
      specs: ["45-230 Mbps descarga", "10-25 Mbps carga", "25-60ms latencia", "50 GB/mes (pago por GB extra)"],
    },
    ilimitado: {
      price: "$87.500",
      specs: ["100-280 Mbps descarga", "14-30 Mbps carga", "25-60ms latencia (>100ms altamar)", "Datos ilimitados"],
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10" />
        <div className="relative container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 sm:p-4">
                <Satellite className="w-8 h-8 sm:w-12 sm:h-12 text-blue-300" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Internet Starlink
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 text-blue-100 leading-relaxed px-2">
              Conectividad satelital de alta velocidad para zonas rurales y urbanas
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Hasta 200 Mbps
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Cobertura Global
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Baja Latencia
              </Badge>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => (window.location.href = "/contacto")}
            >
              Solicitar Información
              <Satellite className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              ¿Por qué elegir Starlink?
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              La tecnología satelital más avanzada del mundo, diseñada para brindar internet de alta velocidad en
              cualquier ubicación
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-2 sm:p-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Wifi className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-lg lg:text-xl font-bold text-gray-900">Alta Velocidad</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-2 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                  Velocidades de hasta 200 Mbps ideales para streaming y gaming.
                </p>
                <div className="bg-blue-50 rounded-lg p-1 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700">Perfecto para familias</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-2 sm:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-lg lg:text-xl font-bold text-gray-900">
                  Cobertura Global
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-2 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                  Disponible donde otros proveedores no llegan.
                </p>
                <div className="bg-green-50 rounded-lg p-1 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-green-700">Conectividad total</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-2 sm:p-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-lg lg:text-xl font-bold text-gray-900">Baja Latencia</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-2 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                  20-40ms, ideal para videollamadas y gaming.
                </p>
                <div className="bg-purple-50 rounded-lg p-1 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-purple-700">Experiencia fluida</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-2 sm:p-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-lg lg:text-xl font-bold text-gray-900">
                  Instalación Rápida
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-2 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                  Instalación en 2-4 horas. Kit completo incluido.
                </p>
                <div className="bg-orange-50 rounded-lg p-1 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-orange-700">Listo el mismo día</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-2 sm:p-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-lg lg:text-xl font-bold text-gray-900">Sin Contratos</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-2 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                  Flexibilidad total sin compromisos a largo plazo.
                </p>
                <div className="bg-teal-50 rounded-lg p-1 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-teal-700">Libertad total</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-2 sm:p-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-lg lg:text-xl font-bold text-gray-900">Soporte 24/7</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-2 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                  Atención técnica 24/7. Soporte local en español.
                </p>
                <div className="bg-indigo-50 rounded-lg p-1 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-indigo-700">Siempre disponible</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Resolvemos las dudas más comunes sobre Starlink y nuestros servicios
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Qué incluye la instalación?
              </h3>
              <p className="text-xs sm:text-xs lg:text-sm text-gray-600 sm:text-justify">
                La instalación incluye: antena Starlink, módem WiFi, cables, soporte de montaje, configuración completa
                y pruebas de funcionamiento. Todo listo para usar.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Cuánto tiempo toma la instalación?
              </h3>
              <p className="text-xs sm:text-xs lg:text-sm text-gray-600 sm:text-justify">
                Una instalación estándar toma entre 2-4 horas. Instalaciones complejas pueden requerir hasta 8 horas,
                dependiendo de las características del sitio.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Funciona en cualquier clima?
              </h3>
              <p className="text-xs sm:text-xs lg:text-sm text-gray-600 sm:text-justify">
                Sí, Starlink es portátil. Puedes llevarlo a otra ubicación, aunque recomendamos consultar sobre la
                cobertura en el nuevo sitio antes de mudarlo. El modelo Mini es especialmente diseñado para
                portabilidad, mientras que el Estándar también puede moverse pero está optimizado para instalaciones
                fijas.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Hay límites de datos?
              </h3>
              <p className="text-xs sm:text-xs lg:text-sm text-gray-600 sm:text-justify">
                Depende del plan seleccionado. Los planes Residencial Común e Itinerante Ilimitado no tienen límites de
                datos. Los planes Lite tienen datos ilimitados pero sin prioridad en horas pico. Los planes de 10GB y
                50GB tienen límites mensuales con opción de comprar datos adicionales.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow col-span-2">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Puedo mover el equipo?
              </h3>
              <p className="text-xs sm:text-xs lg:text-sm text-gray-600 sm:text-justify">
                Sí, Starlink está diseñado para funcionar en todas las condiciones climáticas, incluyendo lluvia, nieve
                y viento. La antena tiene calefacción automática.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
