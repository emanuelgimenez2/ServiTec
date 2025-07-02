"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { mensajeService } from "@/lib/firebase-services"

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Star,
  Users,
  Headphones,
  Zap,
  Award,
  Globe,
  Laptop,
  Camera,
  Satellite,
} from "lucide-react"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    servicio: "",
    asunto: "",
    mensaje: "",
    urgencia: "",
    empresa: "",
    comoConociste: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const message = {
        serviceType: "contacto",
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        empresa: formData.empresa,
        servicio: formData.servicio,
        urgencia: formData.urgencia,
        asunto: formData.asunto,
        comoConociste: formData.comoConociste,
        mensaje: formData.mensaje,
      }

      await mensajeService.createMessage(message)

      toast({
        title: "¡Mensaje enviado!",
        description: "Te contactaremos pronto. ¡Gracias por elegirnos!",
      })

      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        servicio: "",
        asunto: "",
        mensaje: "",
        urgencia: "",
        empresa: "",
        comoConociste: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16">
      {/* Hero Section - Optimizado para móvil */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10" />
        <div className="relative container mx-auto px-4 py-8 sm:py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                <MessageSquare className="w-8 h-8 text-blue-300" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Contáctanos
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 text-blue-100 leading-relaxed px-4">
              Estamos aquí para ayudarte con todas tus necesidades tecnológicas
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-2 py-1 text-xs sm:text-sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                Respuesta en 24hs
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-2 py-1 text-xs sm:text-sm">
                <Headphones className="w-3 h-3 mr-1" />
                Soporte 24/7
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-2 py-1 text-xs sm:text-sm">
                <Award className="w-3 h-3 mr-1" />
                Atención Personalizada
              </Badge>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Enviar Mensaje
              <Send className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info Section - Grid de 2 columnas en móvil */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-3">
              Múltiples Formas de Contactarnos
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Elige la forma que más te convenga para ponerte en contacto con nosotros
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">Teléfono</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="font-semibold text-blue-600 text-xs sm:text-sm lg:text-base break-all">+54 3442 646670</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">Email</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="font-semibold text-green-600 text-xs sm:text-sm lg:text-base break-all">
                  informaticabalbin@gmail.com
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">Ubicación</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="font-semibold text-purple-600 text-xs sm:text-sm lg:text-base">
                  Balbin y Baldoni, Concepción del Uruguay, Argentina
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">Horarios</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="font-semibold text-orange-600 text-xs sm:text-sm lg:text-base">Lun-Vie: 9-18hs</p>
                <p className="font-semibold text-orange-600 text-xs sm:text-sm lg:text-base">Sáb: 9-13hs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview - Grid de 2 columnas en móvil */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-3">Nuestros Servicios</h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Soluciones tecnológicas integrales para particulares y empresas
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Laptop className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">Reparación PC</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Diagnóstico y reparación de computadoras, notebooks y equipos informáticos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Satellite className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
                  Internet Starlink
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Internet satelital de alta velocidad para zonas rurales y urbanas
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
                  Cámaras Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Sistemas de videovigilancia con monitoreo remoto y almacenamiento cloud
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
                  Desarrollo Web
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Sitios web, e-commerce y aplicaciones web personalizadas y modernas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form - Optimizado para móvil */}
      <section id="contact-form" className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-3">Envíanos tu Consulta</h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-600 px-4">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
              {/* Contact Info - Compacto para móvil */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                    ¿Por qué elegir ServiTec?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <Star className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Experiencia Comprobada</h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Más de 5 años brindando soluciones tecnológicas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <Zap className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Respuesta Rápida</h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Atención inmediata para consultas y emergencias
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Equipo Especializado</h4>
                        <p className="text-gray-600 text-xs sm:text-sm">Técnicos certificados en todas las áreas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form - Optimizado para móvil */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl border-0">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl text-center">Formulario de Contacto</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm lg:text-base">
                      Completa todos los campos para una respuesta más rápida y precisa
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre *
                          </label>
                          <Input
                            id="nombre"
                            name="nombre"
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="w-full text-sm"
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div>
                          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono *
                          </label>
                          <Input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            required
                            value={formData.telefono}
                            onChange={handleInputChange}
                            className="w-full text-sm"
                            placeholder="+54 11 1234-5678"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full text-sm"
                            placeholder="tu@email.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">
                            Empresa
                          </label>
                          <Input
                            id="empresa"
                            name="empresa"
                            type="text"
                            value={formData.empresa}
                            onChange={handleInputChange}
                            className="w-full text-sm"
                            placeholder="Tu empresa (opcional)"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label htmlFor="servicio" className="block text-sm font-medium text-gray-700 mb-1">
                            Servicio *
                          </label>
                          <Select
                            value={formData.servicio}
                            onValueChange={(value) => handleSelectChange("servicio", value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Selecciona servicio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="reparacion-pc">Reparación de PC</SelectItem>
                              <SelectItem value="desarrollo-web">Desarrollo Web</SelectItem>
                              <SelectItem value="camaras-seguridad">Cámaras de Seguridad</SelectItem>
                              <SelectItem value="internet-starlink">Internet Starlink</SelectItem>
                              <SelectItem value="consultoria">Consultoría Tecnológica</SelectItem>
                              <SelectItem value="mantenimiento">Mantenimiento Preventivo</SelectItem>
                              <SelectItem value="otro">Otro servicio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label htmlFor="urgencia" className="block text-sm font-medium text-gray-700 mb-1">
                            Urgencia
                          </label>
                          <Select
                            value={formData.urgencia}
                            onValueChange={(value) => handleSelectChange("urgencia", value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Nivel de urgencia" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baja">Baja - Puedo esperar</SelectItem>
                              <SelectItem value="media">Media - En unos días</SelectItem>
                              <SelectItem value="alta">Alta - Lo antes posible</SelectItem>
                              <SelectItem value="critica">Crítica - Es una emergencia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
                            Asunto *
                          </label>
                          <Input
                            id="asunto"
                            name="asunto"
                            type="text"
                            required
                            value={formData.asunto}
                            onChange={handleInputChange}
                            className="w-full text-sm"
                            placeholder="Resumen de tu consulta"
                          />
                        </div>
                        <div>
                          <label htmlFor="comoConociste" className="block text-sm font-medium text-gray-700 mb-1">
                            ¿Cómo nos conociste?
                          </label>
                          <Select
                            value={formData.comoConociste}
                            onValueChange={(value) => handleSelectChange("comoConociste", value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Selecciona opción" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="google">Búsqueda en Google</SelectItem>
                              <SelectItem value="redes-sociales">Redes Sociales</SelectItem>
                              <SelectItem value="recomendacion">Recomendación</SelectItem>
                              <SelectItem value="publicidad">Publicidad</SelectItem>
                              <SelectItem value="cliente-anterior">Ya soy cliente</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                          Mensaje *
                        </label>
                        <Textarea
                          id="mensaje"
                          name="mensaje"
                          required
                          value={formData.mensaje}
                          onChange={handleInputChange}
                          className="w-full text-sm"
                          rows={4}
                          placeholder="Describe tu consulta, problema o requerimiento..."
                        />
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Información importante:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Responderemos en menos de 24 horas</li>
                          <li>• Para emergencias, llámanos directamente</li>
                          <li>• Presupuestos gratuitos y sin compromiso</li>
                          <li>• Servicio a domicilio disponible</li>
                        </ul>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar Mensaje
                            <Send className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        * Campos obligatorios. Tu información está protegida.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
