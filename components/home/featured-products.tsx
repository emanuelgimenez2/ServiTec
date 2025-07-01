"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Eye, ChevronLeft, ChevronRight, ArrowRight, Mail, Send, Heart, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { productosService, carritoService, pedidosService, listaDeseosService } from "@/lib/firebase-services"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { getUserDocument } from "@/lib/auth-service"

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)
  const [addingToCart, setAddingToCart] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedProductToBuy, setSelectedProductToBuy] = useState(null)
  const [processingOrder, setProcessingOrder] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadFeaturedProducts()

    // Escuchar cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const userData = await getUserDocument(currentUser.uid)
        setUserDoc(userData)
        loadUserFavorites(currentUser.uid)
      } else {
        setUserDoc(null)
        setFavorites([])
      }
    })

    return () => unsubscribe()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      const productsData = await productosService.getAllProducts()
      // Solo mostrar productos activos
      const activeProducts = productsData.filter((product) => product.isActive)
      setProducts(activeProducts)
    } catch (error) {
      console.error("Error loading featured products:", error)
      // Fallback to default products if Firebase fails
      setProducts([
        {
          id: 1,
          name: "Notebook HP Pavilion 15",
          price: 450000,
          originalPrice: 520000,
          rating: 4.8,
          reviews: 24,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
          category: "Notebooks",
          brand: "HP",
          storage: "512GB",
          color: "Negro",
          stock: 3,
          isNew: true,
          specifications: {
            Procesador: "Intel Core i5-12450H",
            "Memoria RAM": "8GB DDR4",
            Almacenamiento: "512GB SSD",
            Pantalla: '15.6" Full HD',
            "Tarjeta Gráfica": "Intel Iris Xe",
            "Sistema Operativo": "Windows 11 Home",
            Peso: "1.75 kg",
            Batería: "Hasta 8 horas",
          },
          description: "Notebook ideal para trabajo y entretenimiento con procesador Intel de última generación.",
        },
        {
          id: 2,
          name: "Samsung Galaxy A54",
          price: 280000,
          originalPrice: 320000,
          rating: 4.6,
          reviews: 18,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
          category: "Celulares",
          brand: "Samsung",
          storage: "256GB",
          color: "Azul",
          stock: 5,
          isNew: false,
          specifications: {
            Pantalla: '6.4" Super AMOLED',
            Procesador: "Exynos 1380",
            "Memoria RAM": "8GB",
            Almacenamiento: "256GB",
            "Cámara Principal": "50MP + 12MP + 5MP",
            "Cámara Frontal": "32MP",
            Batería: "5000mAh",
            "Sistema Operativo": "Android 13",
          },
          description: "Smartphone con excelente cámara y pantalla AMOLED para una experiencia visual superior.",
        },
        {
          id: 3,
          name: "iPhone 15",
          price: 850000,
          originalPrice: 950000,
          rating: 4.9,
          reviews: 45,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
          category: "Celulares",
          brand: "Apple",
          storage: "128GB",
          color: "Negro",
          stock: 2,
          isNew: true,
          specifications: {
            Pantalla: '6.1" Super Retina XDR',
            Procesador: "A17 Pro",
            Almacenamiento: "128GB",
            "Cámara Principal": "48MP",
            "Cámara Frontal": "12MP",
            Batería: "Hasta 20 horas",
            "Sistema Operativo": "iOS 17",
            Conectividad: "5G, Wi-Fi 6E",
          },
          description: "El iPhone más avanzado con chip A17 Pro y cámara profesional.",
        },
        {
          id: 4,
          name: "Parlante JBL Flip 6",
          price: 85000,
          originalPrice: 95000,
          rating: 4.9,
          reviews: 32,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=600&width=600"],
          category: "Parlantes",
          brand: "JBL",
          storage: "N/A",
          color: "Negro",
          stock: 8,
          isNew: false,
          specifications: {
            Potencia: "30W RMS",
            Conectividad: "Bluetooth 5.1",
            Resistencia: "IP67 (agua y polvo)",
            Batería: "Hasta 12 horas",
            Dimensiones: "178 x 68 x 72 mm",
            Peso: "550g",
            Colores: "Negro, Azul, Rojo, Verde",
            Extras: "PartyBoost compatible",
          },
          description: "Parlante portátil con sonido potente y resistencia al agua.",
        },
        {
          id: 5,
          name: "Monitor LG 24 Full HD",
          price: 120000,
          originalPrice: 140000,
          rating: 4.7,
          reviews: 15,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=600&width=600"],
          category: "Monitores",
          brand: "LG",
          storage: "N/A",
          color: "Negro",
          stock: 6,
          isNew: false,
          specifications: {
            Tamaño: '24"',
            Resolución: "1920x1080 Full HD",
            "Tipo de Panel": "IPS",
            "Frecuencia de Actualización": "75Hz",
            Conectividad: "HDMI, VGA",
            Brillo: "250 cd/m²",
            "Tiempo de Respuesta": "5ms",
          },
          description: "Monitor Full HD ideal para trabajo y entretenimiento.",
        },
        {
          id: 6,
          name: "Teclado Mecánico RGB",
          price: 45000,
          originalPrice: 55000,
          rating: 4.5,
          reviews: 28,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=600&width=600"],
          category: "Periféricos",
          brand: "Redragon",
          storage: "N/A",
          color: "Negro",
          stock: 12,
          isNew: true,
          specifications: {
            Tipo: "Mecánico",
            Switches: "Blue",
            Iluminación: "RGB",
            Conectividad: "USB",
            Layout: "Español",
            "Anti-Ghosting": "Sí",
            Material: "Aluminio",
          },
          description: "Teclado mecánico con iluminación RGB y switches blue para gaming.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadUserFavorites = async (userId) => {
    try {
      const favoriteIds = await listaDeseosService.getUserWishlist(userId)
      setFavorites(favoriteIds)
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const addToCart = async (product) => {
    if (!user || !userDoc) {
      router.push("/auth")
      return
    }

    if (product.stock <= 0) {
      toast({
        title: "Sin stock",
        description: "Este producto no tiene stock disponible",
        variant: "destructive",
      })
      return
    }

    try {
      setAddingToCart(product.id)
      console.log("🛒 Agregando al carrito:", product.name)

      await carritoService.addToCart(userDoc.id, product, 1)

      // Mostrar modal de éxito
      setShowCartModal(true)
    } catch (error) {
      console.error("Error adding to cart:", error)

      // Verificar si es error de stock
      if (error.message.includes("Ya agregaste")) {
        toast({
          title: "Stock limitado",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo agregar el producto al carrito",
          variant: "destructive",
        })
      }
    } finally {
      setAddingToCart(null)
    }
  }

  const toggleFavorite = async (product) => {
    if (!user) {
      router.push("/auth")
      return
    }

    try {
      const isFavorite = favorites.includes(product.id)

      if (isFavorite) {
        await listaDeseosService.removeFromWishlist(user.uid, product.id)
        setFavorites(favorites.filter((id) => id !== product.id))
      } else {
        await listaDeseosService.addToWishlist(user.uid, product.id)
        setFavorites([...favorites, product.id])
      }

      toast({
        title: isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
        description: `${product.name} ${isFavorite ? "se eliminó de" : "se agregó a"} tus favoritos`,
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar favoritos",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = (product) => {
    if (!user || !userDoc) {
      router.push("/auth")
      return
    }

    if (product.stock <= 0) {
      toast({
        title: "Sin stock",
        description: "Este producto no tiene stock disponible",
        variant: "destructive",
      })
      return
    }

    setSelectedProductToBuy(product)
    setShowPaymentModal(true)
  }

  const handlePaymentMethodSelect = async (method) => {
    if (!selectedProductToBuy || !user || !userDoc) return

    try {
      setProcessingOrder(true)
      console.log("💳 Procesando compra directa con método:", method)

      // Crear el pedido directamente
      const orderData = {
        userId: user.uid,
        userName: user.displayName || userDoc.name || "Usuario",
        userEmail: user.email,
        userPhone: userDoc.phone || "No especificado",
        items: [
          {
            id: selectedProductToBuy.id,
            name: selectedProductToBuy.name,
            price: selectedProductToBuy.price,
            quantity: 1,
            image: selectedProductToBuy.image,
          },
        ],
        total: selectedProductToBuy.price,
        status: "pending" as const,
        shippingAddress: "Retiro en local - Balbín y Baldoni",
        paymentMethod: method,
      }

      // Crear pedido en Firebase
      await pedidosService.createOrder(orderData)

      toast({
        title: "¡Compra realizada!",
        description: `Tu pedido de ${selectedProductToBuy.name} ha sido procesado exitosamente. Método de pago: ${method}`,
      })

      setShowPaymentModal(false)
      setSelectedProductToBuy(null)
    } catch (error) {
      console.error("Error during direct purchase:", error)
      toast({
        title: "Error en la compra",
        description: "No se pudo procesar el pedido",
        variant: "destructive",
      })
    } finally {
      setProcessingOrder(false)
    }
  }

  const openProductModal = (product) => {
    setSelectedProduct(product)
    setSelectedImageIndex(0)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setSelectedImageIndex(0)
  }

  const nextImage = () => {
    if (selectedProduct?.images) {
      setSelectedImageIndex((prev) => (prev + 1) % selectedProduct.images.length)
    }
  }

  const prevImage = () => {
    if (selectedProduct?.images) {
      setSelectedImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)
    }
  }

  // Navegación del carrusel
  const nextSlide = () => {
    const maxIndex = Math.max(0, products.length - 4) // Mostrar máximo 4 productos
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  // Obtener productos visibles (4 en desktop, 2 en móvil)
  const getVisibleProducts = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024
    const itemsToShow = isMobile ? 2 : 4
    return products.slice(currentIndex, currentIndex + itemsToShow)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para suscribirte al newsletter.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Obtener el perfil actual del usuario
      const perfilRef = doc(db, "perfil", user.uid)
      const perfilDoc = await getDoc(perfilRef)

      let perfilData = {}
      if (perfilDoc.exists()) {
        perfilData = perfilDoc.data()
      }

      // Actualizar el perfil con la información del newsletter
      await setDoc(
        perfilRef,
        {
          ...perfilData,
          userId: user.uid,
          email: email || user.email,
          deseaNotificaciones: "si",
          fechaSuscripcionNewsletter: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )

      toast({
        title: "¡Suscripción exitosa!",
        description: "Te has suscrito correctamente a nuestro newsletter.",
      })
      setEmail("")
    } catch (error) {
      console.error("Error al suscribirse:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al suscribirte. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-6 sm:py-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Productos Destacados
            </h2>
            <p className="text-white/70 text-sm">Cargando productos...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Productos Destacados
          </h2>
          <p className="text-white/70 text-sm max-w-xl mx-auto">
            Descubre nuestra selección de productos tecnológicos con los mejores precios
          </p>
        </div>

        {/* Products Carousel Container */}
        <div className="relative px-6 sm:px-8 mb-6">
          {/* Navigation Arrows - Fuera del recuadro */}
          {products.length > 4 && (
            <>
              <Button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="absolute -left-1 sm:-left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                onClick={nextSlide}
                disabled={currentIndex >= products.length - 4}
                className="absolute -right-1 sm:-right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </>
          )}

          {/* Products Grid - Más compacto */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
            {getVisibleProducts().map((product) => (
              <Card
                key={product.id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group relative"
              >
                <CardContent className="p-1.5 sm:p-2">
                  <div className="space-y-1.5">
                    {/* Imagen del producto - Más pequeña */}
                    <div className="aspect-square relative overflow-hidden rounded bg-gray-100">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.isNew && (
                        <Badge className="absolute top-0.5 left-0.5 bg-green-500 hover:bg-green-600 text-xs px-1 py-0 h-4">
                          Nuevo
                        </Badge>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Badge className="absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-600 text-xs px-1 py-0 h-4">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </Badge>
                      )}

                      {/* Botón de favoritos */}
                      <Button
                        onClick={() => toggleFavorite(product)}
                        size="sm"
                        variant="ghost"
                        className="absolute bottom-0.5 right-0.5 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 rounded-full"
                      >
                        <Heart
                          className={`h-3 w-3 ${
                            favorites.includes(product.id) ? "text-red-400 fill-current" : "text-white"
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Información del producto - Más compacta */}
                    <div className="space-y-1">
                      <h3 className="font-medium text-white text-xs line-clamp-2 leading-tight">{product.name}</h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-green-400">${product.price.toLocaleString()}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-white/50 line-through ml-1">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botones de acción - Más pequeños */}
                      <div className="space-y-1">
                        <Button
                          onClick={() => openProductModal(product)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs h-6"
                        >
                          <Eye className="h-2.5 w-2.5 mr-1" />
                          Ver
                        </Button>

                        <Button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0 || addingToCart === product.id}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs h-6"
                        >
                          {addingToCart === product.id ? (
                            <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                          ) : (
                            <ShoppingCart className="h-2.5 w-2.5 mr-1" />
                          )}
                          {product.stock === 0 ? "Sin stock" : user ? "Agregar" : "Inicia sesión"}
                        </Button>

                        <Button
                          onClick={() => handleBuyNow(product)}
                          disabled={product.stock === 0}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs h-6"
                        >
                          <CreditCard className="h-2.5 w-2.5 mr-1" />
                          {product.stock === 0 ? "Sin stock" : user ? "Comprar" : "Inicia sesión"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Section - Compacta como "Nuestra Historia" */}
        <div className="bg-gradient-to-r from-purple-900 via-violet-900 to-purple-800 rounded-xl p-4 sm:p-6 text-white mb-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full mb-2 sm:mb-3">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-2xl font-bold mb-2">Mantente Actualizado</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
              Suscríbete y recibe ofertas exclusivas y novedades tecnológicas
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto mb-3 sm:mb-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Tu email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/40 h-8 sm:h-9"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-3 text-xs sm:text-sm h-8 sm:h-9"
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Benefits - 2 columnas en móvil, 4 en desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-white/90">
              <div className="flex items-center text-center">
                <span className="text-sm sm:text-base mr-1">🎯</span>
                <h4 className="font-medium text-xs sm:text-sm">Ofertas Exclusivas</h4>
              </div>
              <div className="flex items-center text-center">
                <span className="text-sm sm:text-base mr-1">📱</span>
                <h4 className="font-medium text-xs sm:text-sm">Novedades Tech</h4>
              </div>
              <div className="flex items-center text-center">
                <span className="text-sm sm:text-base mr-1">💡</span>
                <h4 className="font-medium text-xs sm:text-sm">Consejos Útiles</h4>
              </div>
              <div className="flex items-center text-center">
                <span className="text-sm sm:text-base mr-1">🎁</span>
                <h4 className="font-medium text-xs sm:text-sm">Regalos Sorpresa</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action - Más compacto */}
        <div className="text-center">
          <Link href="/tienda">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 text-sm"
            >
              Ver todos los productos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Cart Success Modal */}
      <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
        <DialogContent className="w-[95vw] max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/20">
          <DialogHeader className="pb-4 border-b border-white/20">
            <DialogTitle className="text-xl font-bold text-white text-center">¡Producto agregado!</DialogTitle>
            <DialogDescription className="text-sm text-white/70 text-center">
              El producto se agregó correctamente a tu carrito
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => {
                  setShowCartModal(false)
                  router.push("/carrito")
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ir al Carrito
              </Button>

              <Button
                onClick={() => setShowCartModal(false)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Seguir Comprando
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Details Modal - Con fondo violeta */}
      <Dialog open={!!selectedProduct} onOpenChange={closeProductModal}>
        <DialogContent className="w-[95vw] max-w-[320px] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/20">
          <DialogHeader className="pb-3 border-b border-white/20">
            <DialogTitle className="text-sm sm:text-xl font-bold text-white line-clamp-2">
              {selectedProduct?.name || "Producto"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-white/70">
              {selectedProduct?.category || "Categoría"} • {selectedProduct?.brand || "Marca"}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 py-2 sm:py-4">
              {/* Galería de imágenes */}
              <div className="space-y-2 sm:space-y-4">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={
                      selectedProduct.images?.[selectedImageIndex] ||
                      selectedProduct.image ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Controles de navegación de imágenes */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <>
                      <Button
                        onClick={prevImage}
                        size="sm"
                        variant="secondary"
                        className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </Button>
                      <Button
                        onClick={nextImage}
                        size="sm"
                        variant="secondary"
                        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Información del producto */}
              <div className="space-y-3 sm:space-y-6">
                {/* Precio */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-3xl font-bold text-green-400">
                      ${selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-sm sm:text-lg text-white/50 line-through">
                        ${selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Descripción</h3>
                  <p className="text-white/80 text-xs sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Especificaciones */}
                {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">Especificaciones</h3>
                    <div className="grid gap-1 sm:gap-2 max-h-32 sm:max-h-48 overflow-y-auto">
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-1 sm:py-2 px-2 sm:px-3 bg-white/10 backdrop-blur-sm rounded-lg text-xs sm:text-sm border border-white/20"
                        >
                          <span className="font-medium text-white/90">{key}:</span>
                          <span className="text-white text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock y disponibilidad */}
                <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-4 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="font-medium text-white/90 text-xs sm:text-sm">Disponibilidad:</span>
                    <Badge
                      variant={selectedProduct.stock > 0 ? "default" : "destructive"}
                      className="text-xs sm:text-sm"
                    >
                      {selectedProduct.stock > 0 ? "En stock" : "Sin stock"}
                    </Badge>
                  </div>
                  {selectedProduct.stock > 0 && (
                    <p className="text-xs sm:text-sm text-white/70">
                      {selectedProduct.stock <= 5
                        ? `¡Solo quedan ${selectedProduct.stock} unidades!`
                        : `${selectedProduct.stock} unidades disponibles`}
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleFavorite(selectedProduct)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 flex-shrink-0"
                  >
                    <Heart
                      className={`h-4 w-4 ${favorites.includes(selectedProduct.id) ? "text-red-400 fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    onClick={() => addToCart(selectedProduct)}
                    disabled={selectedProduct.stock === 0 || addingToCart === selectedProduct.id}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-10 sm:h-12 text-sm sm:text-base font-semibold"
                  >
                    {addingToCart === selectedProduct.id ? (
                      <>
                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        {selectedProduct.stock === 0
                          ? "Sin stock"
                          : user
                            ? "Agregar al carrito"
                            : "Inicia sesión para añadirlo a tu carrito"}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleBuyNow(selectedProduct)}
                    disabled={selectedProduct.stock === 0}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-10 sm:h-12 text-sm sm:text-base font-semibold"
                  >
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    {selectedProduct.stock === 0 ? "Sin stock" : user ? "Comprar ahora" : "Inicia sesión para comprar"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="w-[95vw] max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/20">
          <DialogHeader className="pb-4 border-b border-white/20">
            <DialogTitle className="text-xl font-bold text-white text-center">Selecciona tu forma de pago</DialogTitle>
            <DialogDescription className="text-sm text-white/70 text-center">
              {selectedProductToBuy?.name} - ${selectedProductToBuy?.price.toLocaleString()}
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
                <span className="mr-3 text-2xl">💵</span>
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
                <span className="text-lg">🏪</span>
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
    </section>
  )
}
