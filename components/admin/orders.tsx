"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Trash2,
  ChevronDown,
  ChevronRight,
  Filter,
} from "lucide-react"
import { pedidosService } from "@/lib/firebase-services"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, filterStatus])

  const loadOrders = async () => {
    try {
      setLoading(true)
      // Cargar desde Firebase
      const ordersData = await pedidosService.getAllOrders()
      // Validar que cada order tenga total
      const validatedOrders = ordersData.map((order) => ({
        ...order,
        total: order.total || 0,
      }))
      setOrders(validatedOrders)
    } catch (error) {
      console.error("Error loading orders from Firebase:", error)
      // Fallback a localStorage
      const savedOrders = JSON.parse(localStorage.getItem("admin_orders") || "[]")
      setOrders(savedOrders)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus)
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (
    orderId: string,
    newStatus: "processing" | "shipped" | "delivered" | "cancelled",
  ) => {
    try {
      await pedidosService.updateOrderStatus(orderId, newStatus)
      await loadOrders()

      toast({
        title: "Estado actualizado",
        description: `Pedido ${newStatus === "processing" ? "en proceso" : newStatus === "shipped" ? "enviado" : newStatus === "delivered" ? "entregado" : "cancelado"}`,
      })
    } catch (error) {
      console.error("Error updating order:", error)
      // Fallback a localStorage
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order,
      )
      setOrders(updatedOrders)
      localStorage.setItem("admin_orders", JSON.stringify(updatedOrders))

      toast({
        title: "Estado actualizado",
        description: `Pedido ${newStatus === "processing" ? "en proceso" : newStatus === "shipped" ? "enviado" : newStatus === "delivered" ? "entregado" : "cancelado"}`,
      })
    }
  }

  const updateOrder = async () => {
    if (!editingOrder) return

    try {
      await pedidosService.updateOrder(editingOrder.id, editingOrder)
      await loadOrders()

      setEditingOrder(null)
      toast({
        title: "Pedido actualizado",
        description: "El pedido ha sido actualizado exitosamente",
      })
    } catch (error) {
      console.error("Error updating order:", error)
      // Fallback a localStorage
      const updatedOrders = orders.map((order) =>
        order.id === editingOrder.id ? { ...editingOrder, updatedAt: new Date().toISOString() } : order,
      )
      setOrders(updatedOrders)
      localStorage.setItem("admin_orders", JSON.stringify(updatedOrders))

      setEditingOrder(null)
      toast({
        title: "Pedido actualizado",
        description: "El pedido ha sido actualizado exitosamente",
      })
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      await pedidosService.deleteOrder(orderId)
      await loadOrders()

      toast({
        title: "Pedido eliminado",
        description: "El pedido ha sido eliminado exitosamente",
      })
    } catch (error) {
      console.error("Error deleting order:", error)
      // Fallback a localStorage
      const updatedOrders = orders.filter((order) => order.id !== orderId)
      setOrders(updatedOrders)
      localStorage.setItem("admin_orders", JSON.stringify(updatedOrders))

      toast({
        title: "Pedido eliminado",
        description: "El pedido ha sido eliminado exitosamente",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            Pendiente
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="default" className="bg-blue-500 flex items-center gap-1 text-xs">
            <Package className="w-3 h-3" />
            Procesando
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="default" className="bg-orange-500 flex items-center gap-1 text-xs">
            <Truck className="w-3 h-3" />
            Enviado
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1 text-xs">
            <CheckCircle className="w-3 h-3" />
            Entregado
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-xs">
            <XCircle className="w-3 h-3" />
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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-white/70">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Pedidos</h2>
          <p className="text-white/70">Gestión de órdenes de compra de la tienda</p>
        </div>
      </div>

      {/* Dashboard desplegable */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Dashboard de Pedidos</CardTitle>
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
                    <ShoppingCart className="h-8 w-8 text-blue-400" />
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
                      <p className="text-sm font-medium text-white/70">Entregados</p>
                      <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">Ingresos</p>
                      <p className="text-lg font-bold text-green-400">{formatPrice(stats.totalRevenue)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filtros en modal */}
      <div className="flex justify-end">
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtros de Búsqueda</DialogTitle>
              <DialogDescription>Filtra los pedidos de la tienda</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  placeholder="ID, nombre, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="processing">Procesando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de pedidos */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron pedidos con los filtros aplicados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(order.status)}
                          <Badge variant="outline" className="text-white/80 border-white/30">
                            #{order.id?.slice(-8) || "N/A"}
                          </Badge>
                          <span className="text-sm text-white/70">{formatDate(order.createdAt)}</span>
                        </div>

                        {/* Update here */}
                        <div className="grid gap-1 grid-cols-1 sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-white/70" />
                            <span className="font-medium text-white text-sm">{order.userName || "Usuario"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-white/70" />
                            <span className="font-bold text-green-400 text-sm">{formatPrice(order.total || 0)}</span>
                          </div>
                        </div>

                        <p className="text-sm text-white/70">
                          {order.items?.length || 0} producto{(order.items?.length || 0) !== 1 ? "s" : ""} •{" "}
                          {order.paymentMethod || "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Pedido #{selectedOrder?.id?.slice(-8) || "N/A"}</DialogTitle>
                              <DialogDescription>Detalles completos del pedido</DialogDescription>
                            </DialogHeader>

                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label className="text-sm font-medium">Cliente</Label>
                                    <p className="text-sm">{selectedOrder.userName || "N/A"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm">{selectedOrder.userEmail || "N/A"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Teléfono</Label>
                                    <p className="text-sm">{selectedOrder.userPhone || "N/A"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Estado</Label>
                                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Dirección de envío</Label>
                                  <p className="text-sm">{selectedOrder.shippingAddress || "N/A"}</p>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Productos</Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedOrder.items?.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                      >
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            className="w-10 h-10 object-cover rounded"
                                          />
                                          <div>
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                                          </div>
                                        </div>
                                        <p className="text-sm font-bold">
                                          {formatPrice((item.price || 0) * (item.quantity || 0))}
                                        </p>
                                      </div>
                                    )) || <p className="text-sm text-gray-500">No hay productos</p>}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                  <span className="font-medium">Total:</span>
                                  <span className="text-lg font-bold text-green-600">
                                    {formatPrice(selectedOrder.total || 0)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {order.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "processing")}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Procesar
                          </Button>
                        )}

                        {order.status === "processing" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "shipped")}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            Enviar
                          </Button>
                        )}

                        {order.status === "shipped" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Entregar
                          </Button>
                        )}

                        <Button size="sm" variant="destructive" onClick={() => deleteOrder(order.id)}>
                          <Trash2 className="h-4 w-4" />
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
