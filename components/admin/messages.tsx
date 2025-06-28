"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  Computer,
  Satellite,
  Camera,
  Globe,
  Mail,
  Phone,
  User,
} from "lucide-react"
import { mensajeService } from "@/lib/firebase-services"

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
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Sin leer
          </Badge>
        )
      case "read":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Leído
          </Badge>
        )
      case "responded":
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1">
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
      <Badge variant="outline" className={`${config.color} text-white border-0`}>
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
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>Cargando mensajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mensajes
          </h2>
          <p className="text-muted-foreground">Gestión de consultas y solicitudes de servicios</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sin leer</p>
                <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leídos</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Respondidos</p>
                <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre, email, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de servicio</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
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
              <Label>Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
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
      <Card>
        <CardHeader>
          <CardTitle>Mensajes ({filteredMessages.length})</CardTitle>
          <CardDescription>Lista de todas las consultas y solicitudes recibidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron mensajes con los filtros aplicados</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`hover:shadow-md transition-shadow ${
                    message.status === "unread" ? "border-red-200 bg-red-50" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getTypeBadge(message.serviceType)}
                          {getStatusBadge(message.status)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.createdAt).toLocaleDateString("es-AR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="grid gap-1 md:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{message.nombre}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{message.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{message.telefono}</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{message.mensaje}</p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
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
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {messageTypeConfig[message.serviceType]?.title}
                                {getTypeBadge(message.serviceType)}
                              </DialogTitle>
                              <DialogDescription>
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
                                <div className="grid gap-4 md:grid-cols-2">
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
                                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.mensaje}</p>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  {selectedMessage.status !== "responded" && (
                                    <Button
                                      onClick={() => updateMessageStatus(selectedMessage.id, "responded")}
                                      className="bg-green-500 hover:bg-green-600"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Marcar como respondido
                                    </Button>
                                  )}
                                  <Button variant="outline" asChild>
                                    <a href={`mailto:${selectedMessage.email}`}>
                                      <Mail className="h-4 w-4 mr-1" />
                                      Responder por email
                                    </a>
                                  </Button>
                                  <Button variant="outline" asChild>
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

                        {message.status === "read" && (
                          <Button
                            size="sm"
                            onClick={() => updateMessageStatus(message.id, "responded")}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Respondido
                          </Button>
                        )}
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
