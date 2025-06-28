"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { carritoService } from "@/lib/firebase-services"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function CarritoPage() {
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth")
        return
      }

      // const userData = await getUserDocument(user.uid) // Assuming getUserDocument is defined elsewhere
      // For now, let's assume user data is directly available from auth.currentUser
      const userData = {
        id: user.uid,
        name: user.displayName || "Usuario", // Provide a default name
        email: user.email || "",
      }

      if (userData) {
        setUser(userData)
        await loadCartItems(userData.id)
      }
    })

    return () => unsubscribe()
  }, [router])

  const loadCartItems = async (userId) => {
    try {
      let userCart = await carritoService.getUserCart(userId)

      if (!userCart) {
        userCart = await carritoService.createUserCart(userId)
      }

      setCartItems(userCart.items || [])
    } catch (error) {
      console.error("Error loading cart:", error)
      setCartItems([])
    }
  }

  const updateCartInCollection = async (newItems) => {
    try {
      const userCart = await carritoService.getUserCart(user.id)
      if (userCart) {
        await carritoService.updateCart(userCart.id, newItems)
      }

      // Trigger custom event for navbar update
      window.dispatchEvent(new CustomEvent("userUpdated"))
    } catch (error) {
      console.error("Error updating cart:", error)
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const updatedCart = cartItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedCart)
    updateCartInCollection(updatedCart)
  }

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId)
    setCartItems(updatedCart)
    updateCartInCollection(updatedCart)

    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del carrito.",
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getShipping = () => {
    const subtotal = getSubtotal()
    return subtotal > 100000 ? 0 : 5000 // Free shipping over $100,000
  }

  const getTotal = () => {
    return getSubtotal() + getShipping()
  }

  const handleCheckout = () => {
    setLoading(true)

    // Simulate checkout process
    setTimeout(() => {
      const order = {
        id: Date.now().toString(),
        userId: user.id,
        customerName: user.name,
        items: cartItems,
        subtotal: getSubtotal(),
        shipping: getShipping(),
        total: getTotal(),
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      // Save order
      const orders = JSON.parse(localStorage.getItem("servitec_orders") || "[]")
      orders.push(order)
      localStorage.setItem("servitec_orders", JSON.stringify(orders))

      // Clear cart
      setCartItems([])
      updateCartInCollection([])

      toast({
        title: "¡Pedido realizado!",
        description: `Tu pedido #${order.id} ha sido procesado exitosamente.`,
      })

      setLoading(false)
      router.push("/")
    }, 2000)
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
            <p className="text-gray-600">{cartItems.length} productos en tu carrito</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega algunos productos para comenzar tu compra</p>
            <Button onClick={() => router.push("/tienda")}>Ir a la Tienda</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Productos en tu carrito</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>
                      {getShipping() === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatPrice(getShipping())
                      )}
                    </span>
                  </div>

                  {getShipping() === 0 && (
                    <p className="text-sm text-green-600">¡Envío gratis por compras superiores a $100.000!</p>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? (
                      "Procesando..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Finalizar Compra
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    <p>Métodos de pago disponibles:</p>
                    <p>Efectivo • Transferencia • Mercado Pago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
