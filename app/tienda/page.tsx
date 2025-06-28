"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { productosService } from "@/lib/firebase-services"

const allProducts = [
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
    name: "MacBook Air M2",
    price: 1200000,
    originalPrice: 1350000,
    rating: 4.9,
    reviews: 12,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    category: "Notebooks",
    brand: "Apple",
    storage: "256GB",
    color: "Plata",
    stock: 2,
    isNew: true,
    specifications: {
      Procesador: "Apple M2 chip",
      "Memoria RAM": "8GB unificada",
      Almacenamiento: "256GB SSD",
      Pantalla: '13.6" Liquid Retina',
      Resolución: "2560 x 1664",
      Peso: "1.24 kg",
      Batería: "Hasta 18 horas",
      Sistema: "macOS Ventura",
    },
    description: "La laptop más delgada y liviana de Apple con el potente chip M2.",
  },
  {
    id: 6,
    name: "Chromecast con Google TV",
    price: 45000,
    originalPrice: 55000,
    rating: 4.7,
    reviews: 15,
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=600&width=600"],
    category: "Streaming",
    brand: "Google",
    storage: "8GB",
    color: "Blanco",
    stock: 12,
    isNew: true,
    specifications: {
      Resolución: "Hasta 4K HDR",
      Procesador: "Quad-core ARM Cortex-A55",
      Memoria: "8GB",
      Conectividad: "Wi-Fi 802.11ac, Bluetooth",
      Puertos: "HDMI, USB-C",
      "Control Remoto": "Incluido con Google Assistant",
      Servicios: "Netflix, YouTube, Disney+, Prime Video",
      Sistema: "Google TV",
    },
    description: "Convierte cualquier TV en Smart TV con acceso a miles de aplicaciones.",
  },
]

const categories = ["Todos", "Notebooks", "Celulares", "Parlantes", "Streaming", "Smart Home"]
const brands = ["Todos", "HP", "Samsung", "Apple", "JBL", "Google", "Amazon"]
const storageOptions = ["Todos", "64GB", "128GB", "256GB", "512GB", "1TB"]
const colors = ["Todos", "Negro", "Blanco", "Azul", "Plata", "Rojo"]

export default function TiendaPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [wishlist, setWishlist] = useState(new Set())
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedStorage, setSelectedStorage] = useState("Todos")
  const [selectedColors, setSelectedColors] = useState([])
  const [priceRange, setPriceRange] = useState([0, 1500000])
  const [sortBy, setSortBy] = useState("relevancia")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyOffers, setShowOnlyOffers] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await productosService.getActiveProducts()
      setProducts(productsData)
      setFilteredProducts(productsData)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort products
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const matchesStorage = selectedStorage === "Todos" || product.storage === selectedStorage
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !showOnlyInStock || product.stock > 0
      const matchesOffers = !showOnlyOffers || product.originalPrice > product.price

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesStorage &&
        matchesColor &&
        matchesPrice &&
        matchesStock &&
        matchesOffers
      )
    })

    // Sort products
    switch (sortBy) {
      case "precio-menor":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "precio-mayor":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "nombre":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // relevancia - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedBrands,
    selectedStorage,
    selectedColors,
    priceRange,
    sortBy,
    showOnlyInStock,
    showOnlyOffers,
  ])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Todos")
    setSelectedBrands([])
    setSelectedStorage("Todos")
    setSelectedColors([])
    setPriceRange([0, 1500000])
    setSortBy("relevancia")
    setShowOnlyInStock(false)
    setShowOnlyOffers(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tienda ServiTec</h1>
          <p className="text-xl text-gray-600">Encuentra la tecnología que necesitas al mejor precio</p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-orange-200 hover:border-orange-400"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Relevancia</SelectItem>
                  <SelectItem value="precio-menor">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-mayor">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="rating">Mejor Valorados</SelectItem>
                  <SelectItem value="nombre">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "Todos" ||
            selectedBrands.length > 0 ||
            selectedColors.length > 0 ||
            showOnlyInStock ||
            showOnlyOffers) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {selectedCategory !== "Todos" && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {selectedCategory}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory("Todos")} />
                </Badge>
              )}
              {selectedBrands.map((brand) => (
                <Badge key={brand} variant="secondary" className="bg-orange-100 text-orange-800">
                  {brand}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedBrands(selectedBrands.filter((b) => b !== brand))}
                  />
                </Badge>
              ))}
              {selectedColors.map((color) => (
                <Badge key={color} variant="secondary" className="bg-orange-100 text-orange-800">
                  {color}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedColors(selectedColors.filter((c) => c !== color))}
                  />
                </Badge>
              ))}
              {showOnlyInStock && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Solo en stock
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setShowOnlyInStock(false)} />
                </Badge>
              )}
              {showOnlyOffers && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Solo ofertas
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setShowOnlyOffers(false)} />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-orange-600 hover:text-orange-700"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">Filtros</h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categorías</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Marcas</h4>
                <div className="space-y-2">
                  {brands.slice(1).map((brand) => (
                    <label key={brand} className="flex items-center cursor-pointer">
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBrands([...selectedBrands, brand])
                          } else {
                            setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rango de Precio</h4>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1500000}
                    step={10000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Colores</h4>
                <div className="space-y-2">
                  {colors.slice(1).map((color) => (
                    <label key={color} className="flex items-center cursor-pointer">
                      <Checkbox
                        checked={selectedColors.includes(color)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColors([...selectedColors, color])
                          } else {
                            setSelectedColors(selectedColors.filter((c) => c !== color))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <Checkbox checked={showOnlyInStock} onCheckedChange={setShowOnlyInStock} className="mr-2" />
                  <span className="text-sm">Solo productos en stock</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <Checkbox checked={showOnlyOffers} onCheckedChange={setShowOnlyOffers} className="mr-2" />
                  <span className="text-sm">Solo ofertas</span>
                </label>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos con los filtros seleccionados</p>
                <Button onClick={clearFilters} className="mt-4">
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    onViewDetails={setSelectedProduct}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct && !imageModalOpen} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Image
                    src={selectedProduct.images[selectedImageIndex] || selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    width={400}
                    height={400}
                    className="w-full h-80 object-cover rounded-lg cursor-pointer"
                    onClick={() => setImageModalOpen(true)}
                  />
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : selectedProduct.images.length - 1))
                        }
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImageIndex((prev) => (prev < selectedProduct.images.length - 1 ? prev + 1 : 0))
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                <div>
                  <div className="mb-4">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      {selectedProduct.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {selectedProduct.rating} ({selectedProduct.reviews} reseñas)
                    </span>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-gray-900">{formatPrice(selectedProduct.price)}</span>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(selectedProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <div className="text-green-600 font-medium">
                        Ahorrás {formatPrice(selectedProduct.originalPrice - selectedProduct.price)}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3 mb-6">
                    <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al carrito
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className="border-orange-200 hover:border-orange-400"
                    >
                      <Heart
                        className={`w-4 h-4 ${wishlist.has(selectedProduct.id) ? "text-red-500 fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="specs" className="mt-6">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                </TabsList>
                <TabsContent value="specs" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl">
          {selectedProduct && (
            <div className="relative">
              <Image
                src={selectedProduct.images[selectedImageIndex] || "/placeholder.svg"}
                alt={selectedProduct.name}
                width={800}
                height={600}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="flex justify-center space-x-2 mt-4">
                {selectedProduct.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === selectedImageIndex ? "bg-orange-600" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProductCard({ product, viewMode, wishlist, toggleWishlist, onViewDetails, formatPrice }) {
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
              {product.isNew && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                  Nuevo
                </Badge>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                </div>
                <button onClick={() => toggleWishlist(product.id)} className="p-2 hover:bg-gray-100 rounded-full">
                  <Heart
                    className={`w-5 h-5 ${wishlist.has(product.id) ? "text-red-500 fill-current" : "text-gray-400"}`}
                  />
                </button>
              </div>
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating} ({product.reviews})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                    {product.stock <= 3 ? `Quedan ${product.stock}` : "En stock"}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => onViewDetails(product)} variant="outline">
                    Ver detalles
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md relative overflow-hidden">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.isNew && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">Nuevo</Badge>
            )}
            {product.originalPrice > product.price && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">Oferta</Badge>
            )}
          </div>

          {/* Stock Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
              {product.stock <= 3 ? `Quedan ${product.stock}` : "En stock"}
            </Badge>
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex flex-col space-y-2">
              <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Agregar al carrito
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 text-gray-900 hover:bg-white border-orange-200"
                onClick={() => onViewDetails(product)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver características
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 text-gray-900 hover:bg-white border-orange-200"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={`w-4 h-4 mr-2 ${wishlist.has(product.id) ? "text-red-500 fill-current" : ""}`} />
                Agregar a lista de deseos
              </Button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
              {product.category}
            </Badge>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-sm text-green-600 font-medium">
                  Ahorrás {formatPrice(product.originalPrice - product.price)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
