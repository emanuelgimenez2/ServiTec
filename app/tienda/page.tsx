"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Search, ShoppingCart, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Eye } from "lucide-react"
import { productosService, type Product } from "@/lib/firebase-services"

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
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
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

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      filtered = filtered.filter((product) => {
        switch (priceRange) {
          case "0-50000":
            return product.price <= 50000
          case "50000-100000":
            return product.price > 50000 && product.price <= 100000
          case "100000-200000":
            return product.price > 100000 && product.price <= 200000
          case "200000+":
            return product.price > 200000
          default:
            return true
        }
      })
    }

    // Ordenar productos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredProducts(filtered)
  }

  const addToCart = (product: Product) => {
    // Aquí implementarías la lógica del carrito
    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
    })
  }

  const openProductModal = (product: Product) => {
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

  const toggleZoom = () => {
    setIsImageZoomed(!isImageZoomed)
  }

  const categories = [...new Set(products.map((p) => p.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Nuestra Tienda
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Descubre los mejores productos tecnológicos con la calidad que mereces
          </p>
        </div>

        {/* Filtros */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Búsqueda */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Categoría */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Precio */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los precios</SelectItem>
                  <SelectItem value="0-50000">Hasta $50.000</SelectItem>
                  <SelectItem value="50000-100000">$50.000 - $100.000</SelectItem>
                  <SelectItem value="100000-200000">$100.000 - $200.000</SelectItem>
                  <SelectItem value="200000+">Más de $200.000</SelectItem>
                </SelectContent>
              </Select>

              {/* Ordenar */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  {/*comentado hasta agregar bien la parte de pedidos*/}
                  {/*<SelectItem value="rating">Mejor valorados</SelectItem>*/}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-white/70">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  {/* Imagen del producto */}
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
                  </div>

                  {/* Información del producto */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2">{product.name}</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl font-bold text-green-400">
                            ${product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-white/50 line-through">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {/*comentado hasta agregar bien la parte de pedidos*/}
                        {/*<div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-white/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-white/60">({product.reviews || 0})</span>
                        </div>*/}
                      </div>
                      {/* Categoría - Solo visible en desktop */}
                      <Badge variant="outline" className="hidden sm:block text-white/80 border-white/30 text-xs">
                        {product.category}
                      </Badge>
                    </div>

                    {/* Stock - Solo mostrar "Sin stock" en móvil, todo en desktop */}
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="hidden sm:block">Stock: {product.stock}</span>
                      <span className="sm:hidden">Stock: {product.stock}</span>
                      {/* Últimas unidades - Solo visible en desktop */}
                      {product.stock <= 5 && product.stock > 0 && (
                        <Badge variant="destructive" className="hidden sm:block text-xs">
                          ¡Últimas unidades!
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Sin stock
                        </Badge>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => openProductModal(product)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm h-8 sm:h-9"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Ver detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-[320px] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                          {selectedProduct && (
                            <>
                              <DialogHeader className="pb-3 border-b">
                                <DialogTitle className="text-sm sm:text-xl font-bold text-gray-900 line-clamp-2">
                                  {selectedProduct.name}
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm text-gray-600">
                                  {selectedProduct.category} • {selectedProduct.brand}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 py-2 sm:py-4">
                                {/* Galería de imágenes */}
                                <div className="space-y-2 sm:space-y-4">
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
                                      className={`w-full h-full object-cover transition-transform duration-300 cursor-pointer ${
                                        isImageZoomed ? "scale-150" : "scale-100"
                                      }`}
                                      onClick={toggleZoom}
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

                                    {/* Control de zoom */}
                                    <Button
                                      onClick={toggleZoom}
                                      size="sm"
                                      variant="secondary"
                                      className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-black/50 hover:bg-black/70"
                                    >
                                      {isImageZoomed ? (
                                        <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                      ) : (
                                        <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                      )}
                                    </Button>
                                  </div>

                                  {/* Miniaturas (solo en desktop) */}
                                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                                    <div className="hidden sm:grid grid-cols-4 gap-2">
                                      {selectedProduct.images.map((image, index) => (
                                        <button
                                          key={index}
                                          onClick={() => setCurrentImageIndex(index)}
                                          className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                                            index === currentImageIndex
                                              ? "border-blue-500"
                                              : "border-gray-200 hover:border-gray-300"
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

                                {/* Información del producto */}
                                <div className="space-y-3 sm:space-y-6">
                                  {/* Precio y rating */}
                                  <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <span className="text-xl sm:text-3xl font-bold text-green-600">
                                        ${selectedProduct.price.toLocaleString()}
                                      </span>
                                      {selectedProduct.originalPrice &&
                                        selectedProduct.originalPrice > selectedProduct.price && (
                                          <span className="text-sm sm:text-lg text-gray-500 line-through">
                                            ${selectedProduct.originalPrice.toLocaleString()}
                                          </span>
                                        )}
                                    </div>

                                    {/*comentado hasta agregar bien la parte de pedidos*/}
                                    {/*<div className="flex items-center gap-2">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                              i < Math.floor(selectedProduct.rating || 0)
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm text-gray-600">
                                        ({selectedProduct.reviews || 0} reseñas)
                                      </span>
                                    </div>*/}
                                  </div>

                                  {/* Descripción */}
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                      Descripción
                                    </h3>
                                    <p className="text-gray-700 text-xs sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">
                                      {selectedProduct.description}
                                    </p>
                                  </div>

                                  {/* Especificaciones */}
                                  {selectedProduct.specifications &&
                                    Object.keys(selectedProduct.specifications).length > 0 && (
                                      <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                                          Especificaciones
                                        </h3>
                                        <div className="grid gap-1 sm:gap-2 max-h-32 sm:max-h-48 overflow-y-auto">
                                          {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                                            <div
                                              key={key}
                                              className="flex justify-between py-1 sm:py-2 px-2 sm:px-3 bg-gray-50 rounded-lg text-xs sm:text-sm"
                                            >
                                              <span className="font-medium text-gray-700">{key}:</span>
                                              <span className="text-gray-900 text-right">{value}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  {/* Stock y disponibilidad */}
                                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                                      <span className="font-medium text-gray-700 text-xs sm:text-sm">
                                        Disponibilidad:
                                      </span>
                                      <Badge
                                        variant={selectedProduct.stock > 0 ? "default" : "destructive"}
                                        className="text-xs sm:text-sm"
                                      >
                                        {selectedProduct.stock > 0 ? "En stock" : "Sin stock"}
                                      </Badge>
                                    </div>
                                    {selectedProduct.stock > 0 && (
                                      <p className="text-xs sm:text-sm text-gray-600">
                                        {selectedProduct.stock <= 5
                                          ? `¡Solo quedan ${selectedProduct.stock} unidades!`
                                          : `${selectedProduct.stock} unidades disponibles`}
                                      </p>
                                    )}
                                  </div>

                                  {/* Botón de acción */}
                                  <div>
                                    <Button
                                      onClick={() => addToCart(selectedProduct)}
                                      disabled={selectedProduct.stock === 0}
                                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-10 sm:h-12 text-sm sm:text-base font-semibold"
                                    >
                                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                      {selectedProduct.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensaje cuando no hay productos */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-md border-white/20 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-2">No se encontraron productos</h3>
              <p className="text-white/70 mb-4">Intenta ajustar los filtros o buscar con otros términos</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setPriceRange("all")
                  setSortBy("newest")
                }}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
