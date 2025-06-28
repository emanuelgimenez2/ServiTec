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
          <Badge variant="destructive" className="flex items-center gap-1 bg-red-500/20 text-red-400 border-red-400/30">
            <AlertCircle className="w-3 h-3" />
            Sin leer
          </Badge>
        )
      case "read":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
          >
            <Eye className="w-3 h-3" />
            Leído
          </Badge>
        )
      case "responded":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-400/30 flex items-center gap-1">
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
      <div className="space-y-6 min-h-[800px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando mensajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 min-h-[800px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Centro de Mensajes
          </h2>
          <p className="text-gray-300 text-lg mt-2">Gestión de consultas y solicitudes de servicios</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-md rounded-3xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-200">Total</p>
              <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 backdrop-blur-md rounded-3xl p-6 border border-red-400/30 hover:border-red-400/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-200">Sin leer</p>
              <p className="text-3xl font-bold text-red-400">{stats.unread}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md rounded-3xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-200">Leídos</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.read}</p>
            </div>
            <Eye className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md rounded-3xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-200">Respondidos</p>
              <p className="text-3xl font-bold text-green-400">{stats.responded}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gradient-to-br from-gray-500/10 to-slate-600/10 backdrop-blur-md rounded-3xl p-8 border border-gray-400/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gray-500/20 p-3 rounded-2xl">
            <Filter className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-300">Filtros y Búsqueda</h3>
            <p className="text-gray-400 text-sm">Encuentra mensajes específicos</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-gray-300">
              Buscar
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Nombre, email, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Tipo de servicio</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
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
            <Label className="text-gray-300">Estado</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="unread">Sin leer</SelectItem>
                <SelectItem value="read">Leído</SelectItem>
                <SelectItem value="responded">Respondido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Lista de mensajes */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 backdrop-blur-md rounded-3xl p-8 border border-indigo-400/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-500/20 p-3 rounded-2xl">
            <MessageSquare className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-400">Mensajes ({filteredMessages.length})</h3>
            <p className="text-indigo-200 text-sm">Lista de todas las consultas y solicitudes recibidas</p>
          </div>
        </div>
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <MessageSquare className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-xl mb-2">No se encontraron mensajes</p>
              <p>No hay mensajes que coincidan con los filtros aplicados</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 ${
                  message.status === "unread" ? "border-red-400/50 bg-red-500/5" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTypeBadge(message.serviceType)}
                      {getStatusBadge(message.status)}
                      <span className="text-sm text-gray-400">
                        {new Date(message.createdAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-white">{message.nombre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{message.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{message.telefono}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 line-clamp-2">{message.mensaje}</p>
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
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-white">
                            {messageTypeConfig[message.serviceType]?.title}
                            {getTypeBadge(message.serviceType)}
                          </DialogTitle>
                          <DialogDescription className="text-gray-400">
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
                                <Label className="text-sm font-medium text-gray-300">Nombre completo</Label>
                                <p className="text-sm text-white">{selectedMessage.nombre}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-300">Email</Label>
                                <p className="text-sm text-white">{selectedMessage.email}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-300">Teléfono</Label>
                                <p className="text-sm text-white">{selectedMessage.telefono}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-300">Estado</Label>
                                <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-300">Mensaje</Label>
                              <div className="mt-1 p-4 bg-gray-800 rounded-xl">
                                <p className="text-sm whitespace-pre-wrap text-white">{selectedMessage.mensaje}</p>
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
                              <Button
                                variant="outline"
                                asChild
                                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                              >
                                <a href={`mailto:${selectedMessage.email}`}>
                                  <Mail className="h-4 w-4 mr-1" />
                                  Responder por email
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                asChild
                                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                              >
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
