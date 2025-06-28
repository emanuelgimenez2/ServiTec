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
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, Edit } from "lucide-react"
import { turnosService } from "@/lib/firebase-services"

interface Appointment {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  service: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  createdAt: string
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterService, setFilterService] = useState<string>("all")
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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
          appointment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.userPhone?.includes(searchTerm),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === filterStatus)
    }

    if (filterService !== "all") {
      filtered = filtered.filter((appointment) => appointment.service === filterService)
    }

    filtered.sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime())
    setFilteredAppointments(filtered)
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: "confirmed" | "completed" | "cancelled") => {
    try {
      await turnosService.updateAppointmentStatus(appointmentId, newStatus)
      await loadAppointments() // Recargar datos

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
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pendiente
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="default" className="bg-blue-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Confirmado
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completado
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelado
          </Badge>
        )
      default:
        return null
    }
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

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Confirmados</p>
                <p className="text-2xl font-bold text-blue-400">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Completados</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Cancelados</p>
                <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
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
                placeholder="Nombre, email, teléfono..."
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
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron turnos con los filtros aplicados</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(appointment.status)}
                          <Badge variant="outline" className="text-white/80 border-white/30">
                            {appointment.service}
                          </Badge>
                          <span className="text-sm text-white/70">
                            {new Date(appointment.date).toLocaleDateString("es-AR")} - {appointment.time}
                          </span>
                        </div>

                        <div className="grid gap-1 md:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-white/70" />
                            <span className="font-medium text-white">{appointment.userName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-white/70" />
                            <span className="text-sm text-white/80">{appointment.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-white/70" />
                            <span className="text-sm text-white/80">{appointment.userPhone}</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <p className="text-sm text-white/70">
                            <strong>Notas:</strong> {appointment.notes}
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
                                      value={editingAppointment.userName}
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, userName: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                      value={editingAppointment.userEmail}
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, userEmail: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label>Teléfono</Label>
                                    <Input
                                      value={editingAppointment.userPhone}
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, userPhone: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Servicio</Label>
                                    <Select
                                      value={editingAppointment.service}
                                      onValueChange={(value) =>
                                        setEditingAppointment({ ...editingAppointment, service: value })
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
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
