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
  Plus,
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
    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    icon: Hourglass,
  },
  confirmed: {
    label: "Confirmado",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: CheckCircle,
  },
  completed: {
    label: "Completado",
    color: "bg-green-500/20 text-green-300 border-green-500/30",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-500/20 text-red-300 border-red-500/30",
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
  const [loading, setLoading] = useState(true)
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
      setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando turnos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 text-center bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="space-y-4">
                <Calendar className="h-16 w-16 mx-auto text-white/70" />
                <h2 className="text-2xl font-bold text-white">Inicia sesión para ver tus turnos</h2>
                <p className="text-white/70">Necesitas estar autenticado para acceder a tus turnos</p>
                <Button
                  onClick={() => router.push("/auth")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Iniciar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const stats = getStatusStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Mis Turnos</h1>
              <p className="text-white/70">Gestiona y revisa todos tus turnos reservados</p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/turnos")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Turno
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-white/70">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-white/70">Pendientes</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.confirmed}</div>
              <div className="text-sm text-white/70">Confirmados</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-white/70">Completados</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.cancelled}</div>
              <div className="text-sm text-white/70">Cancelados</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    placeholder="Buscar por servicio o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No hay turnos</h3>
              <p className="text-white/70 mb-6">
                {appointments.length === 0
                  ? "Aún no has reservado ningún turno."
                  : "No se encontraron turnos con los filtros aplicados."}
              </p>
              <Button
                onClick={() => router.push("/turnos")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
                <Card
                  key={appointment.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-white mr-3">{appointment.serviceName}</h3>
                          <Badge className={statusConfig[appointment.status]?.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[appointment.status]?.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
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
                            <span className="text-lg font-bold text-green-400">
                              {formatPrice(appointment.servicePrice)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAppointment(appointment)}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Detalles del Turno</DialogTitle>
                            </DialogHeader>
                            {selectedAppointment && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold text-white mb-3">Información del Servicio</h4>
                                    <div className="space-y-2 text-sm">
                                      <p className="text-white/80">
                                        <strong>Servicio:</strong> {selectedAppointment.serviceName}
                                      </p>
                                      <p className="text-white/80">
                                        <strong>Fecha:</strong> {formatDate(selectedAppointment.date)}
                                      </p>
                                      <p className="text-white/80">
                                        <strong>Hora:</strong> {selectedAppointment.time}
                                      </p>
                                      <p className="text-white/80">
                                        <strong>Duración:</strong> {selectedAppointment.serviceDuration} minutos
                                      </p>
                                      <p className="text-white/80">
                                        <strong>Precio:</strong> {formatPrice(selectedAppointment.servicePrice)}
                                      </p>
                                      <div className="flex items-center">
                                        <strong className="mr-2 text-white/80">Estado:</strong>
                                        <Badge className={statusConfig[selectedAppointment.status]?.color}>
                                          {statusConfig[selectedAppointment.status]?.label}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-white mb-3">Información de Contacto</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center text-white/80">
                                        <User className="w-4 h-4 mr-2 text-white/50" />
                                        {selectedAppointment.name}
                                      </div>
                                      <div className="flex items-center text-white/80">
                                        <Phone className="w-4 h-4 mr-2 text-white/50" />
                                        {selectedAppointment.phone}
                                      </div>
                                      <div className="flex items-center text-white/80">
                                        <MapPin className="w-4 h-4 mr-2 text-white/50" />
                                        {selectedAppointment.address || "No especificada"}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {selectedAppointment.notes && (
                                  <div>
                                    <h4 className="font-semibold text-white mb-2">Notas</h4>
                                    <p className="text-sm text-white/80 bg-white/5 p-3 rounded border border-white/10">
                                      {selectedAppointment.notes}
                                    </p>
                                  </div>
                                )}

                                <div className="text-xs text-white/50">
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
                            className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
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
