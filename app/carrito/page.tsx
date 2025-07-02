"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, DollarSign, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { carritoService, pedidosService, type Cart } from "@/lib/firebase-services"

export default function CarritoPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [processingOrder, setProcessingOrder] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔥 Auth state changed in carrito:", user?.email)
      setUser(user)
      if (user) {
        loadUserCart(user.uid)
      } else {
        setCart(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const loadUserCart = async (userId: string) => {
    try {
      setLoading(true)
      console.log("🛒 Cargando carrito para usuario:", userId)
      const userCart = await carritoService.getUserCart(userId)
      console.log("📦 Carrito obtenido:", userCart)
      setCart(userCart)
    } catch (error) {
      console.error("Error loading cart:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el carrito",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!user || !cart) return

    try {
      setUpdating(productId)
      console.log("📊 Actualizando cantidad:", { productId, newQuantity })
      await carritoService.updateQuantity(user.uid, productId, newQuantity)
      await loadUserCart(user.uid)

      toast({
        title: "Cantidad actualizada",
        description: "El producto se actualizó correctamente",
      })
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (productId: string) => {
    if (!user || !cart) return

    try {
      setUpdating(productId)
      console.log("🗑️ Eliminando producto:", productId)
      await carritoService.removeFromCart(user.uid, productId)
      await loadUserCart(user.uid)

      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del carrito",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      console.log("🧹 Limpiando carrito completo")
      await carritoService.clearCart(user.uid)
      await loadUserCart(user.uid)

      toast({
        title: "Carrito vaciado",
        description: "Todos los productos fueron eliminados",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito",
        variant: "destructive",
      })
    }
  }

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method)
    processOrder(method)
  }

  const processOrder = async (paymentMethod: string) => {
    if (!user || !cart) return

    try {
      setProcessingOrder(true)
      console.log("💳 Procesando pedido con método:", paymentMethod)

      // Crear el pedido
      const orderData = {
        userId: user.uid,
        userName: user.displayName || "Usuario",
        userEmail: user.email,
        userPhone: "No especificado",
        items: cart.items.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: cart.total,
        status: "pending" as const,
        shippingAddress: "Retiro en local - Balbín y Baldoni",
        paymentMethod: paymentMethod,
      }

      // Crear pedido en Firebase
      await pedidosService.createOrder(orderData)

      // Completar el carrito (cambia status a "completed")
      await carritoService.completeCart(user.uid)

      toast({
        title: "¡Compra realizada!",
        description: `Tu pedido ha sido procesado exitosamente. Método de pago: ${paymentMethod}`,
      })

      setShowPaymentModal(false)

      // Crear nuevo carrito activo
      await carritoService.createUserCart(user.uid)
      await loadUserCart(user.uid)
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Error en la compra",
        description: "No se pudo procesar el pedido",
        variant: "destructive",
      })
    } finally {
      setProcessingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando carrito...</p>
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
                <ShoppingBag className="h-16 w-16 mx-auto text-white/70" />
                <h2 className="text-2xl font-bold text-white">Inicia sesión para ver tu carrito</h2>
                <p className="text-white/70">Necesitas estar autenticado para acceder a tu carrito de compras</p>
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Iniciar Sesión
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 text-center bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="space-y-4">
                <ShoppingBag className="h-16 w-16 mx-auto text-white/70" />
                <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
                <p className="text-white/70">¡Explora nuestra tienda y encuentra productos increíbles!</p>
                <Link href="/tienda">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Ir a la Tienda
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = cart.total
  const shipping = subtotal > 50000 ? 0 : 5000
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/tienda">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs sm:text-sm">
                <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Seguir Comprando
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-white">Mi Carrito</h1>
              <p className="text-white/70 text-xs sm:text-base">{cart.items.length} productos</p>
            </div>
          </div>

          {cart.items.length > 0 && (
            <Button
              onClick={clearCart}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs sm:text-sm"
            >
              <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Vaciar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-4">
            {cart.items.map((item) => (
              <Card
                key={item.productId}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-lg font-semibold text-white truncate">{item.name}</h3>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-200 border-purple-500/30 text-xs"
                      >
                        {item.category}
                      </Badge>
                      <p className="text-lg sm:text-2xl font-bold text-green-400 mt-1">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={updating === item.productId || item.quantity <= 1}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-white hover:bg-white/10"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>

                        <span className="text-white font-semibold min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm sm:text-base">
                          {item.quantity}
                        </span>

                        <Button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={updating === item.productId}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-white hover:bg-white/10"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      <div className="text-center sm:text-right">
                        <p className="text-sm sm:text-xl font-bold text-white">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          onClick={() => removeItem(item.productId)}
                          disabled={updating === item.productId}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-1"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 sticky top-20 sm:top-24">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Resumen del Pedido</h2>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-white text-sm sm:text-base">
                    <span>Subtotal ({cart.items.length})</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-white text-sm sm:text-base">
                    <span>Envío</span>
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "¡GRATIS!" : `$${shipping.toLocaleString()}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs sm:text-sm text-white/70">Envío gratis en compras superiores a $50.000</p>
                  )}

                  <Separator className="bg-white/20" />

                  <div className="flex justify-between text-lg sm:text-xl font-bold text-white">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Botón de proceder al pago */}
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Proceder al Pago
                </Button>

                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Compra 100% segura</span>
                  </div>
                  <p className="text-xs text-blue-200/70 mt-1">Tus datos están protegidos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="w-[95vw] max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/20">
          <DialogHeader className="pb-4 border-b border-white/20">
            <DialogTitle className="text-xl font-bold text-white text-center">Selecciona tu forma de pago</DialogTitle>
            <DialogDescription className="text-sm text-white/70 text-center">
              Total: ${total.toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {/* Opciones de pago */}
            <div className="space-y-3">
              <Button
                onClick={() => handlePaymentMethodSelect("Efectivo")}
                disabled={processingOrder}
                className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg"
              >
                <DollarSign className="mr-3 h-6 w-6" />
                Efectivo
              </Button>

              <Button
                onClick={() => handlePaymentMethodSelect("Transferencia")}
                disabled={processingOrder}
                className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg"
              >
                <CreditCard className="mr-3 h-6 w-6" />
                Transferencia
              </Button>
            </div>

            {/* Información de retiro */}
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center space-x-2 text-blue-200 mb-2">
                <Building2 className="h-5 w-5" />
                <span className="font-semibold">Retiro en local</span>
              </div>
              <p className="text-sm text-white/80">
                <strong>Dirección:</strong> Balbín y Baldoni
              </p>
              <p className="text-xs text-white/60 mt-2">Te contactaremos para coordinar el horario de retiro</p>
            </div>

            {processingOrder && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                <span className="text-white">Procesando pedido...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
