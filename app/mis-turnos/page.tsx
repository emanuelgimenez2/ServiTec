"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hourglass,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { turnosService } from "@/lib/firebase-services"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserDocument } from "@/lib/auth-service"

const statusConfig = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Hourglass,
  },
  confirmed: {
    label: "Confirmado",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  completed: {
    label: "Completado",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
}

export default function MisTurnosPage() {
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
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
        await loadAppointments(userData.id)
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    // Filter appointments based on search and status
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter])

  const loadAppointments = async (userId) => {
    try {
      const userAppointments = await turnosService.getUserAppointments(userId)
      setAppointments(userAppointments)
    } catch (error) {
      console.error("Error loading appointments:", error)
      setAppointments([])
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await turnosService.cancelAppointment(appointmentId)
      await loadAppointments(user.id)

      toast({
        title: "Turno cancelado",
        description: "Tu turno ha sido cancelado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al cancelar tu turno.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const canCancelAppointment = (appointment) => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`)
    const now = new Date()
    const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60)

    return appointment.status === "pending" && hoursDifference > 24
  }

  const getStatusStats = () => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter((apt) => apt.status === "pending").length,
      confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
      completed: appointments.filter((apt) => apt.status === "completed").length,
      cancelled: appointments.filter((apt) => apt.status === "cancelled").length,
    }
    return stats
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  const stats = getStatusStats()

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Turnos</h1>
            <p className="text-gray-600">Gestiona y revisa todos tus turnos reservados</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelados</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por servicio o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="completed">Completados</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay turnos</h3>
              <p className="text-gray-600 mb-6">
                {appointments.length === 0
                  ? "Aún no has reservado ningún turno."
                  : "No se encontraron turnos con los filtros aplicados."}
              </p>
              <Button
                onClick={() => router.push("/turnos")}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
              >
                Reservar Turno
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const StatusIcon = statusConfig[appointment.status]?.icon || AlertCircle
              return (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{appointment.serviceName}</h3>
                          <Badge className={statusConfig[appointment.status]?.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[appointment.status]?.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(appointment.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {appointment.name}
                          </div>
                        </div>

                        {appointment.servicePrice && (
                          <div className="mt-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(appointment.servicePrice)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Turno</DialogTitle>
                            </DialogHeader>
                            {selectedAppointment && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Información del Servicio</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong>Servicio:</strong> {selectedAppointment.serviceName}
                                      </p>
                                      <p>
                                        <strong>Fecha:</strong> {formatDate(selectedAppointment.date)}
                                      </p>
                                      <p>
                                        <strong>Hora:</strong> {selectedAppointment.time}
                                      </p>
                                      <p>
                                        <strong>Duración:</strong> {selectedAppointment.serviceDuration} minutos
                                      </p>
                                      <p>
                                        <strong>Precio:</strong> {formatPrice(selectedAppointment.servicePrice)}
                                      </p>
                                      <div className="flex items-center">
                                        <strong className="mr-2">Estado:</strong>
                                        <Badge className={statusConfig[selectedAppointment.status]?.color}>
                                          {statusConfig[selectedAppointment.status]?.label}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Información de Contacto</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-400" />
                                        {selectedAppointment.name}
                                      </div>
                                      <div className="flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        {selectedAppointment.phone}
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                        {selectedAppointment.address || "No especificada"}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {selectedAppointment.notes && (
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Notas</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                      {selectedAppointment.notes}
                                    </p>
                                  </div>
                                )}

                                <div className="text-xs text-gray-500">
                                  <p>
                                    Turno creado el {new Date(selectedAppointment.createdAt).toLocaleString("es-AR")}
                                  </p>
                                  {selectedAppointment.cancelledAt && (
                                    <p>
                                      Cancelado el {new Date(selectedAppointment.cancelledAt).toLocaleString("es-AR")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {canCancelAppointment(appointment) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
