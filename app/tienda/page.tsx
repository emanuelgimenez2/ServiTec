"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, ShoppingCart, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Eye, Heart, CreditCard } from "lucide-react"
import {
  productosService,
  carritoService,
  pedidosService,
  listaDeseosService,
  type Product,
} from "@/lib/firebase-services"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { getUserDocument } from "@/lib/auth-service"

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [loading, setLoading] = useState(true)
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
    loadProducts()

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

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, priceRange, sortBy])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await productosService.getAllProducts()
      // Solo mostrar productos activos en la tienda
      const activeProducts = productsData.filter((product) => product.isActive)
      setProducts(activeProducts)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
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

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filtrar por rango de precio
    if (priceRange !== "all") {
      switch (priceRange) {
        case "0-50000":
          filtered = filtered.filter((product) => product.price <= 50000)
          break
        case "50000-100000":
          filtered = filtered.filter((product) => product.price > 50000 && product.price <= 100000)
          break
        case "100000-300000":
          filtered = filtered.filter((product) => product.price > 100000 && product.price <= 300000)
          break
        case "300000+":
          filtered = filtered.filter((product) => product.price > 300000)
          break
      }
    }

    // Ordenar
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredProducts(filtered)
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
    setCurrentImageIndex(0)
    setIsImageZoomed(false)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setCurrentImageIndex(0)
    setIsImageZoomed(false)
  }

  const nextImage = () => {
    if (selectedProduct?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length)
    }
  }

  const prevImage = () => {
    if (selectedProduct?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)
    }
  }

  const toggleImageZoom = () => {
    setIsImageZoomed(!isImageZoomed)
  }

  // Obtener categorías únicas
  const categories = [...new Set(products.map((product) => product.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando productos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Nuestra Tienda
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos tecnológicos con los mejores precios y calidad garantizada
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20">
                <SelectItem value="all" className="text-white">
                  Todas las categorías
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20">
                <SelectItem value="all" className="text-white">
                  Todos los precios
                </SelectItem>
                <SelectItem value="0-50000" className="text-white">
                  Hasta $50.000
                </SelectItem>
                <SelectItem value="50000-100000" className="text-white">
                  $50.000 - $100.000
                </SelectItem>
                <SelectItem value="100000-300000" className="text-white">
                  $100.000 - $300.000
                </SelectItem>
                <SelectItem value="300000+" className="text-white">
                  Más de $300.000
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20">
                <SelectItem value="newest" className="text-white">
                  Más recientes
                </SelectItem>
                <SelectItem value="price-low" className="text-white">
                  Precio: menor a mayor
                </SelectItem>
                <SelectItem value="price-high" className="text-white">
                  Precio: mayor a menor
                </SelectItem>
                <SelectItem value="name" className="text-white">
                  Nombre A-Z
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-white/70">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/50 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.isNew && (
                        <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">Nuevo</Badge>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </Badge>
                      )}

                      {/* Favorite Button */}
                      <Button
                        onClick={() => toggleFavorite(product)}
                        size="sm"
                        variant="ghost"
                        className="absolute bottom-2 right-2 h-8 w-8 p-0 hover:bg-black/70 rounded-full"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.includes(product.id) ? "text-red-500 fill-current" : "text-white"
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white line-clamp-2">{product.name}</h3>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                        {product.category}
                      </Badge>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-green-400">${product.price.toLocaleString()}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-white/50 line-through ml-2">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {product.rating && (
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white/70 text-sm">{product.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Stock Info */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Stock:</span>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => openProductModal(product)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </Button>

                      <Button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0 || addingToCart === product.id}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        {addingToCart === product.id ? (
                          <>
                            <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Agregando...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {product.stock === 0 ? "Sin stock" : user ? "Agregar al carrito" : "Inicia sesión"}
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleBuyNow(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        {product.stock === 0 ? "Sin stock" : user ? "Comprar ahora" : "Inicia sesión"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={closeProductModal}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/20">
          <DialogHeader className="pb-4 border-b border-white/20">
            <DialogTitle className="text-xl font-bold text-white">{selectedProduct?.name}</DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedProduct?.category} • {selectedProduct?.brand}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={
                      selectedProduct.images?.[currentImageIndex] ||
                      selectedProduct.image ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={selectedProduct.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isImageZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    onClick={toggleImageZoom}
                  />

                  {/* Image Navigation */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <>
                      <Button
                        onClick={prevImage}
                        size="sm"
                        variant="secondary"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <ChevronLeft className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        onClick={nextImage}
                        size="sm"
                        variant="secondary"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <ChevronRight className="h-4 w-4 text-white" />
                      </Button>
                    </>
                  )}

                  {/* Zoom Toggle */}
                  <Button
                    onClick={toggleImageZoom}
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                  >
                    {isImageZoomed ? (
                      <ZoomOut className="h-4 w-4 text-white" />
                    ) : (
                      <ZoomIn className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>

                {/* Thumbnail Navigation */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {selectedProduct.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          index === currentImageIndex ? "border-blue-500" : "border-white/20"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-400">${selectedProduct.price.toLocaleString()}</span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-lg text-white/50 line-through">
                        ${selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <Badge className="bg-red-500 hover:bg-red-600">
                      Ahorrás ${(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-white mb-2">Descripción</h3>
                  <p className="text-white/80 leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Specifications */}
                {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-3">Especificaciones</h3>
                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 px-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                        >
                          <span className="font-medium text-white/90">{key}:</span>
                          <span className="text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock and Availability */}
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white/90">Disponibilidad:</span>
                    <Badge variant={selectedProduct.stock > 0 ? "default" : "destructive"}>
                      {selectedProduct.stock > 0 ? "En stock" : "Sin stock"}
                    </Badge>
                  </div>
                  {selectedProduct.stock > 0 && (
                    <p className="text-sm text-white/70">
                      {selectedProduct.stock <= 5
                        ? `¡Solo quedan ${selectedProduct.stock} unidades!`
                        : `${selectedProduct.stock} unidades disponibles`}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => toggleFavorite(selectedProduct)}
                    variant="ghost"
                    className="w-full border border-white/30 text-white hover:bg-white/10 h-12 text-base font-semibold"
                  >
                    <Heart
                      className={`h-5 w-5 mr-2 ${favorites.includes(selectedProduct.id) ? "text-red-500 fill-current" : "text-white"}`}
                    />
                    {favorites.includes(selectedProduct.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  </Button>

                  <Button
                    onClick={() => addToCart(selectedProduct)}
                    disabled={selectedProduct.stock === 0 || addingToCart === selectedProduct.id}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-12 text-base font-semibold"
                  >
                    {addingToCart === selectedProduct.id ? (
                      <>
                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {selectedProduct.stock === 0 ? "Sin stock" : user ? "Agregar al carrito" : "Inicia sesión"}
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleBuyNow(selectedProduct)}
                    disabled={selectedProduct.stock === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12 text-base font-semibold"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {selectedProduct.stock === 0 ? "Sin stock" : user ? "Comprar ahora" : "Inicia sesión"}
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
            {/* Payment Options */}
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

            {/* Pickup Information */}
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
    </div>
  )
}
