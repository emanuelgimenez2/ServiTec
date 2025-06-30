"use client"

import {
  Camera,
  Shield,
  Eye,
  Smartphone,
  Cloud,
  Home,
  Building,
  Store,
  Factory,
  AlertTriangle,
  Wifi,
  HardDrive,
  Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CamarasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10" />
        <div className="relative container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 sm:p-4">
                <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-purple-300" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Cámaras de Seguridad
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 text-purple-100 leading-relaxed px-2">
              Protege lo que más importa con sistemas de videovigilancia de última generación
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Visión Nocturna
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                App Móvil
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Cloud className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Almacenamiento Cloud
              </Badge>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => (window.location.href = "/contacto")}
            >
              Solicitar Información
              <Camera className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Sistemas de Seguridad Integrales
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Tecnología avanzada para proteger tu hogar, negocio o empresa con monitoreo 24/7 y alertas en tiempo real
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                  Monitoreo Remoto
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-1 sm:mb-4 line-clamp-30">
                  Accede a tus cámaras desde cualquier lugar del mundo a través la app móvil.
                </p>
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700">Control total desde tu celular</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Visión Nocturna</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-30">
                  Tecnología infrarroja avanzada para vigilancia clara y nítida incluso en completa oscuridad.
                </p>
                <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-green-700">Protección las 24 horas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                  Detección Inteligente de Movimiento                                             
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-30">
                  Detecta personas, vehículos y movimientos sospechosos con alertas instantáneas.                                                  
                </p>
                <div className="bg-orange-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-orange-700">
                    Alertas inteligentes en tiempo real
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                  Almacenamiento Cloud
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-30">
                  Respaldo automático en la nube con acceso seguro a grabaciones desde cualquier dispositivo.
                </p>
                <div className="bg-teal-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-teal-700">Tus grabaciones siempre seguras</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Types Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Soluciones para Cada Necesidad
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Sistemas personalizados según el tipo de propiedad y nivel de seguridad requerido
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Home className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold">Residencial</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                  <li>• 2-8 cámaras</li>
                  <li>• Visión nocturna</li>
                  <li>• App móvil</li>
                  <li>• Grabación local</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Store className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold">Comercial</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                  <li>• 4-16 cámaras</li>
                  <li>• Detección IA</li>
                  <li>• Almacenamiento cloud</li>
                  <li>• Monitoreo 24/7</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Building className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold">Empresarial</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                  <li>• 8-32 cámaras</li>
                  <li>• Sistema integrado</li>
                  <li>• Control de acceso</li>
                  <li>• Redundancia</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Factory className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold">Industrial</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                  <li>• 16+ cámaras</li>
                  <li>• Resistente clima</li>
                  <li>• Análisis avanzado</li>
                  <li>• Integración sistemas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Tecnología de Vanguardia
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Equipos de las mejores marcas mundiales con la última tecnología en videovigilancia
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
             <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-2 sm:mb-4">
                <Wifi className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                <h3 className="font-bold text-sm sm:text-base lg:text-lg">Conectividad IP</h3>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                Cámaras IP con conectividad WiFi instalación flexible y acceso remoto.
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• WiFi de alta velocidad</li>
              </ul>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-2 sm:mb-4">
                <HardDrive className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                <h3 className="font-bold text-sm sm:text-base lg:text-lg">Almacenamiento</h3>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                Múltiples opciones de almacenamiento: local, cloud y híbrido para máxima seguridad de datos.
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• Backup automático en cloud</li>
              </ul>
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
              Resolvemos las dudas más comunes sobre sistemas de videovigilancia
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Qué incluye la instalación?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Incluye: cámaras, configuración completa, app móvil, pruebas de
                funcionamiento y capacitación básica.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Cuánto tiempo toma la instalación?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Depende del número de cámaras: 2-4 cámaras (4-6 horas), 4-8 cámaras (6-8 horas), sistemas más grandes
                pueden requerir 1-2 días.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Puedo ver las cámaras desde mi celular?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Sí, incluimos app móvil gratuita para iOS y Android. Podrás ver en vivo, recibir alertas y revisar
                grabaciones desde cualquier lugar.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Las cámaras funcionan de noche?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Sí, todas nuestras cámaras incluyen visión nocturna infrarroja con alcance de 20-30 metros en completa
                oscuridad.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
