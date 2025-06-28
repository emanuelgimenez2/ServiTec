"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ShoppingCart, Eye, Heart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { productosService } from "@/lib/firebase-services"

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [wishlist, setWishlist] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Only run on client side
    if (typeof window !== "undefined") {
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      const productsData = await productosService.getFeaturedProducts()
      setProducts(productsData)
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
      ])
    } finally {
      setLoading(false)
    }
  }

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

  const getDisplayProducts = () => {
    if (isMobile) {
      return products.slice(0, 4)
    }
    return products
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-xl text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra selección de productos tecnológicos de última generación con los mejores precios del
            mercado
          </p>
        </div>

        {/* Products Grid - Mobile: 2x2, Desktop: 4x1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {getDisplayProducts().map((product) => (
            <div key={product.id} className="w-full">
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md relative overflow-hidden h-full">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {product.isNew && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                          Nuevo
                        </Badge>
                      )}
                      {product.originalPrice > product.price && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">Oferta</Badge>
                      )}
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                        {product.stock <= 3 ? `Quedan ${product.stock}` : "En stock"}
                      </Badge>
                    </div>

                    {/* Hover Actions - Only on desktop */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center lg:flex hidden">
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Agregar al carrito
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 text-gray-900 hover:bg-white border-orange-200"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 text-gray-900 hover:bg-white border-orange-200"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart
                            className={`w-4 h-4 mr-2 ${wishlist.has(product.id) ? "text-red-500 fill-current" : ""}`}
                          />
                          Favorito
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 lg:p-4 flex-1 flex flex-col">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                        {product.category}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base line-clamp-2 flex-1">
                      {product.name}
                    </h3>

                    {/* Rating - Hidden on mobile */}
                    <div className="hidden lg:flex items-center mb-3">
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
                    <div className="mt-auto">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-2 lg:mb-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg lg:text-xl font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs lg:text-sm text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-xs lg:text-sm text-green-600 font-medium">
                              Ahorrás {formatPrice(product.originalPrice - product.price)}
                            </div>
                          )}
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex lg:hidden space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProduct(product)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-1"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
          >
            Ver todos los productos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedProduct?.name}</DialogTitle>
            <DialogDescription>Detalles completos del producto</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Image
                  src={selectedProduct.images?.[selectedImageIndex] || selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  width={400}
                  height={400}
                  className="w-full h-80 object-cover rounded-lg"
                />
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
          )}
          {selectedProduct && (
            <Tabs defaultValue="specs" className="mt-6">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
              </TabsList>
              <TabsContent value="specs" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedProduct.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
