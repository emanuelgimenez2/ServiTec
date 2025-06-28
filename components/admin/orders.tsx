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
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock, DollarSign, User } from "lucide-react"

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
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, filterStatus])

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("admin_orders") || "[]")
    setOrders(savedOrders)
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus)
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setFilteredOrders(filtered)
  }

  const updateOrderStatus = (orderId: string, newStatus: "processing" | "shipped" | "delivered" | "cancelled") => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pendiente
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="default" className="bg-blue-500 flex items-center gap-1">
            <Package className="w-3 h-3" />
            Procesando
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="default" className="bg-orange-500 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Enviado
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Entregado
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
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pedidos
          </h2>
          <p className="text-muted-foreground">Gestión de órdenes de compra de la tienda</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Procesando</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enviados</p>
                <p className="text-2xl font-bold text-orange-600">{stats.shipped}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entregados</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
                <p className="text-xl font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Lista de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron pedidos con los filtros aplicados</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(order.status)}
                          <Badge variant="outline">#{order.id.slice(-8)}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("es-AR")}
                          </span>
                        </div>

                        <div className="grid gap-1 md:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.userName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-bold text-green-600">${order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {order.items.length} producto{order.items.length !== 1 ? "s" : ""} • {order.paymentMethod}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Pedido #{selectedOrder?.id.slice(-8)}</DialogTitle>
                              <DialogDescription>Detalles completos del pedido</DialogDescription>
                            </DialogHeader>

                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label className="text-sm font-medium">Cliente</Label>
                                    <p className="text-sm">{selectedOrder.userName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm">{selectedOrder.userEmail}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Teléfono</Label>
                                    <p className="text-sm">{selectedOrder.userPhone}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Estado</Label>
                                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Dirección de envío</Label>
                                  <p className="text-sm">{selectedOrder.shippingAddress}</p>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Productos</Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedOrder.items.map((item) => (
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
                                          ${(item.price * item.quantity).toLocaleString()}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                  <span className="font-medium">Total:</span>
                                  <span className="text-lg font-bold text-green-600">
                                    ${selectedOrder.total.toLocaleString()}
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
                            <Package className="h-4 w-4 mr-1" />
                            Procesar
                          </Button>
                        )}

                        {order.status === "processing" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "shipped")}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Enviar
                          </Button>
                        )}

                        {order.status === "shipped" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Entregar
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
