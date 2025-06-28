"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Heart, ShoppingCart, Trash2, ArrowLeft, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const [user, setUser] = useState(null)
  const [wishlistItems, setWishlistItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("servitec_user")
    if (!userData) {
      router.push("/auth")
      return
    }

    const user = JSON.parse(userData)
    setUser(user)

    // Load wishlist data from "lista_de_deseos" collection
    loadWishlistData(user.id)
  }, [router])

  const loadWishlistData = (userId) => {
    const wishlistCollection = JSON.parse(localStorage.getItem("lista_de_deseos") || "[]")
    const userWishlist = wishlistCollection.find((w) => w.userId === userId)

    if (userWishlist) {
      setWishlistItems(userWishlist.items)
      setCategories([{ id: "general", name: "General", color: "bg-gray-500" }, ...userWishlist.categories])
    } else {
      // Create empty wishlist for user if doesn't exist
      const newWishlist = {
        userId: userId,
        items: [],
        categories: [{ id: "general", name: "General", color: "bg-gray-500" }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      wishlistCollection.push(newWishlist)
      localStorage.setItem("lista_de_deseos", JSON.stringify(wishlistCollection))
      setWishlistItems([])
      setCategories([{ id: "general", name: "General", color: "bg-gray-500" }])
    }
  }

  const updateWishlistInCollection = (newItems, newCategories = null) => {
    const wishlistCollection = JSON.parse(localStorage.getItem("lista_de_deseos") || "[]")
    const wishlistIndex = wishlistCollection.findIndex((w) => w.userId === user.id)

    if (wishlistIndex !== -1) {
      wishlistCollection[wishlistIndex].items = newItems
      if (newCategories) {
        wishlistCollection[wishlistIndex].categories = newCategories.filter((c) => c.id !== "general")
      }
      wishlistCollection[wishlistIndex].updatedAt = new Date().toISOString()
    } else {
      wishlistCollection.push({
        userId: user.id,
        items: newItems,
        categories: newCategories ? newCategories.filter((c) => c.id !== "general") : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    localStorage.setItem("lista_de_deseos", JSON.stringify(wishlistCollection))

    // Trigger custom event for navbar update
    window.dispatchEvent(new CustomEvent("userUpdated"))
  }

  const createCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      color: `bg-${["blue", "green", "purple", "pink", "yellow", "indigo"][Math.floor(Math.random() * 6)]}-500`,
      createdAt: new Date().toISOString(),
    }

    const updatedCategories = [...categories.filter((c) => c.id !== "general"), newCategory]
    const allCategories = [categories.find((c) => c.id === "general"), ...updatedCategories]
    setCategories(allCategories)

    updateWishlistInCollection(wishlistItems, allCategories)

    setNewCategoryName("")
    setShowNewCategoryDialog(false)

    toast({
      title: "Categoría creada",
      description: `La categoría "${newCategory.name}" ha sido creada.`,
    })
  }

  const moveToCategory = (productId, categoryId) => {
    const updatedWishlist = wishlistItems.map((item) => (item.id === productId ? { ...item, categoryId } : item))
    setWishlistItems(updatedWishlist)
    updateWishlistInCollection(updatedWishlist)

    const categoryName = categories.find((c) => c.id === categoryId)?.name || "General"
    toast({
      title: "Producto movido",
      description: `El producto ha sido movido a "${categoryName}".`,
    })
  }

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== productId)
    setWishlistItems(updatedWishlist)
    updateWishlistInCollection(updatedWishlist)

    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de tu lista de deseos.",
    })
  }

  const addToCart = (product) => {
    const carritoCollection = JSON.parse(localStorage.getItem("carrito") || "[]")
    const userCartIndex = carritoCollection.findIndex((c) => c.userId === user.id)

    if (userCartIndex !== -1) {
      const existingItem = carritoCollection[userCartIndex].items.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        carritoCollection[userCartIndex].items.push({ ...product, quantity: 1 })
      }

      carritoCollection[userCartIndex].updatedAt = new Date().toISOString()
    } else {
      carritoCollection.push({
        userId: user.id,
        items: [{ ...product, quantity: 1 }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    localStorage.setItem("carrito", JSON.stringify(carritoCollection))

    // Trigger custom event for navbar update
    window.dispatchEvent(new CustomEvent("userUpdated"))

    toast({
      title: "Producto agregado al carrito",
      description: `${product.name} ha sido agregado al carrito.`,
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getFilteredItems = () => {
    if (selectedCategory === "all") return wishlistItems
    return wishlistItems.filter((item) => (item.categoryId || "general") === selectedCategory)
  }

  const getCategoryById = (categoryId) => {
    return categories.find((c) => c.id === categoryId) || categories.find((c) => c.id === "general")
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  const filteredItems = getFilteredItems()

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Deseos</h1>
              <p className="text-gray-600">{wishlistItems.length} productos guardados</p>
            </div>
          </div>

          <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="w-4 h-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Categoría</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Nombre de la categoría</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej: Para el trabajo, Regalos, etc."
                  />
                </div>
                <Button onClick={createCategory} className="w-full">
                  Crear Categoría
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              size="sm"
            >
              Todos ({wishlistItems.length})
            </Button>
            {categories.map((category) => {
              const count = wishlistItems.filter((item) => (item.categoryId || "general") === category.id).length
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  className="flex items-center"
                >
                  <div className={`w-3 h-3 rounded-full ${category.color} mr-2`} />
                  {category.name} ({count})
                </Button>
              )
            })}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {selectedCategory === "all"
                ? "Tu lista de deseos está vacía"
                : `No hay productos en "${getCategoryById(selectedCategory)?.name}"`}
            </h2>
            <p className="text-gray-600 mb-8">
              {selectedCategory === "all"
                ? "Agrega productos que te gusten para guardarlos aquí"
                : "Agrega productos a esta categoría desde la tienda"}
            </p>
            <Button onClick={() => router.push("/tienda")}>Ir a la Tienda</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const category = getCategoryById(item.categoryId || "general")
              return (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={`${category.color} text-white`}>{category.name}</Badge>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={() => addToCart(item)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Agregar al Carrito
                        </Button>

                        <Select
                          value={item.categoryId || "general"}
                          onValueChange={(value) => moveToCategory(item.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Mover a categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full ${category.color} mr-2`} />
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
