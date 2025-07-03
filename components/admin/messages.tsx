"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Computer,
  Satellite,
  Camera,
  Globe,
  Mail,
  Phone,
  User,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react"
import { mensajeService } from "@/lib/firebase-services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  id: string
  serviceType: "reparacion" | "starlink" | "camaras" | "desarrollo" | "contacto"
  nombre: string
  email: string
  telefono: string
  mensaje: string
  status: "unread" | "read" | "responded"
  createdAt: string
}

const messageTypeConfig = {
  reparacion: {
    label: "Reparación PC",
    icon: Computer,
    color: "bg-blue-500",
    title: "Solicitud de Diagnóstico",
  },
  starlink: {
    label: "Starlink",
    icon: Satellite,
    color: "bg-green-500",
    title: "Evaluación del Sitio",
  },
  camaras: {
    label: "Cámaras",
    icon: Camera,
    color: "bg-purple-500",
    title: "Evaluación Gratuita",
  },
  desarrollo: {
    label: "Desarrollo Web",
    icon: Globe,
    color: "bg-orange-500",
    title: "Solicitud de Cotización",
  },
  contacto: {
    label: "Contacto",
    icon: Mail,
    color: "bg-gray-500",
    title: "Mensaje General",
  },
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, filterType, filterStatus])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const messagesData = await mensajeService.getMessages()
      setMessages(messagesData)
    } catch (error) {
      console.error("Error loading messages:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = messages

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.telefono?.includes(searchTerm) ||
          message.mensaje?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por tipo
    if (filterType !== "all") {
      filtered = filtered.filter((message) => message.serviceType === filterType)
    }

    // Filtrar por estado
    if (filterStatus !== "all") {
      filtered = filtered.filter((message) => message.status === filterStatus)
    }

    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredMessages(filtered)
  }

  const updateMessageStatus = async (messageId: string, newStatus: "read" | "responded") => {
    try {
      await mensajeService.updateMessageStatus(messageId, newStatus)
      await loadMessages() // Recargar datos

      toast({
        title: "Estado actualizado",
        description: `Mensaje marcado como ${newStatus === "read" ? "leído" : "respondido"}`,
      })
    } catch (error) {
      console.error("Error updating message:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del mensaje",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-xs">
            <AlertCircle className="w-3 h-3" />
            Sin leer
          </Badge>
        )
      case "read":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Eye className="w-3 h-3" />
            Leído
          </Badge>
        )
      case "responded":
        return (
          <Badge className="bg-green-500 flex items-center gap-1 text-xs">
            <CheckCircle className="w-3 h-3" />
            Respondido
          </Badge>
        )
      default:
        return null
    }
  }

  const getTypeBadge = (type: keyof typeof messageTypeConfig) => {
    const config = messageTypeConfig[type]
    if (!config) return null

    const IconComponent = config.icon

    return (
      <Badge variant="outline" className={`${config.color} text-white border-0 text-xs`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const stats = {
    total: messages.length,
    unread: messages.filter((m) => m.status === "unread").length,
    read: messages.filter((m) => m.status === "read").length,
    responded: messages.filter((m) => m.status === "responded").length,
  }

  if (loading) {
    return (
      <div className="space-y-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm">Cargando mensajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 min-h-[400px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Centro de Mensajes</h2>
          <p className="text-white/70 text-lg mt-2">Gestión de consultas y solicitudes de servicios</p>
        </div>
      </div>

      {/* Dashboard desplegable */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Dashboard de Mensajes</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setShowDashboard(!showDashboard)}
              className="text-white hover:bg-white/10"
            >
              {showDashboard ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showDashboard && (
          <CardContent>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">Total</p>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">Sin leer</p>
                      <p className="text-2xl font-bold text-red-400">{stats.unread}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">Leídos</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.read}</p>
                    </div>
                    <Eye className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">Respondidos</p>
                      <p className="text-2xl font-bold text-green-400">{stats.responded}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filtros */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-white">
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
              <Label className="text-white">Tipo de servicio</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="reparacion">Reparación PC</SelectItem>
                  <SelectItem value="starlink">Starlink</SelectItem>
                  <SelectItem value="camaras">Cámaras</SelectItem>
                  <SelectItem value="desarrollo">Desarrollo Web</SelectItem>
                  <SelectItem value="contacto">Contacto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="unread">Sin leer</SelectItem>
                  <SelectItem value="read">Leído</SelectItem>
                  <SelectItem value="responded">Respondido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de mensajes */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Mensajes ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-16 text-white/70">
              <MessageSquare className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-xl mb-2">No se encontraron mensajes</p>
              <p>No hay mensajes que coincidan con los filtros aplicados</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 ${
                    message.status === "unread" ? "border-red-400/50 bg-red-500/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col gap-2">
                        {getTypeBadge(message.serviceType)}
                        {getStatusBadge(message.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-white/70" />
                          <span className="font-medium text-white text-sm truncate">{message.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-white/70" />
                          <span className="text-sm text-white/80 truncate">{message.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-white/70" />
                          <span className="text-sm text-white/80">{message.telefono}</span>
                        </div>
                      </div>

                      <p className="text-sm text-white/70 line-clamp-2">{message.mensaje}</p>

                      <div className="text-xs text-white/70">
                        {new Date(message.createdAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMessage(message)
                              if (message.status === "unread") {
                                updateMessageStatus(message.id, "read")
                              }
                            }}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
                          >
                            <Eye className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">Ver</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-white">
                              {messageTypeConfig[message.serviceType]?.title}
                              {getTypeBadge(message.serviceType)}
                            </DialogTitle>
                            <DialogDescription className="text-white/70">
                              Recibido el{" "}
                              {new Date(message.createdAt).toLocaleDateString("es-AR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="grid gap-4 grid-cols-1">
                                <div>
                                  <Label className="text-sm font-medium">Nombre completo</Label>
                                  <p className="text-sm">{selectedMessage.nombre}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Email</Label>
                                  <p className="text-sm">{selectedMessage.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Teléfono</Label>
                                  <p className="text-sm">{selectedMessage.telefono}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Estado</Label>
                                  <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Mensaje</Label>
                                <div className="mt-1 p-4 bg-gray-50 rounded-xl">
                                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.mensaje}</p>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 pt-4">
                                {selectedMessage.status !== "responded" && (
                                  <Button
                                    onClick={() => updateMessageStatus(selectedMessage.id, "responded")}
                                    className="bg-green-500 hover:bg-green-600 w-full"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Marcar como respondido
                                  </Button>
                                )}
                                <Button variant="outline" asChild className="w-full bg-transparent">
                                  <a href={`mailto:${selectedMessage.email}`}>
                                    <Mail className="h-4 w-4 mr-1" />
                                    Responder por email
                                  </a>
                                </Button>
                                <Button variant="outline" asChild className="w-full bg-transparent">
                                  <a href={`tel:${selectedMessage.telefono}`}>
                                    <Phone className="h-4 w-4 mr-1" />
                                    Llamar
                                  </a>
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
