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
  Shield,
  Award,
  Globe,
  Laptop,
  Camera,
  Satellite,
} from "lucide-react"
// Cambiar la importación
import { mensajeService } from "@/lib/firebase-services"

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

      // En la función handleSubmit, cambiar:
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <MessageSquare className="w-12 h-12 text-blue-300" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Contáctanos
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Estamos aquí para ayudarte con todas tus necesidades tecnológicas
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Respuesta en 24hs
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-4 py-2 text-sm">
                <Headphones className="w-4 h-4 mr-2" />
                Soporte 24/7
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                <Award className="w-4 h-4 mr-2" />
                Atención Personalizada
              </Badge>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Enviar Mensaje
              <Send className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Múltiples Formas de Contactarnos</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elige la forma que más te convenga para ponerte en contacto con nuestro equipo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Teléfono</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Llámanos directamente para consultas urgentes</p>
                <div className="space-y-2">
                  <p className="font-semibold text-blue-600">+54 11 1234-5678</p>
                  <p className="text-sm text-gray-500">Lun-Vie: 9:00-18:00</p>
                  <p className="text-sm text-gray-500">Sáb: 9:00-13:00</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Envíanos un email detallado</p>
                <div className="space-y-2">
                  <p className="font-semibold text-green-600">info@servitec.com</p>
                  <p className="text-sm text-gray-500">Respuesta en 24hs</p>
                  <p className="text-sm text-gray-500">Lun-Dom: 24/7</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Visítanos en nuestra oficina</p>
                <div className="space-y-2">
                  <p className="font-semibold text-purple-600">CABA, Argentina</p>
                  <p className="text-sm text-gray-500">Servicio a domicilio</p>
                  <p className="text-sm text-gray-500">CABA y GBA</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Horarios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Nuestros horarios de atención</p>
                <div className="space-y-2">
                  <p className="font-semibold text-orange-600">Lun-Vie: 9-18hs</p>
                  <p className="text-sm text-gray-500">Sáb: 9-13hs</p>
                  <p className="text-sm text-gray-500">Dom: Emergencias</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluciones tecnológicas integrales para particulares y empresas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
              <CardHeader>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Laptop className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Reparación PC</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Diagnóstico y reparación de computadoras, notebooks y equipos informáticos
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Ver Más
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
              <CardHeader>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Desarrollo Web</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Sitios web, e-commerce y aplicaciones web personalizadas y modernas
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Ver Más
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
              <CardHeader>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Cámaras Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Sistemas de videovigilancia 4K con monitoreo remoto y almacenamiento cloud
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Ver Más
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
              <CardHeader>
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Satellite className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Internet Starlink</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Internet satelital de alta velocidad para zonas rurales y urbanas
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Ver Más
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Envíanos tu Consulta</h2>
              <p className="text-xl text-gray-600">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué elegir ServiTec?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-4">
                        <Star className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Experiencia Comprobada</h4>
                        <p className="text-gray-600">Más de 5 años brindando soluciones tecnológicas</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-4">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Garantía Total</h4>
                        <p className="text-gray-600">Todos nuestros servicios incluyen garantía extendida</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-2 mr-4">
                        <Zap className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Respuesta Rápida</h4>
                        <p className="text-gray-600">Atención inmediata para consultas y emergencias</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-4">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Equipo Especializado</h4>
                        <p className="text-gray-600">Técnicos certificados en todas las áreas</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h4 className="font-bold text-blue-900 mb-4">Información de Contacto</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-semibold text-blue-800">+54 11 1234-5678</p>
                        <p className="text-sm text-blue-600">WhatsApp disponible</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-semibold text-blue-800">info@servitec.com</p>
                        <p className="text-sm text-blue-600">Respuesta garantizada en 24hs</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-semibold text-blue-800">CABA, Argentina</p>
                        <p className="text-sm text-blue-600">Servicio a domicilio en CABA y GBA</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-semibold text-blue-800">Lun-Vie: 9:00-18:00</p>
                        <p className="text-sm text-blue-600">Sáb: 9:00-13:00 | Dom: Emergencias</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Formulario de Contacto</CardTitle>
                  <CardDescription className="text-center">
                    Completa todos los campos para una respuesta más rápida y precisa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre Completo *
                        </label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          required
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="+54 11 1234-5678"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="tu@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                          Empresa/Organización
                        </label>
                        <Input
                          id="empresa"
                          name="empresa"
                          type="text"
                          value={formData.empresa}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="Nombre de tu empresa (opcional)"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="servicio" className="block text-sm font-medium text-gray-700 mb-2">
                          Servicio de Interés *
                        </label>
                        <Select
                          value={formData.servicio}
                          onValueChange={(value) => handleSelectChange("servicio", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un servicio" />
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
                        <label htmlFor="urgencia" className="block text-sm font-medium text-gray-700 mb-2">
                          Nivel de Urgencia
                        </label>
                        <Select
                          value={formData.urgencia}
                          onValueChange={(value) => handleSelectChange("urgencia", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="¿Qué tan urgente es?" />
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

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
                          Asunto *
                        </label>
                        <Input
                          id="asunto"
                          name="asunto"
                          type="text"
                          required
                          value={formData.asunto}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="Resumen breve de tu consulta"
                        />
                      </div>
                      <div>
                        <label htmlFor="comoConociste" className="block text-sm font-medium text-gray-700 mb-2">
                          ¿Cómo nos conociste?
                        </label>
                        <Select
                          value={formData.comoConociste}
                          onValueChange={(value) => handleSelectChange("comoConociste", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
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
                      <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje Detallado *
                      </label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        className="w-full"
                        rows={5}
                        placeholder="Describe detalladamente tu consulta, problema o requerimiento. Incluye toda la información que consideres relevante para poder ayudarte mejor."
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Información importante:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Responderemos tu consulta en menos de 24 horas</li>
                        <li>• Para emergencias, llámanos directamente al teléfono</li>
                        <li>• Todos los presupuestos son gratuitos y sin compromiso</li>
                        <li>• Ofrecemos servicio a domicilio en CABA y GBA</li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Enviando mensaje...
                        </>
                      ) : (
                        <>
                          Enviar Mensaje
                          <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      * Campos obligatorios. Tu información está protegida y no será compartida con terceros.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Resolvemos las dudas más comunes sobre nuestros servicios
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 text-gray-900">¿Ofrecen servicio a domicilio?</h3>
              <p className="text-gray-600">
                Sí, brindamos servicio técnico a domicilio en CABA y Gran Buenos Aires. El costo del traslado se incluye
                en el presupuesto.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 text-gray-900">¿Los presupuestos tienen costo?</h3>
              <p className="text-gray-600">
                No, todos nuestros presupuestos son completamente gratuitos y sin compromiso. Solo pagas si decides
                contratar el servicio.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 text-gray-900">¿Qué garantía ofrecen?</h3>
              <p className="text-gray-600">
                Ofrecemos garantía extendida en todos nuestros servicios: 6 meses en reparaciones, 1 año en
                instalaciones y 2 años en desarrollo web.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 text-gray-900">¿Atienden emergencias?</h3>
              <p className="text-gray-600">
                Sí, tenemos servicio de emergencias 24/7 para problemas críticos. Contáctanos por teléfono para atención
                inmediata.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 text-gray-900">¿Trabajan con empresas?</h3>
              <p className="text-gray-600">
                Absolutamente. Tenemos planes especiales para empresas con contratos de mantenimiento y soporte técnico
                continuo.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 text-gray-900">¿Aceptan todos los medios de pago?</h3>
              <p className="text-gray-600">
                Sí, aceptamos efectivo, transferencias bancarias, tarjetas de débito/crédito y todos los medios de pago
                digitales.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
