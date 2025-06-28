"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Package, Plus, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import { productosService, type Product } from "@/lib/firebase-services"

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, filterCategory, filterStatus])

  const loadProducts = async () => {
    try {
      setLoading(true)
      console.log("🔄 Cargando productos desde components/admin/products.tsx...")
      const productsData = await productosService.getAllProducts()
      console.log("📦 Productos cargados:", productsData)
      setProducts(productsData)
    } catch (error) {
      console.error("❌ Error loading products:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((product) => product.category === filterCategory)
    }

    if (filterStatus !== "all") {
      if (filterStatus === "active") {
        filtered = filtered.filter((product) => product.isActive)
      } else if (filterStatus === "inactive") {
        filtered = filtered.filter((product) => !product.isActive)
      } else if (filterStatus === "low_stock") {
        filtered = filtered.filter((product) => product.stock <= 5)
      }
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setFilteredProducts(filtered)
  }

  const addProduct = async () => {
    console.log("��� === INICIANDO CREACIÓN DE PRODUCTO DESDE COMPONENTS ===")
    console.log("📝 Datos del formulario:", newProduct)

    // Validación de campos requeridos
    if (!newProduct.name?.trim()) {
      console.log("❌ Validación fallida: nombre faltante")
      toast({
        title: "Error",
        description: "El nombre del producto es requerido",
        variant: "destructive",
      })
      return
    }

    if (!newProduct.price || newProduct.price <= 0) {
      console.log("❌ Validación fallida: precio inválido")
      toast({
        title: "Error",
        description: "El precio debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    if (!newProduct.category?.trim()) {
      console.log("❌ Validación fallida: categoría faltante")
      toast({
        title: "Error",
        description: "La categoría es requerida",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      console.log("🔥 Preparando datos para Firebase...")

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description?.trim() || "",
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.price) * 1.2, // 20% más como precio original
        stock: Number(newProduct.stock) || 0,
        category: newProduct.category.trim(),
        brand: newProduct.brand?.trim() || "Sin especificar",
        image: newProduct.image?.trim() || "/placeholder.svg?height=300&width=300",
        images: [newProduct.image?.trim() || "/placeholder.svg?height=600&width=600"],
        rating: 4.5,
        reviews: 0,
        isNew: true,
        isActive: true,
        specifications: {
          Marca: newProduct.brand?.trim() || "Sin especificar",
          Descripción: newProduct.description?.trim() || "",
        },
      }

      console.log("📦 Datos preparados para Firebase:", productData)
      console.log("🎯 Usando productosService.createProduct() que escribe en colección 'productos'")

      const productId = await productosService.createProduct(productData)
      console.log("🎉 ¡PRODUCTO CREADO EXITOSAMENTE! ID:", productId)

      // Recargar productos
      await loadProducts()

      // Limpiar formulario y cerrar modal
      setNewProduct({})
      setIsAddingProduct(false)

      toast({
        title: "¡Producto agregado!",
        description: `El producto "${productData.name}" ha sido agregado exitosamente`,
      })
    } catch (error) {
      console.error("💥 Error completo al agregar producto:", error)
      console.error("🔍 Detalles del error:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      })
      toast({
        title: "Error",
        description: `No se pudo agregar el producto: ${error instanceof Error ? error.message : "Error desconocido"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateProduct = async () => {
    if (!editingProduct) return

    try {
      console.log("🔄 Actualizando producto:", editingProduct.id)
      await productosService.updateProduct(editingProduct.id!, editingProduct)
      await loadProducts()

      setEditingProduct(null)
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado exitosamente",
      })
    } catch (error) {
      console.error("❌ Error updating product:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      })
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      console.log("🗑️ Eliminando producto:", productId)
      await productosService.deleteProduct(productId)
      await loadProducts()

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente",
      })
    } catch (error) {
      console.error("❌ Error deleting product:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const toggleProductStatus = async (productId: string) => {
    try {
      const product = products.find((p) => p.id === productId)
      const newStatus = !product?.isActive

      console.log("🔄 Cambiando estado del producto:", productId, "a", newStatus)
      await productosService.toggleProductStatus(productId, newStatus)
      await loadProducts()

      toast({
        title: "Estado actualizado",
        description: `Producto ${newStatus ? "activado" : "desactivado"}`,
      })
    } catch (error) {
      console.error("❌ Error toggling product status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del producto",
        variant: "destructive",
      })
    }
  }

  const categories = [...new Set(products.map((p) => p.category))]

  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    inactive: products.filter((p) => !p.isActive).length,
    lowStock: products.filter((p) => p.stock <= 5).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-white/70">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Productos</h2>
          <p className="text-white/70">Gestión del inventario de productos</p>
        </div>
        <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>Completa la información del producto para agregarlo al inventario</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input
                    placeholder="Nombre del producto"
                    value={newProduct.name || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoría *</Label>
                  <Select
                    value={newProduct.category || ""}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Notebooks">Notebooks</SelectItem>
                      <SelectItem value="Celulares">Celulares</SelectItem>
                      <SelectItem value="Parlantes">Parlantes</SelectItem>
                      <SelectItem value="Streaming">Streaming</SelectItem>
                      <SelectItem value="Smart Home">Smart Home</SelectItem>
                      <SelectItem value="Accesorios">Accesorios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Marca</Label>
                <Input
                  placeholder="Marca del producto"
                  value={newProduct.brand || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Descripción del producto"
                  value={newProduct.description || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Precio *</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={newProduct.stock || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL de Imagen</Label>
                <Input
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={newProduct.image || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingProduct(false)
                    setNewProduct({})
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={addProduct}
                  disabled={
                    isSubmitting || !newProduct.name?.trim() || !newProduct.price || !newProduct.category?.trim()
                  }
                >
                  {isSubmitting ? "Agregando..." : "Agregar Producto"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Activos</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Inactivos</p>
                <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
              </div>
              <Package className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Stock Bajo</p>
                <p className="text-2xl font-bold text-orange-400">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Valor Total</p>
                <p className="text-xl font-bold text-purple-400">${stats.totalValue.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-white/90">
                Buscar
              </Label>
              <Input
                id="search"
                placeholder="Nombre, descripción, categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Categoría</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Todas las categorías" />
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
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="low_stock">Stock Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Productos ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-white/70">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron productos con los filtros aplicados</p>
                <Button onClick={() => setIsAddingProduct(true)} className="mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primer producto
                </Button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg line-clamp-1 text-white">{product.name}</h3>
                          <div className="flex gap-1">
                            <Badge variant={product.isActive ? "default" : "secondary"}>
                              {product.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                            {product.stock <= 5 && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Stock Bajo
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-white/70 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-white/80 border-white/30">
                            {product.category}
                          </Badge>
                          <span className="text-lg font-bold text-green-400">${product.price.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Stock: {product.stock}</span>
                          <span className="text-white/70">
                            {new Date(product.createdAt).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Producto</DialogTitle>
                              <DialogDescription>Modifica la información del producto</DialogDescription>
                            </DialogHeader>
                            {editingProduct && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label>Nombre</Label>
                                    <Input
                                      value={editingProduct.name}
                                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Categoría</Label>
                                    <Select
                                      value={editingProduct.category}
                                      onValueChange={(value) =>
                                        setEditingProduct({ ...editingProduct, category: value })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Notebooks">Notebooks</SelectItem>
                                        <SelectItem value="Celulares">Celulares</SelectItem>
                                        <SelectItem value="Parlantes">Parlantes</SelectItem>
                                        <SelectItem value="Streaming">Streaming</SelectItem>
                                        <SelectItem value="Smart Home">Smart Home</SelectItem>
                                        <SelectItem value="Accesorios">Accesorios</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Descripción</Label>
                                  <Textarea
                                    value={editingProduct.description}
                                    onChange={(e) =>
                                      setEditingProduct({ ...editingProduct, description: e.target.value })
                                    }
                                  />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label>Precio</Label>
                                    <Input
                                      type="number"
                                      value={editingProduct.price}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          price: Number.parseFloat(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Stock</Label>
                                    <Input
                                      type="number"
                                      value={editingProduct.stock}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          stock: Number.parseInt(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>URL de Imagen</Label>
                                  <Input
                                    value={editingProduct.image}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                                    Cancelar
                                  </Button>
                                  <Button onClick={updateProduct}>Actualizar</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant={product.isActive ? "destructive" : "default"}
                          onClick={() => toggleProductStatus(product.id!)}
                        >
                          {product.isActive ? "Desactivar" : "Activar"}
                        </Button>

                        <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
