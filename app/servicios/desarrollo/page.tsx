"use client"

import {
  Globe,
  Code,
  Smartphone,
  Zap,
  Search,
  ShoppingCart,
  BarChart,
  Rocket,
  Monitor,
  Database,
  Cloud,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DesarrolloPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10" />
        <div className="relative container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 sm:p-4">
                <Globe className="w-8 h-8 sm:w-12 sm:h-12 text-orange-300" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Desarrollo Web
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 text-orange-100 leading-relaxed px-2">
              Creamos sitios web modernos, rápidos y optimizados que impulsan tu negocio al siguiente nivel
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Carga Rápida
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Responsive
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                SEO Optimizado
              </Badge>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => (window.location.href = "/contacto")}
            >
              Solicitar Información
              <Globe className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Servicios de Desarrollo
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Soluciones web completas desde landing pages hasta e-commerce y aplicaciones empresariales
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Landing Pages</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Páginas de aterrizaje optimizadas para conversión, perfectas para campañas de marketing y captación de
                  leads.
                </p>
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700">Desde $299 - Entrega en 5 días</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                  Sitios Corporativos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Sitios web profesionales para empresas con diseño moderno, gestión de contenido y optimización SEO.
                </p>
                <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-green-700">Desde $799 - Entrega en 15 días</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">E-commerce</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Tiendas online completas con carrito de compras, pasarelas de pago y gestión de inventario.
                </p>
                <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-purple-700">Desde $1,299 - Entrega en 25 días</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Apps Web</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Aplicaciones web personalizadas para gestión empresarial, CRM, dashboards y sistemas internos.
                </p>
                <div className="bg-orange-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-orange-700">
                    Desde $1,999 - Cotización personalizada
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                  Desarrollo a Medida
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Soluciones completamente personalizadas según tus necesidades específicas y requerimientos únicos.
                </p>
                <div className="bg-teal-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-teal-700">Cotización personalizada</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Actualizaciones, backups, seguridad y soporte técnico continuo para mantener tu sitio siempre
                  actualizado.
                </p>
                <div className="bg-indigo-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-indigo-700">Desde $99/mes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Tecnologías que Utilizamos
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Stack tecnológico moderno para garantizar sitios web rápidos, seguros y escalables
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold">Frontend</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                  <li>• React / Next.js</li>
                  <li>• Vue.js / Nuxt.js</li>
                  <li>• HTML5 / CSS3</li>
                  <li>• Tailwind CSS</li>
                  <li>• JavaScript / TypeScript</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold">Backend</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                  <li>• Node.js / Express</li>
                  <li>• Python / Django</li>
                  <li>• PHP / Laravel</li>
                  <li>• APIs RESTful</li>
                  <li>• GraphQL</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold">Base de Datos</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                  <li>• MySQL / PostgreSQL</li>
                  <li>• MongoDB</li>
                  <li>• Firebase</li>
                  <li>• Supabase</li>
                  <li>• Redis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold">Hosting</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                  <li>• Vercel / Netlify</li>
                  <li>• AWS / Google Cloud</li>
                  <li>• DigitalOcean</li>
                  <li>• CDN Global</li>
                  <li>• SSL Gratuito</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Nuestro Proceso de Trabajo
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Metodología probada para entregar proyectos exitosos en tiempo y forma
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-lg sm:text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">Análisis</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Entendemos tus necesidades, objetivos y audiencia target para crear la estrategia perfecta.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-lg sm:text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">Diseño</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Creamos wireframes y diseños que reflejen tu marca y optimicen la experiencia del usuario.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-lg sm:text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">Desarrollo</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Programamos tu sitio con las mejores prácticas, optimización y funcionalidades requeridas.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-lg sm:text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">Lanzamiento</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Realizamos pruebas exhaustivas, optimizamos y lanzamos tu sitio con soporte continuo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Proyectos Destacados
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Algunos ejemplos de nuestro trabajo reciente en diferentes industrias
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Monitor className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
              <CardContent className="p-3 sm:p-6">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">E-commerce de Moda</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-2">
                  Tienda online completa con carrito, pagos y gestión de inventario para marca de ropa local.
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Badge variant="outline" className="text-xs">
                    React
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Node.js
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Stripe
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
              <CardContent className="p-3 sm:p-6">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Portal Corporativo</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-2">
                  Sitio web institucional para empresa de servicios con blog, formularios y área de clientes.
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Badge variant="outline" className="text-xs">
                    Next.js
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    CMS
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    SEO
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <BarChart className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
              <CardContent className="p-3 sm:p-6">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Dashboard Analytics</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-2">
                  Aplicación web para visualización de datos y métricas empresariales en tiempo real.
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Badge variant="outline" className="text-xs">
                    Vue.js
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Charts
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    API
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
