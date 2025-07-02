"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Filter,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { turnosService } from "@/lib/firebase-services"

interface Appointment {
  id: string
  userId: string
  name: string
  phone: string
  email: string
  address: string
  serviceName: string
  servicePrice: number
  serviceDuration: number
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes: string
  createdAt: string
}

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
}

const statusLabels = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Completado",
}

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showDashboard, setShowDashboard] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, statusFilter, dateFilter])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const data = await turnosService.getAllAppointments()
      setAppointments(data)
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los turnos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.phone.includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter)
    }

    if (dateFilter) {
      filtered = filtered.filter((appointment) => appointment.date === dateFilter)
    }

    setFilteredAppointments(filtered)
  }

  const handleStatusChange = async (appointmentId: string, newStatus: "confirmed" | "cancelled") => {
    try {
      await turnosService.updateAppointmentStatus(appointmentId, newStatus)
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
        ),
      )
      setEditingAppointment(null)
      toast({
        title: "Estado actualizado",
        description: `El turno ha sido ${newStatus === "confirmed" ? "confirmado" : "cancelado"}`,
      })
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del turno",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailModal(true)
  }

  const getStatusStats = () => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    }
    return stats
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-8 bg-white/10 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con toggle dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Turnos</h2>
          <p className="text-white/70">Administra las citas y turnos de los clientes</p>
        </div>
        <Button
          onClick={() => setShowDashboard(!showDashboard)}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {showDashboard ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
          {showDashboard ? "Ocultar" : "Mostrar"} Dashboard
        </Button>
      </div>

      {/* Dashboard desplegable - fondo original */}
      {showDashboard && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Turnos</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Pendientes</p>
                  <p className="text-3xl font-bold text-white">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Confirmados</p>
                  <p className="text-3xl font-bold text-white">{stats.confirmed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Completados</p>
                  <p className="text-3xl font-bold text-white">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Filtros</CardTitle>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="pt-0">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-white/90">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Nombre, servicio o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/90">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/90">Fecha</Label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setDateFilter("")
                  }}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Lista de turnos en recuadros */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {filteredAppointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all"
          >
            {/* Estado centrado arriba en móvil */}
            <div className="p-3 pb-0 lg:hidden">
              <div className="flex justify-center">
                <Badge className={`text-xs ${statusColors[appointment.status]}`}>
                  {statusLabels[appointment.status]}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3 pt-3 lg:pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-white/70" />
                  <span className="text-white font-medium text-sm truncate">{appointment.name}</span>
                </div>
                {/* Estado en desktop */}
                <div className="hidden lg:block">
                  <Badge className={`text-xs ${statusColors[appointment.status]}`}>
                    {statusLabels[appointment.status]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(appointment.date).toLocaleDateString("es-AR")}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="h-3 w-3" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Phone className="h-3 w-3" />
                  <span className="truncate">{appointment.phone}</span>
                </div>
                <div className="text-white/80 font-medium truncate">{appointment.serviceName}</div>
              </div>

              {editingAppointment === appointment.id ? (
                <div className="space-y-2">
                  <Button
                    onClick={() => handleStatusChange(appointment.id, "confirmed")}
                    className="w-full bg-green-600 hover:bg-green-700 text-xs py-1.5"
                    size="sm"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirmar
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(appointment.id, "cancelled")}
                    className="w-full bg-red-600 hover:bg-red-700 text-xs py-1.5"
                    size="sm"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => setEditingAppointment(null)}
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs py-1.5"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleViewDetails(appointment)}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs py-1.5"
                  >
                    <Eye className="h-3 w-3" />
                    <span className="ml-1 hidden lg:inline">Ver</span>
                  </Button>
                  <Button
                    onClick={() => setEditingAppointment(appointment.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs py-1.5"
                  >
                    <Edit className="h-3 w-3" />
                    <span className="ml-1 hidden lg:inline">Editar</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h2 className="text-2xl font-bold text-white mb-2">No hay turnos</h2>
            <p className="text-white/70">No se encontraron turnos con los filtros aplicados</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles - más angosto */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Detalles del Turno</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-white/70" />
                  <span className="text-white font-medium">{selectedAppointment.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white/70" />
                  <span className="text-white/80">{selectedAppointment.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/70" />
                  <span className="text-white/80">
                    {new Date(selectedAppointment.date).toLocaleDateString("es-AR")} - {selectedAppointment.time}
                  </span>
                </div>
                {selectedAppointment.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-white/70" />
                    <span className="text-white/80">{selectedAppointment.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge className={`${statusColors[selectedAppointment.status]}`}>
                    {statusLabels[selectedAppointment.status]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium">Servicio</h4>
                <p className="text-white/80">{selectedAppointment.serviceName}</p>
              </div>

              {selectedAppointment.notes && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notas
                  </h4>
                  <p className="text-white/80 text-sm bg-white/5 p-3 rounded-lg">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="text-xs text-white/50">
                Creado: {new Date(selectedAppointment.createdAt).toLocaleString("es-AR")}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
