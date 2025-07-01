"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { productosService, carritoService, listaDeseosService } from "@/lib/firebase-services"

export default function FavoritosPage() {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [favoriteProducts, setFavoriteProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth")
        return
      }
      setUser(currentUser)
      loadUserFavorites(currentUser.uid)
    })

    return () => unsubscribe()
  }, [router])

  const loadUserFavorites = async (userId) => {
    try {
      setLoading(true)
      console.log("❤️ Cargando favoritos para usuario:", userId)

      // Obtener lista de deseos del usuario
      const favoriteIds = await listaDeseosService.getUserWishlist(userId)
      setFavorites(favoriteIds)

      if (favoriteIds.length > 0) {
        // Cargar detalles de los productos favoritos
        const products = await productosService.getAllProducts()
        const favoriteProductsData = products.filter((product) => favoriteIds.includes(product.id))
        setFavoriteProducts(favoriteProductsData)
        console.log("✅ Favoritos cargados:", favoriteProductsData.length)
      } else {
        setFavoriteProducts([])
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar tus favoritos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromFavorites = async (productId) => {
    if (!user) return

    try {
      await listaDeseosService.removeFromWishlist(user.uid, productId)

      const newFavorites = favorites.filter((id) => id !== productId)
      setFavorites(newFavorites)
      setFavoriteProducts(favoriteProducts.filter((product) => product.id !== productId))

      toast({
        title: "Eliminado de favoritos",
        description: "El producto se eliminó de tus favoritos",
      })
    } catch (error) {
      console.error("Error removing from favorites:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar de favoritos",
        variant: "destructive",
      })
    }
  }

  const addToCart = async (product) => {
    if (!user) return

    try {
      setAddingToCart(product.id)
      await carritoService.addToCart(user.uid, product, 1)

      toast({
        title: "¡Producto agregado!",
        description: `${product.name} se agregó al carrito`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando tus favoritos...</p>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Mis Favoritos</h1>
              <p className="text-white/70">Productos que te gustan</p>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <Card className="p-8 text-center bg-white/10 backdrop-blur-md border-white/20 max-w-md mx-auto">
              <CardContent className="space-y-4">
                <Heart className="h-16 w-16 mx-auto text-white/70" />
                <h2 className="text-2xl font-bold text-white">No tienes favoritos aún</h2>
                <p className="text-white/70">¡Explora nuestra tienda y marca tus productos favoritos!</p>
                <Button
                  onClick={() => router.push("/tienda")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Explorar Tienda
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favoriteProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group relative"
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

                      {/* Botón de eliminar favorito */}
                      <Button
                        onClick={() => removeFromFavorites(product.id)}
                        size="sm"
                        variant="ghost"
                        className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-red-500/70 rounded-full"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
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
                        </div>
                        <Badge variant="outline" className="hidden sm:block text-white/80 border-white/30 text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      {/* Stock */}
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>Stock: {product.stock}</span>
                        {product.stock <= 5 && product.stock > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            ¡Últimas unidades!
                          </Badge>
                        )}
                        {product.stock === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Sin stock
                          </Badge>
                        )}
                      </div>

                      {/* Botón de agregar al carrito */}
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0 || addingToCart === product.id}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm h-8 sm:h-9"
                      >
                        {addingToCart === product.id ? (
                          <>
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                            Agregando...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                          </>
                        )}
                      </Button>
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
