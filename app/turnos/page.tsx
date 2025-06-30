"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Calendar, User, Phone, MapPin, Wrench, Camera, Wifi, Code, CheckCircle, Star, Mail } from "lucide-react"
import { turnosService, perfilService } from "@/lib/firebase-services"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserDocument } from "@/lib/auth-service"

interface Service {
  id: string
  name: string
  description: string
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

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
}

const services: Service[] = [
  {
    id: "reparacion-pc",
    name: "Reparación de PC",
    description: "Diagnóstico y reparación completa de computadoras de escritorio y notebooks",
    category: "Reparación",
    icon: <Wrench className="h-5 w-5 lg:h-6 lg:w-6" />,
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
    category: "Internet",
    icon: <Wifi className="h-5 w-5 lg:h-6 lg:w-6" />,
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
    category: "Seguridad",
    icon: <Camera className="h-5 w-5 lg:h-6 lg:w-6" />,
    features: ["Cámaras HD/4K", "Visión nocturna", "Acceso remoto", "Grabación en la nube", "Monitoreo 24/7"],
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "desarrollo-web",
    name: "Desarrollo Web",
    description: "Creación de sitios web profesionales y aplicaciones web personalizadas",
    category: "Desarrollo",
    icon: <Code className="h-5 w-5 lg:h-6 lg:w-6" />,
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
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
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
  const [showUpdateProfileDialog, setShowUpdateProfileDialog] = useState(false)
  const [originalProfileData, setOriginalProfileData] = useState<UserProfile | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserDocument(firebaseUser.uid)
        if (userData) {
          setUser(userData)
          await loadUserProfile(userData.id)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await perfilService.getUserProfile(userId)
      if (profile) {
        setUserProfile({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        })
        setOriginalProfileData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        })
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || service.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setAppointmentForm({
      ...appointmentForm,
      serviceId: service.id,
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
    })
  }

  const handleFormChange = (field: keyof AppointmentForm, value: string) => {
    setAppointmentForm({ ...appointmentForm, [field]: value })
  }

  const checkProfileChanges = () => {
    if (!originalProfileData) return false

    return (
      appointmentForm.name !== originalProfileData.name ||
      appointmentForm.email !== originalProfileData.email ||
      appointmentForm.phone !== originalProfileData.phone ||
      appointmentForm.address !== originalProfileData.address
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedService || !user) {
      toast({
        title: "Error",
        description: "Por favor selecciona un servicio e inicia sesión",
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

    // Check if profile data changed
    if (checkProfileChanges()) {
      setShowUpdateProfileDialog(true)
      return
    }

    await submitAppointment()
  }

  const submitAppointment = async () => {
    setIsSubmitting(true)

    try {
      const appointmentData = {
        userId: user.id,
        name: appointmentForm.name,
        phone: appointmentForm.phone,
        email: appointmentForm.email,
        address: appointmentForm.address,
        serviceName: selectedService!.name,
        servicePrice: 0, // No price shown anymore
        serviceDuration: 0, // No duration shown anymore
        date: appointmentForm.date,
        time: appointmentForm.time,
        status: "pending" as const,
        notes: appointmentForm.notes,
        createdAt: new Date().toISOString(),
      }

      await turnosService.createAppointment(appointmentData)

      toast({
        title: "¡Turno agendado!",
        description: `Tu turno para ${selectedService!.name} ha sido agendado para el ${new Date(appointmentForm.date).toLocaleDateString("es-AR")} a las ${appointmentForm.time}`,
      })

      // Reset form
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

  const handleUpdateProfile = async (updateProfile: boolean) => {
    if (updateProfile && user) {
      try {
        await perfilService.updateProfile(user.id, {
          name: appointmentForm.name,
          email: appointmentForm.email,
          phone: appointmentForm.phone,
          address: appointmentForm.address,
        })

        toast({
          title: "Perfil actualizado",
          description: "Tus datos de perfil han sido actualizados correctamente",
        })
      } catch (error) {
        console.error("Error updating profile:", error)
        toast({
          title: "Error",
          description: "No se pudo actualizar el perfil",
          variant: "destructive",
        })
      }
    }

    setShowUpdateProfileDialog(false)
    await submitAppointment()
  }

  const categories = [...new Set(services.map((s) => s.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Agendar Turno</h1>
          <p className="text-white/70 text-sm sm:text-base">Selecciona un servicio y agenda tu cita</p>
        </div>

        {!selectedService ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Filtros */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white text-lg sm:text-xl">Buscar Servicios</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm">Buscar</Label>
                    <Input
                      placeholder="Buscar servicios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm">Categoría</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-9 sm:h-10">
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

            {/* Lista de servicios - Responsive: 2 columnas en móvil, 4 en desktop */}
            <div className="grid gap-4 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer group h-full"
                >
                  <CardHeader className="space-y-4 sm:space-y-1 pt-0 p-2 sm:p-4">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <div className="p-1 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                        {service.icon} 
                      </div>
                      <p className="text-white/80 text-m leading-tight line-clamp-20">{service.name}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-1 pt-0 p-2 sm:p-4">
                    
                    <p className="text-white/80 text-xs leading-tight line-clamp-20">{service.description}</p>
                    <Button
                      onClick={() => handleServiceSelect(service)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs py-1.5 sm:py-2 h-7 sm:h-8"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Agendar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 sm:p-8 text-center">
                  <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-white/50" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No se encontraron servicios</h2>
                  <p className="text-white/70">Intenta con otros términos de búsqueda</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Formulario de agendamiento - Más compacto en móvil */
          <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg sm:text-xl">Información del Turno</CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedService(null)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8"
                    >
                      Cambiar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
                    <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-white/90 text-xs sm:text-sm">
                          <User className="h-3 w-3 inline mr-1" />
                          Nombre Completo *
                        </Label>
                        <Input
                          placeholder="Tu nombre completo"
                          value={appointmentForm.name}
                          onChange={(e) => handleFormChange("name", e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 sm:h-9 lg:h-10 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-white/90 text-xs sm:text-sm">
                          <Phone className="h-3 w-3 inline mr-1" />
                          Teléfono *
                        </Label>
                        <Input
                          placeholder="Tu número de teléfono"
                          value={appointmentForm.phone}
                          onChange={(e) => handleFormChange("phone", e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 sm:h-9 lg:h-10 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-white/90 text-xs sm:text-sm">
                        <Mail className="h-3 w-3 inline mr-1" />
                        Email
                      </Label>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={appointmentForm.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 sm:h-9 lg:h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-white/90 text-xs sm:text-sm">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        Dirección
                      </Label>
                      <Input
                        placeholder="Dirección donde se realizará el servicio"
                        value={appointmentForm.address}
                        onChange={(e) => handleFormChange("address", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 sm:h-9 lg:h-10 text-sm"
                      />
                    </div>

                    <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-white/90 text-xs sm:text-sm">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Fecha *
                        </Label>
                        <Input
                          type="date"
                          value={appointmentForm.date}
                          onChange={(e) => handleFormChange("date", e.target.value)}
                          className="bg-white/10 border-white/20 text-white h-8 sm:h-9 lg:h-10 text-sm"
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-white/90 text-xs sm:text-sm">Horario *</Label>
                        <Select value={appointmentForm.time} onValueChange={(value) => handleFormChange("time", value)}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 sm:h-9 lg:h-10 text-sm">
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

                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-white/90 text-xs sm:text-sm">Notas adicionales</Label>
                      <Textarea
                        placeholder="Información adicional sobre el servicio..."
                        value={appointmentForm.notes}
                        onChange={(e) => handleFormChange("notes", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] text-sm"
                        rows={2}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 sm:py-2 lg:py-3 text-sm sm:text-base h-9 sm:h-10 lg:h-11"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Agendando...
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
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
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-white text-base sm:text-lg">Resumen del Servicio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                      {selectedService.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">{selectedService.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-white/70">
                          {selectedService.rating} ({selectedService.reviews} reseñas)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{selectedService.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                      <span>Categoría:</span>
                      <Badge variant="outline" className="text-white/80 border-white/30 text-xs">
                        {selectedService.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-white">Incluye:</h4>
                    <ul className="space-y-1">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="text-xs text-white/70 flex items-start">
                          <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Dialog para actualizar perfil */}
        <Dialog open={showUpdateProfileDialog} onOpenChange={setShowUpdateProfileDialog}>
          <DialogContent className="bg-gray-900 border-gray-700 mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="text-white">Actualizar Perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-white/80 text-sm">
                Has modificado algunos datos de tu perfil. ¿Quieres que actualicemos tu información personal?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleUpdateProfile(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  Sí, actualizar perfil
                </Button>
                <Button
                  onClick={() => handleUpdateProfile(false)}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm"
                >
                  No, solo este turno
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
