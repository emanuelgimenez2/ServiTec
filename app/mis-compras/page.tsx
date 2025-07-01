"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Package, Calendar, DollarSign, MapPin, Eye, ShoppingBag } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { pedidosService } from "@/lib/firebase-services"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function MisComprasPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth")
        return
      }
      setUser(currentUser)
      loadUserOrders(currentUser.uid)
    })

    return () => unsubscribe()
  }, [router])

  const loadUserOrders = async (userId) => {
    try {
      setLoading(true)
      console.log("📦 Cargando pedidos para usuario:", userId)

      const userOrders = await pedidosService.getUserOrders(userId)

      console.log("✅ Pedidos cargados:", userOrders.length)
      setOrders(userOrders)
    } catch (error) {
      console.error("Error loading orders:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar tus compras",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "processing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "shipped":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "delivered":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      default:
        return "Desconocido"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando tus compras...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10 p-2 sm:px-3 sm:py-2"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-white">Mis Compras</h1>
              <p className="text-white/70 text-sm sm:text-base">Historial de todos tus pedidos</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Card className="p-4 sm:p-8 text-center bg-white/10 backdrop-blur-md border-white/20 max-w-md mx-auto">
              <CardContent className="space-y-3 sm:space-y-4">
                <Package className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-white/70" />
                <h2 className="text-lg sm:text-2xl font-bold text-white">No tienes compras aún</h2>
                <p className="text-white/70 text-sm sm:text-base">
                  ¡Explora nuestra tienda y realiza tu primera compra!
                </p>
                <Button
                  onClick={() => router.push("/tienda")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Ir a la Tienda
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-2 sm:pb-4 p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <Package className="h-4 w-4 sm:h-6 sm:w-6 text-white/70" />
                      <div>
                        <CardTitle className="text-white text-sm sm:text-base">Pedido #{order.id.slice(-8)}</CardTitle>
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-white/70 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString("es-AR")}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>${order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedOrder(order)}
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 px-2 sm:px-3"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Ver Detalles</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/20">
                          {selectedOrder && (
                            <>
                              <DialogHeader className="pb-4 border-b border-white/20">
                                <DialogTitle className="text-xl font-bold text-white">
                                  Detalles del Pedido #{selectedOrder.id.slice(-8)}
                                </DialogTitle>
                                <DialogDescription className="text-white/70">
                                  Información completa de tu pedido
                                </DialogDescription>
                              </DialogHeader>

                              <div className="py-4 space-y-6">
                                {/* Información del pedido */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-white">Información del Pedido</h3>
                                    <div className="text-sm text-white/80 space-y-1">
                                      <div>
                                        <span className="font-medium">Fecha:</span>{" "}
                                        {new Date(selectedOrder.createdAt).toLocaleDateString("es-AR")}
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium">Estado:</span>
                                        <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                                          {getStatusText(selectedOrder.status)}
                                        </Badge>
                                      </div>
                                      <div>
                                        <span className="font-medium">Método de pago:</span>{" "}
                                        {selectedOrder.paymentMethod}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-white">Entrega</h3>
                                    <div className="text-sm text-white/80 space-y-1">
                                      <div className="flex items-start space-x-2">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span>{selectedOrder.shippingAddress}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <Separator className="bg-white/20" />

                                {/* Productos */}
                                <div>
                                  <h3 className="font-semibold text-white mb-4">
                                    Productos ({selectedOrder.items.length})
                                  </h3>
                                  <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg"
                                      >
                                        <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden">
                                          <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-medium text-white text-sm">{item.name}</h4>
                                          <p className="text-xs text-white/60">Cantidad: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold text-white">${item.price.toLocaleString()}</p>
                                          <p className="text-xs text-white/60">c/u</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator className="bg-white/20" />

                                {/* Total */}
                                <div className="flex justify-between items-center text-xl font-bold text-white">
                                  <span>Total del Pedido</span>
                                  <span>${selectedOrder.total.toLocaleString()}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-white/70">
                      <div className="flex items-center space-x-1">
                        <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{order.items.length} productos</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate max-w-20 sm:max-w-none">{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="flex -space-x-1 sm:-space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-full border-2 border-white/20 overflow-hidden"
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full border-2 border-white/20 flex items-center justify-center">
                          <span className="text-xs text-white font-medium">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
