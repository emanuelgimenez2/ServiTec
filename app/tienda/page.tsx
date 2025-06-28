"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, Star, Eye, Zap, Smartphone, Headphones, Tv, Home, Laptop, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { productosService, carritoService, type Product } from "@/lib/firebase-services"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()

    // Escuchar cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        loadCartCount(currentUser.uid)
      } else {
        setCartItemsCount(0)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, sortBy])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      console.log("Cargando productos desde Firebase...")

      const productsData = await productosService.getActiveProducts()
      console.log("Productos cargados:", productsData)

      setProducts(productsData)

      if (productsData.length === 0) {
        setError("No hay productos disponibles en este momento.")
      }
    } catch (error) {
      console.error("Error loading products:", error)
      setError("Error al cargar los productos. Por favor, intenta de nuevo.")
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCartCount = async (userId: string) => {
    try {
      const userCart = await carritoService.getUserCart(userId)
      if (userCart) {
        const totalItems = userCart.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartItemsCount(totalItems)
      }
    } catch (error) {
      console.error("Error loading cart count:", error)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filtro por marca
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    // Filtro por rango de precio
    if (priceRange !== "all") {
      filtered = filtered.filter((product) => {
        const price = product.price
        switch (priceRange) {
          case "0-50000":
            return price <= 50000
          case "50000-100000":
            return price > 50000 && price <= 100000
          case "100000-200000":
            return price > 100000 && price <= 200000
          case "200000+":
            return price > 200000
          default:
            return true
        }
      })
    }

    // Ordenamiento
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

  const addToCart = async (product: Product) => {
    // Verificar si el usuario está autenticado
    if (!user) {
      toast({
        title: "Inicia sesión requerido",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("🛒 Agregando producto al carrito:", product.name)
      await carritoService.addToCart(user.uid, product, 1)

      // Actualizar contador del carrito
      await loadCartCount(user.uid)

      toast({
        title: "Producto agregado",
        description: `${product.name} ha sido agregado al carrito`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      Notebooks: Laptop,
      Celulares: Smartphone,
      Parlantes: Headphones,
      Streaming: Tv,
      "Smart Home": Home,
      Accesorios: Package,
    }
    const IconComponent = icons[category] || Package
    return <IconComponent className="w-4 h-4" />
  }

  // Obtener categorías y marcas únicas de los productos
  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean)
  const brands = [...new Set(products.map((p) => p.brand))].filter(Boolean)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-4">
              <Zap className="inline-block w-12 h-12 mr-4 text-yellow-400" />
              ServiTec Store
            </h1>
            <p className="text-xl text-white/80 mb-6">Encuentra la mejor tecnología para tu hogar y oficina</p>
            <div className="flex justify-center items-center space-x-4">
              <Button onClick={loadProducts} className="bg-blue-600 hover:bg-blue-700">
                Actualizar Productos
              </Button>
              <div className="flex items-center space-x-2 text-white/70">
                <ShoppingCart className="w-5 h-5" />
                <span>{cartItemsCount} productos en carrito</span>
              </div>
              {!user && (
                <Link href="/auth">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8">
            <Card className="bg-red-500/20 border-red-500/30">
              <CardContent className="p-6 text-center">
                <p className="text-white text-lg">{error}</p>
                <Button onClick={loadProducts} className="mt-4 bg-red-600 hover:bg-red-700">
                  Reintentar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    />
                  </div>
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(category)}
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Más recientes</SelectItem>
                    <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                    <SelectItem value="rating">Mejor valorados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-white border-white/30">
                  {filteredProducts.length} productos encontrados
                </Badge>
                {searchTerm && (
                  <Badge variant="outline" className="text-white border-white/30">
                    Búsqueda: "{searchTerm}"
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="outline" className="text-white border-white/30">
                    Categoría: {selectedCategory}
                  </Badge>
                )}
                {selectedBrand !== "all" && (
                  <Badge variant="outline" className="text-white border-white/30">
                    Marca: {selectedBrand}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-12">
                <Package className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No se encontraron productos</h3>
                <p className="text-white/70 mb-6">
                  {products.length === 0
                    ? "No hay productos disponibles en este momento."
                    : "Intenta ajustar los filtros de búsqueda."}
                </p>
                {products.length === 0 && (
                  <Button onClick={loadProducts} className="bg-blue-600 hover:bg-blue-700">
                    Recargar Productos
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && <Badge className="bg-green-500 text-white">Nuevo</Badge>}
                      <Badge variant="outline" className="text-white border-white/50 bg-black/50">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-white/50 text-white hover:bg-white hover:text-black"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-white text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-white/70 text-sm">{product.brand}</p>
                    </div>

                    <p className="text-white/80 text-sm mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-white/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/70 text-sm ml-2">({product.reviews || 0} reseñas)</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-white">{formatPrice(product.price)}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-white/50 line-through">{formatPrice(product.originalPrice)}</div>
                        )}
                      </div>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
                      </Badge>
                    </div>

                    <Button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock > 0 ? (user ? "Agregar al carrito" : "Inicia sesión para comprar") : "Sin stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de producto */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{selectedProduct.name}</h3>
                      <p className="text-muted-foreground">{selectedProduct.brand}</p>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(selectedProduct.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground ml-2">({selectedProduct.reviews || 0} reseñas)</span>
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-green-600">{formatPrice(selectedProduct.price)}</div>
                      {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                        <div className="text-lg text-muted-foreground line-through">
                          {formatPrice(selectedProduct.originalPrice)}
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground">{selectedProduct.description}</p>

                    {selectedProduct.specifications && (
                      <div>
                        <h4 className="font-semibold mb-2">Especificaciones:</h4>
                        <div className="space-y-1">
                          {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      <Badge variant={selectedProduct.stock > 0 ? "default" : "destructive"}>
                        {selectedProduct.stock > 0 ? `Stock disponible: ${selectedProduct.stock}` : "Sin stock"}
                      </Badge>
                      <Badge variant="outline">{selectedProduct.category}</Badge>
                    </div>

                    <Button
                      onClick={() => {
                        addToCart(selectedProduct)
                        setSelectedProduct(null)
                      }}
                      disabled={selectedProduct.stock === 0}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {selectedProduct.stock > 0
                        ? user
                          ? "Agregar al carrito"
                          : "Inicia sesión para comprar"
                        : "Sin stock"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
