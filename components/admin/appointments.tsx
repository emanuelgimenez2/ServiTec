"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Edit, Eye, MapPin, DollarSign } from "lucide-react"
import { turnosService } from "@/lib/firebase-services"

interface Appointment {
  id: string
  userId: string
  name: string
  phone: string
  serviceName: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  address?: string
  servicePrice?: number
  serviceDuration?: number
  createdAt: string
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterService, setFilterService] = useState<string>("all")
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, filterStatus, filterService])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const appointmentsData = await turnosService.getAllAppointments()
      setAppointments(appointmentsData)
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
          appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.phone?.includes(searchTerm) ||
          appointment.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === filterStatus)
    }

    if (filterService !== "all") {
      filtered = filtered.filter((appointment) => appointment.serviceName === filterService)
    }

    filtered.sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime())
    setFilteredAppointments(filtered)
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: "confirmed" | "completed" | "cancelled") => {
    try {
      await turnosService.updateAppointmentStatus(appointmentId, newStatus)
      await loadAppointments()

      toast({
        title: "Estado actualizado",
        description: `Turno ${newStatus === "confirmed" ? "confirmado" : newStatus === "completed" ? "completado" : "cancelado"}`,
      })
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del turno",
        variant: "destructive",
      })
    }
  }

  const updateAppointment = async () => {
    if (!editingAppointment) return

    try {
      await turnosService.updateAppointment(editingAppointment.id, editingAppointment)
      await loadAppointments()

      setEditingAppointment(null)
      toast({
        title: "Turno actualizado",
        description: "El turno ha sido actualizado exitosamente",
      })
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el turno",
        variant: "destructive",
      })
    }
  }

  const deleteAppointment = async (appointmentId: string) => {
    try {
      await turnosService.deleteAppointment(appointmentId)
      await loadAppointments()

      toast({
        title: "Turno eliminado",
        description: "El turno ha sido eliminado exitosamente",
      })
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el turno",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Clock className="w-2 h-2" />
            Pendiente
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="default" className="bg-blue-500 flex items-center gap-1 text-xs">
            <CheckCircle className="w-2 h-2" />
            Confirmado
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1 text-xs">
            <CheckCircle className="w-2 h-2" />
            Completado
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-xs">
            <XCircle className="w-2 h-2" />
            Cancelado
          </Badge>
        )
      default:
        return null
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-white/70">Cargando turnos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Turnos</h2>
          <p className="text-white/70">Gestión de citas y turnos programados</p>
        </div>
      </div>

      {/* Estadísticas - Responsive */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Total</p>
                <p className="text-lg lg:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Pendientes</p>
                <p className="text-lg lg:text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Confirmados</p>
                <p className="text-lg lg:text-2xl font-bold text-blue-400">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Completados</p>
                <p className="text-lg lg:text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Cancelados</p>
                <p className="text-lg lg:text-2xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
              <XCircle className="h-6 w-6 lg:h-8 lg:w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-white/90">
                Buscar
              </Label>
              <Input
                id="search"
                placeholder="Nombre, teléfono, servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Servicio</Label>
              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Todos los servicios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los servicios</SelectItem>
                  <SelectItem value="Reparación de PC">Reparación de PC</SelectItem>
                  <SelectItem value="Instalación Starlink">Instalación Starlink</SelectItem>
                  <SelectItem value="Cámaras de Seguridad">Cámaras de Seguridad</SelectItem>
                  <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de turnos */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Turnos Programados ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron turnos con los filtros aplicados</p>
            </div>
          ) : isMobile ? (
            // Vista móvil - Cards compactas en 2 columnas
            <div className="grid gap-3 grid-cols-2">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white text-xs line-clamp-1">{appointment.name}</h3>
                          <p className="text-white/70 text-xs line-clamp-1">{appointment.serviceName}</p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center text-white/80">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(appointment.date).toLocaleDateString("es-AR")}
                        </div>
                        <div className="flex items-center text-white/80">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center text-white/80">
                          <Phone className="w-3 h-3 mr-1" />
                          <span className="line-clamp-1">{appointment.phone}</span>
                        </div>
                        {appointment.servicePrice && (
                          <div className="flex items-center text-green-400">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span className="text-xs">{formatPrice(appointment.servicePrice)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs p-1"
                              onClick={() => setSelectedAppointment(appointment)}
                            >
                              <Eye className="h-3 w-3" />
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
                                    <h4 className="font-semibold mb-3">Información del Servicio</h4>
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
                                      {selectedAppointment.serviceDuration && (
                                        <p>
                                          <strong>Duración:</strong> {selectedAppointment.serviceDuration} minutos
                                        </p>
                                      )}
                                      {selectedAppointment.servicePrice && (
                                        <p>
                                          <strong>Precio:</strong> {formatPrice(selectedAppointment.servicePrice)}
                                        </p>
                                      )}
                                      <div className="flex items-center">
                                        <strong className="mr-2">Estado:</strong>
                                        {getStatusBadge(selectedAppointment.status)}
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-3">Información de Contacto</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-400" />
                                        {selectedAppointment.name}
                                      </div>
                                      <div className="flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        {selectedAppointment.phone}
                                      </div>
                                      {selectedAppointment.address && (
                                        <div className="flex items-center">
                                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                          {selectedAppointment.address}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {selectedAppointment.notes && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Notas</h4>
                                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedAppointment.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {appointment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                              className="bg-blue-500 hover:bg-blue-600 text-xs p-1"
                            >
                              ✓
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                              className="text-xs p-1"
                            >
                              ✗
                            </Button>
                          </>
                        )}

                        {appointment.status === "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            className="bg-green-500 hover:bg-green-600 text-xs p-1"
                          >
                            ✓
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Vista desktop - Lista completa
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          {getStatusBadge(appointment.status)}
                          <Badge variant="outline" className="text-white/80 border-white/30">
                            {appointment.serviceName}
                          </Badge>
                          <span className="text-sm text-white/70">
                            {formatDate(appointment.date)} - {appointment.time}
                          </span>
                        </div>

                        <div className="grid gap-2 md:grid-cols-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-white/70" />
                            <span className="font-medium text-white">{appointment.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-white/70" />
                            <span className="text-sm text-white/80">{appointment.phone}</span>
                          </div>
                          {appointment.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-white/70" />
                              <span className="text-sm text-white/80">{appointment.address}</span>
                            </div>
                          )}
                          {appointment.servicePrice && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              <span className="text-sm font-bold text-green-400">
                                {formatPrice(appointment.servicePrice)}
                              </span>
                            </div>
                          )}
                        </div>

                        {appointment.notes && (
                          <p className="text-sm text-white/70">
                            <strong>Notas:</strong> {appointment.notes}
                          </p>
                        )}

                        {appointment.serviceDuration && (
                          <p className="text-sm text-white/70">
                            <strong>Duración:</strong> {appointment.serviceDuration} minutos
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              onClick={() => setEditingAppointment(appointment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Turno</DialogTitle>
                              <DialogDescription>Modifica la información del turno</DialogDescription>
                            </DialogHeader>
                            {editingAppointment && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label>Nombre</Label>
                                    <Input
                                      value={editingAppointment.name}
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, name: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Teléfono</Label>
                                    <Input
                                      value={editingAppointment.phone}
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, phone: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label>Servicio</Label>
                                    <Select
                                      value={editingAppointment.serviceName}
                                      onValueChange={(value) =>
                                        setEditingAppointment({ ...editingAppointment, serviceName: value })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Reparación de PC">Reparación de PC</SelectItem>
                                        <SelectItem value="Instalación Starlink">Instalación Starlink</SelectItem>
                                        <SelectItem value="Cámaras de Seguridad">Cámaras de Seguridad</SelectItem>
                                        <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Dirección</Label>
                                    <Input
                                      value={editingAppointment.address || ""}
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, address: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                  <div className="space-y-2">
                                    <Label>Fecha</Label>
                                    <Input
                                      type="date"
                                      value={editingAppointment.date}
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, date: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Hora</Label>
                                    <Input
                                      type="time"
                                      value={editingAppointment.time}
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, time: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Precio</Label>
                                    <Input
                                      type="number"
                                      value={editingAppointment.servicePrice || ""}
                                      onChange={(e) =>
                                        setEditingAppointment({
                                          ...editingAppointment,
                                          servicePrice: Number(e.target.value),
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Notas</Label>
                                  <Textarea
                                    value={editingAppointment.notes || ""}
                                    onChange={(e) =>
                                      setEditingAppointment({ ...editingAppointment, notes: e.target.value })
                                    }
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                                    Cancelar
                                  </Button>
                                  <Button onClick={updateAppointment}>Actualizar</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {appointment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}

                        {appointment.status === "confirmed" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}

                        <Button size="sm" variant="destructive" onClick={() => deleteAppointment(appointment.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
