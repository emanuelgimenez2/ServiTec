"use client"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Satellite, Wifi, Globe, Zap, Shield, Clock, Award, Calculator, Users, TrendingUp } from "lucide-react"

export default function StarlinkPage() {
  const [showCalculator, setShowCalculator] = useState(false)

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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Wifi className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Alta Velocidad</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Velocidades de descarga de hasta 200 Mbps y carga de hasta 20 Mbps, ideales para streaming, gaming y
                  trabajo remoto.
                </p>
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700">Perfecto para familias y empresas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                  Cobertura Global
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Disponible en zonas rurales y urbanas donde otros proveedores no llegan. Sin limitaciones geográficas.
                </p>
                <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-green-700">Conectividad donde la necesites</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Baja Latencia</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Latencia de 20-40ms, comparable a conexiones terrestres. Ideal para videollamadas y gaming online.
                </p>
                <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-purple-700">Experiencia fluida garantizada</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                  Instalación Rápida
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Instalación profesional en 2-4 horas. Kit completo incluido con antena, módem y todos los accesorios.
                </p>
                <div className="bg-orange-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-orange-700">Listo para usar el mismo día</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Sin Contratos</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Flexibilidad total sin compromisos a largo plazo. Pausa o cancela tu servicio cuando quieras.
                </p>
                <div className="bg-teal-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-teal-700">Libertad y flexibilidad</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Soporte 24/7</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4 line-clamp-3">
                  Atención técnica especializada las 24 horas, los 7 días de la semana. Soporte local en español.
                </p>
                <div className="bg-indigo-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-indigo-700">Siempre estamos para ayudarte</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Planes y Precios</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Opciones flexibles para hogares y empresas, con la mejor relación calidad-precio del mercado
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Plan Residencial */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-lg sm:text-2xl font-bold">Residencial</h3>
                  <div className="bg-white/20 rounded-full p-1 sm:p-2">
                    <Wifi className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">$99</div>
                <p className="text-blue-100 text-sm sm:text-base">por mes</p>
              </div>
              <CardContent className="p-3 sm:p-6">
                <ul className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Hasta 100 Mbps de descarga</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Hasta 10 Mbps de carga</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Latencia 20-40ms</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Datos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Kit de instalación incluido</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm lg:text-base">
                  Elegir Plan
                </Button>
              </CardContent>
            </Card>

            {/* Plan Business */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-orange-500">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-4 py-1 rounded-b-lg text-xs sm:text-sm font-semibold">
                Más Popular
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-3 sm:p-6 mt-4 sm:mt-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-lg sm:text-2xl font-bold">Business</h3>
                  <div className="bg-white/20 rounded-full p-1 sm:p-2">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">$199</div>
                <p className="text-orange-100 text-sm sm:text-base">por mes</p>
              </div>
              <CardContent className="p-3 sm:p-6">
                <ul className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Hasta 200 Mbps de descarga</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Hasta 20 Mbps de carga</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Latencia 20-30ms</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Datos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Soporte prioritario</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">IP estática disponible</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs sm:text-sm lg:text-base">
                  Elegir Plan
                </Button>
              </CardContent>
            </Card>

            {/* Plan Enterprise */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-lg sm:text-2xl font-bold">Enterprise</h3>
                  <div className="bg-white/20 rounded-full p-1 sm:p-2">
                    <Award className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">$399</div>
                <p className="text-purple-100 text-sm sm:text-base">por mes</p>
              </div>
              <CardContent className="p-3 sm:p-6">
                <ul className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Hasta 500 Mbps de descarga</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Hasta 50 Mbps de carga</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Latencia 15-25ms</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Datos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">SLA 99.9% uptime</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Soporte técnico dedicado</span>
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm lg:text-base">
                  Contactar Ventas
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent text-xs sm:text-sm lg:text-base"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <Calculator className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Calculadora de Costos
            </Button>
          </div>

          {showCalculator && (
            <Card className="mt-6 sm:mt-8 max-w-2xl mx-auto">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-center text-sm sm:text-base lg:text-lg">
                  Calculadora de Costos Starlink
                </CardTitle>
                <CardDescription className="text-center text-xs sm:text-sm">
                  Estima el costo total de tu instalación Starlink
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Plan Seleccionado</label>
                      <Select>
                        <SelectTrigger className="text-xs sm:text-sm">
                          <SelectValue placeholder="Selecciona un plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residencial - $99/mes</SelectItem>
                          <SelectItem value="business">Business - $199/mes</SelectItem>
                          <SelectItem value="enterprise">Enterprise - $399/mes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Tipo de Instalación</label>
                      <Select>
                        <SelectTrigger className="text-xs sm:text-sm">
                          <SelectValue placeholder="Tipo de instalación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Estándar - $200</SelectItem>
                          <SelectItem value="complex">Compleja - $400</SelectItem>
                          <SelectItem value="enterprise">Empresarial - $800</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Resumen de Costos:</h4>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span>Kit Starlink:</span>
                        <span>$599</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Instalación:</span>
                        <span>$200 - $800</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Plan mensual:</span>
                        <span>$99 - $399</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Costo inicial estimado:</span>
                        <span>$799 - $1,399</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Qué incluye la instalación?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                La instalación incluye: antena Starlink, módem WiFi, cables, soporte de montaje, configuración completa
                y pruebas de funcionamiento. Todo listo para usar.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Cuánto tiempo toma la instalación?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Una instalación estándar toma entre 2-4 horas. Instalaciones complejas pueden requerir hasta 8 horas,
                dependiendo de las características del sitio.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Funciona en cualquier clima?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Sí, Starlink está diseñado para funcionar en todas las condiciones climáticas, incluyendo lluvia, nieve
                y viento. La antena tiene calefacción automática.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Hay límites de datos?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                No, todos nuestros planes incluyen datos ilimitados. Puedes usar internet sin preocuparte por límites de
                descarga o carga.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Qué garantía ofrecen?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Ofrecemos 2 años de garantía en la instalación y 1 año en equipos. Además, soporte técnico gratuito
                durante toda la vida útil del servicio.
              </p>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-gray-900">
                ¿Puedo mover el equipo?
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Sí, Starlink es portátil. Puedes llevarlo a otra ubicación, aunque recomendamos consultar sobre la
                cobertura en el nuevo sitio antes de mudarlo.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
