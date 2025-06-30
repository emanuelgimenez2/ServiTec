"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

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
import { Package, Plus, Edit, Trash2, AlertTriangle, CheckCircle, Upload, X, Eye, ImageIcon } from "lucide-react"
import { productosService, type Product } from "@/lib/firebase-services"

export default function AdminProductsFixed() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productImages, setProductImages] = useState<string[]>([])
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editSpecifications, setEditSpecifications] = useState<{ key: string; value: string }[]>([])
  const [editImages, setEditImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)
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

  // FUNCIÓN PARA CONVERTIR IMAGEN A BASE64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = () => {
        reject(new Error("Error al leer el archivo"))
      }
      reader.readAsDataURL(file)
    })
  }

  // FUNCIÓN PARA REDIMENSIONAR IMAGEN
  const resizeImage = (file: File, maxWidth = 800, maxHeight = 600, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height)

        // Convertir a base64 con compresión
        const base64 = canvas.toDataURL("image/jpeg", quality)
        resolve(base64)
      }

      img.onerror = () => {
        reject(new Error("Error al procesar la imagen"))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // FUNCIÓN PARA MANEJAR SUBIDA DE ARCHIVOS
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 2MB para el archivo original)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 2MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)
      console.log("📸 Procesando imagen:", file.name, "Tamaño:", (file.size / 1024).toFixed(2), "KB")

      // Redimensionar y comprimir imagen
      const base64Image = await resizeImage(file, 800, 600, 0.8)

      // Verificar tamaño del base64 (debe ser menor a 500KB para Firestore)
      const base64Size = (base64Image.length * 3) / 4 / 1024 // Tamaño aproximado en KB
      console.log("📊 Tamaño base64:", base64Size.toFixed(2), "KB")

      if (base64Size > 500) {
        // Si es muy grande, comprimir más
        const compressedBase64 = await resizeImage(file, 600, 400, 0.6)
        const compressedSize = (compressedBase64.length * 3) / 4 / 1024

        if (compressedSize > 500) {
          toast({
            title: "Error",
            description: "La imagen es demasiado grande incluso después de la compresión. Usa una imagen más pequeña.",
            variant: "destructive",
          })
          return
        }

        console.log("🗜️ Imagen comprimida a:", compressedSize.toFixed(2), "KB")

        // Agregar imagen comprimida
        if (isEdit) {
          setEditImages([...editImages, compressedBase64])
        } else {
          setProductImages([...productImages, compressedBase64])
        }
      } else {
        // Agregar imagen normal
        if (isEdit) {
          setEditImages([...editImages, base64Image])
        } else {
          setProductImages([...productImages, base64Image])
        }
      }

      toast({
        title: "Imagen procesada",
        description: `Archivo "${file.name}" convertido y listo para guardar`,
      })
    } catch (error) {
      console.error("❌ Error processing image:", error)
      toast({
        title: "Error",
        description: "No se pudo procesar la imagen",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      // Limpiar el input
      if (event.target) {
        event.target.value = ""
      }
    }
  }

  const addImageUrl = (isEdit = false) => {
    if (isEdit) {
      setEditImages([...editImages, ""])
    } else {
      setProductImages([...productImages, ""])
    }
  }

  const updateImageUrl = (index: number, url: string, isEdit = false) => {
    if (isEdit) {
      const newImages = [...editImages]
      newImages[index] = url
      setEditImages(newImages)
    } else {
      const newImages = [...productImages]
      newImages[index] = url
      setProductImages(newImages)
    }
  }

  const removeImageUrl = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditImages(editImages.filter((_, i) => i !== index))
    } else {
      setProductImages(productImages.filter((_, i) => i !== index))
    }
  }

  const addSpecification = (isEdit = false) => {
    if (isEdit) {
      setEditSpecifications([...editSpecifications, { key: "", value: "" }])
    } else {
      setSpecifications([...specifications, { key: "", value: "" }])
    }
  }

  const updateSpecification = (index: number, field: "key" | "value", value: string, isEdit = false) => {
    if (isEdit) {
      const newSpecs = [...editSpecifications]
      newSpecs[index][field] = value
      setEditSpecifications(newSpecs)
    } else {
      const newSpecs = [...specifications]
      newSpecs[index][field] = value
      setSpecifications(newSpecs)
    }
  }

  const removeSpecification = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditSpecifications(editSpecifications.filter((_, i) => i !== index))
    } else {
      setSpecifications(specifications.filter((_, i) => i !== index))
    }
  }

  const resetForm = () => {
    setNewProduct({})
    setProductImages([])
    setSpecifications([{ key: "", value: "" }])
  }

  const resetEditForm = () => {
    setEditingProduct(null)
    setEditImages([])
    setEditSpecifications([])
  }

  const prepareEditData = (product: Product) => {
    setEditingProduct(product)
    // Preparar imágenes para edición
    setEditImages(product.images || [product.image || ""])
    // Preparar especificaciones para edición
    if (product.specifications) {
      const specs = Object.entries(product.specifications).map(([key, value]) => ({
        key,
        value: String(value),
      }))
      setEditSpecifications(specs.length > 0 ? specs : [{ key: "", value: "" }])
    } else {
      setEditSpecifications([{ key: "", value: "" }])
    }
  }

  const addProduct = async () => {
    console.log("🚀 === INICIANDO CREACIÓN DE PRODUCTO DESDE COMPONENTS ===")
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

      // Procesar especificaciones
      const processedSpecs = {}
      specifications.forEach((spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          processedSpecs[spec.key.trim()] = spec.value.trim()
        }
      })

      // Filtrar imágenes válidas (ahora son base64 o URLs)
      const validImages = productImages.filter((img) => img.trim())
      const mainImage = validImages[0] || "/placeholder.svg?height=300&width=300"

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description?.trim() || "",
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) * 1.2,
        stock: Number(newProduct.stock) || 0,
        category: newProduct.category.trim(),
        brand: newProduct.brand?.trim() || "Sin especificar",
        image: mainImage,
        images: validImages.length > 0 ? validImages : [mainImage],
        rating: 4.5,
        reviews: 0,
        isNew: true,
        isActive: true,
        specifications: {
          Marca: newProduct.brand?.trim() || "Sin especificar",
          Descripción: newProduct.description?.trim() || "",
          ...processedSpecs,
        },
      }

      console.log("📦 Datos preparados para Firebase (imágenes en base64):", {
        ...productData,
        images: productData.images.map((img) =>
          img.startsWith("data:") ? `[BASE64 IMAGE - ${(img.length / 1024).toFixed(2)}KB]` : img,
        ),
      })

      const productId = await productosService.createProduct(productData)
      console.log("🎉 ¡PRODUCTO CREADO EXITOSAMENTE! ID:", productId)

      // Recargar productos
      await loadProducts()

      // Limpiar formulario y cerrar modal
      resetForm()
      setIsAddingProduct(false)

      toast({
        title: "¡Producto agregado!",
        description: `El producto "${productData.name}" ha sido agregado exitosamente`,
      })
    } catch (error) {
      console.error("💥 Error completo al agregar producto:", error)
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

      // Procesar especificaciones editadas
      const processedSpecs = {}
      editSpecifications.forEach((spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          processedSpecs[spec.key.trim()] = spec.value.trim()
        }
      })

      // Filtrar imágenes válidas
      const validImages = editImages.filter((img) => img.trim())
      const mainImage = validImages[0] || editingProduct.image || "/placeholder.svg?height=300&width=300"

      const updatedProduct = {
        ...editingProduct,
        image: mainImage,
        images: validImages.length > 0 ? validImages : [mainImage],
        specifications: {
          Marca: editingProduct.brand || "Sin especificar",
          Descripción: editingProduct.description || "",
          ...processedSpecs,
        },
      }

      await productosService.updateProduct(editingProduct.id!, updatedProduct)
      await loadProducts()
      resetEditForm()

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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>Completa la información del producto para agregarlo al inventario</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información básica */}
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
                  placeholder="Descripción detallada del producto"
                  value={newProduct.description || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Precios y stock */}
              <div className="grid gap-4 md:grid-cols-3">
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
                  <Label>Precio Original</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={newProduct.originalPrice || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, originalPrice: Number.parseFloat(e.target.value) || 0 })
                    }
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

              {/* Imágenes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Imágenes del Producto</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      disabled={uploadingImage}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImage ? "Procesando..." : "Subir Imagen"}
                    </Button>
                    <Button type="button" onClick={() => addImageUrl(false)} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar URL
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />

                {productImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productImages.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          {image ? (
                            <img
                              src={image.startsWith("data:") ? image : image || "/placeholder.svg"}
                              alt={`Producto ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                              <span className="ml-2 text-sm text-gray-500">Vista previa</span>
                            </div>
                          )}
                          <Button
                            type="button"
                            onClick={() => removeImageUrl(index, false)}
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {!image.startsWith("data:") && (
                          <Input
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={image}
                            onChange={(e) => updateImageUrl(index, e.target.value, false)}
                            className="text-sm"
                          />
                        )}
                        {image.startsWith("data:") && (
                          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                            ✅ Imagen procesada y lista para guardar ({((image.length * 3) / 4 / 1024).toFixed(2)} KB)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {productImages.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Sube archivos de imagen (se convertirán a base64) o agrega URLs. La primera imagen será la
                      principal.
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Las imágenes se redimensionan automáticamente y se comprimen para optimizar el almacenamiento.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Imagen
                      </Button>
                      <Button type="button" onClick={() => addImageUrl(false)} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar URL
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Especificaciones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Especificaciones Técnicas</Label>
                  <Button type="button" onClick={() => addSpecification(false)} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Especificación
                  </Button>
                </div>
                {specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Característica (ej: Procesador)"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, "key", e.target.value, false)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Valor (ej: Intel Core i7)"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, "value", e.target.value, false)}
                      />
                      <Button
                        type="button"
                        onClick={() => removeSpecification(index, false)}
                        size="sm"
                        variant="outline"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingProduct(false)
                    resetForm()
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

      {/* Estadísticas - Responsive */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Total</p>
                <p className="text-lg lg:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Package className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Activos</p>
                <p className="text-lg lg:text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Inactivos</p>
                <p className="text-lg lg:text-2xl font-bold text-red-400">{stats.inactive}</p>
              </div>
              <Package className="h-6 w-6 lg:h-8 lg:w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Stock Bajo</p>
                <p className="text-lg lg:text-2xl font-bold text-orange-400">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="h-6 w-6 lg:h-8 lg:w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Valor Total</p>
                <p className="text-sm lg:text-xl font-bold text-purple-400">${stats.totalValue.toLocaleString()}</p>
              </div>
              <Package className="h-6 w-6 lg:h-8 lg:w-8 text-purple-400" />
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

      {/* Lista de productos - Responsive Grid */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Productos ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
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
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={product.image?.startsWith("data:") ? product.image : product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-xs line-clamp-2 text-white">{product.name}</h3>
                          <div className="flex flex-col gap-1">
                            <Badge variant={product.isActive ? "default" : "secondary"} className="text-xs">
                              {product.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                            {product.stock <= 5 && (
                              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                                <AlertTriangle className="w-2 h-2" />
                                Bajo
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-white/70 line-clamp-1">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-white/80 border-white/30 text-xs">
                            {product.category}
                          </Badge>
                          <span className="text-xs font-bold text-green-400">${product.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/70">Stock: {product.stock}</span>
                          <span className="text-white/70">
                            {new Date(product.createdAt).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs p-1"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Producto</DialogTitle>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <img
                                      src={
                                        selectedProduct.image?.startsWith("data:")
                                          ? selectedProduct.image
                                          : selectedProduct.image || "/placeholder.svg"
                                      }
                                      alt={selectedProduct.name}
                                      className="w-full h-64 object-cover rounded-lg"
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                                    <p className="text-gray-600">{selectedProduct.description}</p>
                                    <div className="space-y-2">
                                      <p>
                                        <strong>Categoría:</strong> {selectedProduct.category}
                                      </p>
                                      <p>
                                        <strong>Marca:</strong> {selectedProduct.brand}
                                      </p>
                                      <p>
                                        <strong>Precio:</strong> ${selectedProduct.price.toLocaleString()}
                                      </p>
                                      <p>
                                        <strong>Stock:</strong> {selectedProduct.stock}
                                      </p>
                                      <p>
                                        <strong>Estado:</strong> {selectedProduct.isActive ? "Activo" : "Inactivo"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {selectedProduct.specifications &&
                                  Object.keys(selectedProduct.specifications).length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Especificaciones</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                                          <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                                            <span className="font-medium">{key}:</span>
                                            <span>{value}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs p-1"
                              onClick={() => prepareEditData(product)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                                  <Label>Marca</Label>
                                  <Input
                                    value={editingProduct.brand || ""}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                                  />
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
                                <div className="grid gap-4 md:grid-cols-3">
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
                                    <Label>Precio Original</Label>
                                    <Input
                                      type="number"
                                      value={editingProduct.originalPrice || ""}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          originalPrice: Number.parseFloat(e.target.value) || 0,
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

                                {/* Imágenes para edición */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label>Imágenes del Producto</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        onClick={() => editFileInputRef.current?.click()}
                                        size="sm"
                                        variant="outline"
                                        disabled={uploadingImage}
                                      >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {uploadingImage ? "Procesando..." : "Subir Imagen"}
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={() => addImageUrl(true)}
                                        size="sm"
                                        variant="outline"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar URL
                                      </Button>
                                    </div>
                                  </div>

                                  <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, true)}
                                    className="hidden"
                                  />

                                  {editImages.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {editImages.map((image, index) => (
                                        <div key={index} className="space-y-2">
                                          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            {image ? (
                                              <img
                                                src={image.startsWith("data:") ? image : image || "/placeholder.svg"}
                                                alt={`Producto ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                                                }}
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                              </div>
                                            )}
                                            <Button
                                              type="button"
                                              onClick={() => removeImageUrl(index, true)}
                                              size="sm"
                                              variant="destructive"
                                              className="absolute top-2 right-2 h-6 w-6 p-0"
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                          {!image.startsWith("data:") && (
                                            <Input
                                              placeholder="https://ejemplo.com/imagen.jpg"
                                              value={image}
                                              onChange={(e) => updateImageUrl(index, e.target.value, true)}
                                              className="text-sm"
                                            />
                                          )}
                                          {image.startsWith("data:") && (
                                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                                              ✅ Imagen procesada ({((image.length * 3) / 4 / 1024).toFixed(2)} KB)
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Especificaciones para edición */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label>Especificaciones Técnicas</Label>
                                    <Button
                                      type="button"
                                      onClick={() => addSpecification(true)}
                                      size="sm"
                                      variant="outline"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Agregar Especificación
                                    </Button>
                                  </div>
                                  {editSpecifications.map((spec, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-2">
                                      <Input
                                        placeholder="Característica (ej: Procesador)"
                                        value={spec.key}
                                        onChange={(e) => updateSpecification(index, "key", e.target.value, true)}
                                      />
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Valor (ej: Intel Core i7)"
                                          value={spec.value}
                                          onChange={(e) => updateSpecification(index, "value", e.target.value, true)}
                                        />
                                        <Button
                                          type="button"
                                          onClick={() => removeSpecification(index, true)}
                                          size="sm"
                                          variant="outline"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={resetEditForm}>
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
                          className="text-xs p-1"
                        >
                          {product.isActive ? "Des" : "Act"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(product.id!)}
                          className="p-1"
                        >
                          <Trash2 className="h-3 w-3" />
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
