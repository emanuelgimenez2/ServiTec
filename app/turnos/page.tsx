"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, User, Phone, MapPin, Wrench, Camera, Wifi, Code, CheckCircle, Star } from "lucide-react"
import { turnosService } from "@/lib/firebase-services"

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  icon: React.ReactNode
  features: string[]
  rating: number
  reviews: number
}

interface AppointmentForm {
  name: string
  phone: string
  email: string
  address: string
  serviceId: string
  date: string
  time: string
  notes: string
}

const services: Service[] = [
  {
    id: "reparacion-pc",
    name: "Reparación de PC",
    description: "Diagnóstico y reparación completa de computadoras de escritorio y notebooks",
    duration: 120,
    price: 15000,
    category: "Reparación",
    icon: <Wrench className="h-6 w-6" />,
    features: [
      "Diagnóstico completo",
      "Limpieza interna",
      "Actualización de software",
      "Instalación de programas",
      "Garantía de 30 días",
    ],
    rating: 4.8,
    reviews: 127,
  },
  {
    id: "instalacion-starlink",
    name: "Instalación Starlink",
    description: "Instalación profesional de internet satelital Starlink con configuración completa",
    duration: 180,
    price: 25000,
    category: "Internet",
    icon: <Wifi className="h-6 w-6" />,
    features: [
      "Instalación de antena",
      "Configuración de red",
      "Optimización de señal",
      "Capacitación de uso",
      "Soporte post-instalación",
    ],
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "camaras-seguridad",
    name: "Cámaras de Seguridad",
    description: "Instalación y configuración de sistemas de videovigilancia para hogares y empresas",
    duration: 240,
    price: 35000,
    category: "Seguridad",
    icon: <Camera className="h-6 w-6" />,
    features: ["Cámaras HD/4K", "Visión nocturna", "Acceso remoto", "Grabación en la nube", "Monitoreo 24/7"],
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "desarrollo-web",
    name: "Desarrollo Web",
    description: "Creación de sitios web profesionales y aplicaciones web personalizadas",
    duration: 480,
    price: 50000,
    category: "Desarrollo",
    icon: <Code className="h-6 w-6" />,
    features: [
      "Diseño responsive",
      "SEO optimizado",
      "Panel de administración",
      "Hosting incluido",
      "Mantenimiento mensual",
    ],
    rating: 5.0,
    reviews: 43,
  },
]

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

export default function TurnosPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    serviceId: "",
    date: "",
    time: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const { toast } = useToast()

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || service.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setAppointmentForm({ ...appointmentForm, serviceId: service.id })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedService) {
      toast({
        title: "Error",
        description: "Por favor selecciona un servicio",
        variant: "destructive",
      })
      return
    }

    if (!appointmentForm.name || !appointmentForm.phone || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const appointmentData = {
        userId: "current_user", // En producción usar el ID real del usuario
        name: appointmentForm.name,
        phone: appointmentForm.phone,
        email: appointmentForm.email,
        address: appointmentForm.address,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        serviceDuration: selectedService.duration,
        date: appointmentForm.date,
        time: appointmentForm.time,
        status: "pending" as const,
        notes: appointmentForm.notes,
        createdAt: new Date().toISOString(),
      }

      await turnosService.createAppointment(appointmentData)

      toast({
        title: "¡Turno agendado!",
        description: `Tu turno para ${selectedService.name} ha sido agendado para el ${new Date(appointmentForm.date).toLocaleDateString("es-AR")} a las ${appointmentForm.time}`,
      })

      // Resetear formulario
      setAppointmentForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        serviceId: "",
        date: "",
        time: "",
        notes: "",
      })
      setSelectedService(null)
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al agendar tu turno. Inténtalo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${mins}min`
    }
  }

  const categories = [...new Set(services.map((s) => s.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Agendar Turno</h1>
          <p className="text-white/70">Selecciona un servicio y agenda tu cita</p>
        </div>

        {!selectedService ? (
          <div className="space-y-6">
            {/* Filtros */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Buscar Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-white/90">Buscar</Label>
                    <Input
                      placeholder="Buscar servicios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90">Categoría</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de servicios */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                          {service.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white group-hover:text-blue-300 transition-colors">
                            {service.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-white/80 border-white/30 text-xs">
                              {service.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-white/70">
                                {service.rating} ({service.reviews})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{formatPrice(service.price)}</div>
                        <div className="text-sm text-white/70 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(service.duration)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 text-sm">{service.description}</p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-white">Incluye:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-xs text-white/70 flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => handleServiceSelect(service)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Turno
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-white/50" />
                  <h2 className="text-2xl font-bold text-white mb-2">No se encontraron servicios</h2>
                  <p className="text-white/70">Intenta con otros términos de búsqueda</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Formulario de agendamiento */
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Información del Turno</CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedService(null)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Cambiar Servicio
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-white/90">
                          <User className="h-4 w-4 inline mr-1" />
                          Nombre Completo *
                        </Label>
                        <Input
                          placeholder="Tu nombre completo"
                          value={appointmentForm.name}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/90">
                          <Phone className="h-4 w-4 inline mr-1" />
                          Teléfono *
                        </Label>
                        <Input
                          placeholder="Tu número de teléfono"
                          value={appointmentForm.phone}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/90">Email</Label>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={appointmentForm.email}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/90">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Dirección
                      </Label>
                      <Input
                        placeholder="Dirección donde se realizará el servicio"
                        value={appointmentForm.address}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, address: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-white/90">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Fecha *
                        </Label>
                        <Input
                          type="date"
                          value={appointmentForm.date}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/90">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Horario *
                        </Label>
                        <Select
                          value={appointmentForm.time}
                          onValueChange={(value) => setAppointmentForm({ ...appointmentForm, time: value })}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Selecciona un horario" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/90">Notas adicionales</Label>
                      <Textarea
                        placeholder="Información adicional sobre el servicio..."
                        value={appointmentForm.notes}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Agendando...
                        </>
                      ) : (
                        <>
                          <Calendar className="h-5 w-5 mr-2" />
                          Confirmar Turno
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Resumen del servicio */}
            <div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-white">Resumen del Servicio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                      {selectedService.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{selectedService.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-white/70">
                          {selectedService.rating} ({selectedService.reviews} reseñas)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm">{selectedService.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80">
                      <span>Duración:</span>
                      <span>{formatDuration(selectedService.duration)}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Categoría:</span>
                      <Badge variant="outline" className="text-white/80 border-white/30 text-xs">
                        {selectedService.category}
                      </Badge>
                    </div>
                    <div className="border-t border-white/20 pt-2">
                      <div className="flex justify-between text-lg font-bold text-white">
                        <span>Precio:</span>
                        <span className="text-green-400">{formatPrice(selectedService.price)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">Incluye:</h4>
                    <ul className="space-y-1">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="text-xs text-white/70 flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
