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
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/auth")
        return
      }

      try {
        const userData = await getUserDocument(firebaseUser.uid)
        if (userData) {
          setUser(userData)
          console.log("Usuario cargado:", userData)
          await loadAppointments(userData.id)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
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
          apt.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date)
      const dateB = new Date(b.createdAt || b.date)
      return dateB.getTime() - dateA.getTime()
    })

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter])

  const loadAppointments = async (userId: string) => {
    try {
      console.log("Cargando turnos para usuario:", userId)
      const userAppointments = await turnosService.getUserAppointments(userId)
      console.log("Turnos obtenidos:", userAppointments)
      setAppointments(userAppointments || [])
    } catch (error) {
      console.error("Error loading appointments:", error)
      setAppointments([])
      toast({
        title: "Error",
        description: "No se pudieron cargar los turnos",
        variant: "destructive",
      })
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await turnosService.cancelAppointment(appointmentId)
      if (user) {
        await loadAppointments(user.id)
      }

      toast({
        title: "Turno cancelado",
        description: "Tu turno ha sido cancelado correctamente.",
      })
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al cancelar tu turno.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Consultar"
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const canCancelAppointment = (appointment: any) => {
    if (!appointment.date || !appointment.time) return false

    try {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`)
      const now = new Date()
      const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

      return appointment.status === "pending" && hoursDifference > 24
    } catch (error) {
      return false
    }
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header - Más compacto en móvil */}
        <div className="mb-6 sm:mb-8">
          {/* Botón volver y título en móvil */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10 p-2 sm:p-3 h-8 sm:h-10"
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Volver</span>
            </Button>

            <Button
              onClick={() => router.push("/turnos")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
            >
              <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Nuevo Turno</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>

          {/* Título y descripción */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Mis Turnos</h1>
            <p className="text-white/70 text-sm sm:text-base">Gestiona y revisa todos tus turnos reservados</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs sm:text-sm text-white/70">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-xs sm:text-sm text-white/70">Pendientes</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.confirmed}</div>
              <div className="text-xs sm:text-sm text-white/70">Confirmados</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-xs sm:text-sm text-white/70">Completados</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.cancelled}</div>
              <div className="text-xs sm:text-sm text-white/70">Cancelados</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-4 sm:mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-3 h-3 sm:w-4 sm:h-4" />
                  <Input
                    placeholder="Buscar por servicio o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 sm:pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-9 sm:h-10 text-sm"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-9 sm:h-10 text-sm">
                    <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
            <CardContent className="p-8 sm:p-12 text-center">
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No hay turnos</h3>
              <p className="text-white/70 mb-6 text-sm sm:text-base">
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
          <div className="space-y-3 sm:space-y-4">
            {filteredAppointments.map((appointment) => {
              const StatusIcon = statusConfig[appointment.status]?.icon || AlertCircle
              return (
                <Card
                  key={appointment.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-white mr-3">
                            {appointment.serviceName}
                          </h3>
                          <Badge className={statusConfig[appointment.status]?.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[appointment.status]?.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-white/70">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="truncate">{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="truncate">{appointment.name}</span>
                          </div>
                        </div>

                        {appointment.servicePrice && appointment.servicePrice > 0 && (
                          <div className="mt-2">
                            <span className="text-base sm:text-lg font-bold text-green-400">
                              {formatPrice(appointment.servicePrice)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mt-3 md:mt-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAppointment(appointment)}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Ver Detalles</span>
                              <span className="sm:hidden">Ver</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 mx-4 sm:mx-0">
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
                                      {selectedAppointment.serviceDuration &&
                                        selectedAppointment.serviceDuration > 0 && (
                                          <p className="text-white/80">
                                            <strong>Duración:</strong> {selectedAppointment.serviceDuration} minutos
                                          </p>
                                        )}
                                      {selectedAppointment.servicePrice && selectedAppointment.servicePrice > 0 && (
                                        <p className="text-white/80">
                                          <strong>Precio:</strong> {formatPrice(selectedAppointment.servicePrice)}
                                        </p>
                                      )}
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
                                      {selectedAppointment.address && (
                                        <div className="flex items-center text-white/80">
                                          <MapPin className="w-4 h-4 mr-2 text-white/50" />
                                          {selectedAppointment.address}
                                        </div>
                                      )}
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
                                    Turno creado el{" "}
                                    {selectedAppointment.createdAt
                                      ? new Date(selectedAppointment.createdAt).toLocaleString("es-AR")
                                      : "Fecha no disponible"}
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
                            className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8"
                          >
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Cancelar</span>
                            <span className="sm:hidden">X</span>
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
