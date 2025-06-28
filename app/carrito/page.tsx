"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { carritoService, type Cart } from "@/lib/firebase-services"

export default function CarritoPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [updating, setUpdating] = useState<string | null>(null)
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

  const handleCheckout = async () => {
    if (!user || !cart) return

    try {
      console.log("💳 Procesando checkout")
      await carritoService.completeCart(user.uid)

      toast({
        title: "¡Compra realizada!",
        description: "Tu pedido ha sido procesado exitosamente",
      })

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/tienda">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Seguir Comprando
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Mi Carrito</h1>
              <p className="text-white/70">{cart.items.length} productos en tu carrito</p>
            </div>
          </div>

          {cart.items.length > 0 && (
            <Button
              onClick={clearCart}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar Carrito
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card
                key={item.productId}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/10">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                        {item.category}
                      </Badge>
                      <p className="text-2xl font-bold text-green-400 mt-2">${item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={updating === item.productId || item.quantity <= 1}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white hover:bg-white/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="text-white font-semibold min-w-[2rem] text-center">{item.quantity}</span>

                      <Button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={updating === item.productId}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white hover:bg-white/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-white">${(item.price * item.quantity).toLocaleString()}</p>
                      <Button
                        onClick={() => removeItem(item.productId)}
                        disabled={updating === item.productId}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-white">
                    <span>Subtotal ({cart.items.length} productos)</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-white">
                    <span>Envío</span>
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "¡GRATIS!" : `$${shipping.toLocaleString()}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-sm text-white/70">Envío gratis en compras superiores a $50.000</p>
                  )}

                  <Separator className="bg-white/20" />

                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceder al Pago
                </Button>

                <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-sm">Compra 100% segura</span>
                  </div>
                  <p className="text-xs text-blue-200/70 mt-1">Tus datos están protegidos con encriptación SSL</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
