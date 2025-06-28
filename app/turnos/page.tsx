"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { turnosService } from "@/lib/firebase-services"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserDocument } from "@/lib/auth-service"

const services = [
  {
    id: "reparacion",
    name: "Reparación de Computadoras",
    duration: 120,
    price: 15000,
    description: "Diagnóstico y reparación completa de equipos",
  },
  {
    id: "starlink",
    name: "Instalación Starlink",
    duration: 180,
    price: 25000,
    description: "Instalación completa de internet satelital",
  },
  {
    id: "camaras",
    name: "Instalación de Cámaras",
    duration: 240,
    price: 35000,
    description: "Sistema completo de videovigilancia",
  },
  {
    id: "desarrollo",
    name: "Desarrollo Web",
    duration: 60,
    price: 20000,
    description: "Consultoría y desarrollo de sitios web",
  },
  {
    id: "consultoria",
    name: "Consultoría Técnica",
    duration: 60,
    price: 8000,
    description: "Asesoramiento técnico especializado",
  },
]

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

export default function TurnosPage() {
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [availableDates, setAvailableDates] = useState([])
  const [availableTimes, setAvailableTimes] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth")
        return
      }

      const userData = await getUserDocument(user.uid)
      if (userData) {
        setUser(userData)

        // Pre-fill form with user data
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          notes: "",
        })

        // Generate available dates
        generateAvailableDates()
      }
    })

    return () => unsubscribe()
  }, [router])

  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip Sundays (0 = Sunday)
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split("T")[0],
          label: date.toLocaleDateString("es-AR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        })
      }
    }

    setAvailableDates(dates)
  }

  const checkAvailableTimes = async (date, serviceId) => {
    try {
      // Get existing appointments for the selected date
      const appointments = await turnosService.getAllAppointments()
      const dateAppointments = appointments.filter((apt) => apt.date === date)
      const bookedTimes = dateAppointments.map((apt) => apt.time)

      // Filter available times
      const available = timeSlots.filter((time) => !bookedTimes.includes(time))
      setAvailableTimes(available)
    } catch (error) {
      console.error("Error checking available times:", error)
      setAvailableTimes(timeSlots)
    }
  }

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId)
    setStep(2)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    checkAvailableTimes(date, selectedService)
    setStep(3)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setStep(4)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const service = services.find((s) => s.id === selectedService)

    const appointmentData = {
      userId: user.id,
      serviceId: selectedService,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration,
      date: selectedDate,
      time: selectedTime,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
    }

    try {
      await turnosService.createAppointment(appointmentData)

      toast({
        title: "¡Turno reservado!",
        description: `Tu turno para ${service.name} ha sido reservado para el ${new Date(selectedDate).toLocaleDateString("es-AR")} a las ${selectedTime}.`,
      })

      setStep(5)
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al reservar tu turno. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const resetForm = () => {
    setStep(1)
    setSelectedService("")
    setSelectedDate("")
    setSelectedTime("")
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      notes: "",
    })
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservar Turno</h1>
            <p className="text-gray-600">Agenda tu cita con nuestros especialistas</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber === 5 && step >= 5 ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-600">
              {step === 1 && "Selecciona un servicio"}
              {step === 2 && "Elige una fecha"}
              {step === 3 && "Selecciona horario"}
              {step === 4 && "Completa tus datos"}
              {step === 5 && "¡Turno confirmado!"}
            </div>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{service.name}</span>
                    <span className="text-lg font-bold text-orange-600">{formatPrice(service.price)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration} minutos
                    </div>
                  </div>
                  <Button
                    onClick={() => handleServiceSelect(service.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    Seleccionar Servicio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Selecciona una fecha
              </CardTitle>
              <p className="text-gray-600">Servicio: {services.find((s) => s.id === selectedService)?.name}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDates.map((date) => (
                  <Button
                    key={date.value}
                    variant="outline"
                    onClick={() => handleDateSelect(date.value)}
                    className="p-4 h-auto text-left hover:bg-orange-50 hover:border-orange-300"
                  >
                    <div>
                      <div className="font-medium">{date.label.split(",")[0]}</div>
                      <div className="text-sm text-gray-600">{date.label.split(",").slice(1).join(",")}</div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Volver a Servicios
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Selecciona un horario
              </CardTitle>
              <p className="text-gray-600">
                {services.find((s) => s.id === selectedService)?.name} -{" "}
                {availableDates.find((d) => d.value === selectedDate)?.label}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    onClick={() => handleTimeSelect(time)}
                    className="p-4 hover:bg-orange-50 hover:border-orange-300"
                  >
                    {time}
                  </Button>
                ))}
              </div>
              {availableTimes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No hay horarios disponibles para esta fecha.</p>
                  <Button variant="outline" onClick={() => setStep(2)} className="mt-4">
                    Elegir otra fecha
                  </Button>
                </div>
              )}
              <div className="mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Volver a Fechas
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Form */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Completa tus datos</CardTitle>
              <div className="text-sm text-gray-600">
                <p>{services.find((s) => s.id === selectedService)?.name}</p>
                <p>
                  {availableDates.find((d) => d.value === selectedDate)?.label} a las {selectedTime}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nombre completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Describe brevemente el problema o servicio requerido..."
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={() => setStep(3)}>
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {loading ? "Reservando..." : "Confirmar Turno"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Turno Confirmado!</h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4">Detalles de tu turno:</h3>
                <div className="space-y-2 text-left">
                  <p>
                    <strong>Servicio:</strong> {services.find((s) => s.id === selectedService)?.name}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {availableDates.find((d) => d.value === selectedDate)?.label}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {availableDates.find((d) => d.value === selectedDate)?.label}
                  </p>
                  <p>
                    <strong>Hora:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Precio:</strong> {formatPrice(services.find((s) => s.id === selectedService)?.price)}
                  </p>
                  <p>
                    <strong>Cliente:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {formData.phone}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Recibirás una confirmación por WhatsApp y email. Nuestro equipo se pondrá en contacto contigo antes de
                la cita.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetForm} variant="outline">
                  Reservar Otro Turno
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
