import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  limit,
} from "firebase/firestore"
import { db } from "./firebase"

// Generic type for services
interface Service {
  id?: string
  createdAt?: any
  updatedAt?: any
}

// Helper function to create a service object
const createServiceObject = <T extends Service>(doc: any): T => {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  } as T
}

// Generic service functions
const createService = async <T extends Service>(
  collectionName: string,
  data: Omit<T, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    console.log(`🔥 Creando documento en colección '${collectionName}':`, data)

    // Verificar que db esté disponible
    if (!db) {
      throw new Error("Firebase db no está inicializado")
    }

    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Documento creado exitosamente en '${collectionName}' con ID:`, docRef.id)
    return docRef.id
  } catch (error) {
    console.error(`❌ Error creating ${collectionName} document:`, error)
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      name: error.name,
    })
    throw error
  }
}

const getAllServices = async <T extends Service>(collectionName: string): Promise<T[]> => {
  try {
    console.log(`📦 Obteniendo documentos de colección '${collectionName}'...`)

    if (!db) {
      throw new Error("Firebase db no está inicializado")
    }

    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    console.log(`✅ Documentos obtenidos de '${collectionName}':`, querySnapshot.size)

    const results = querySnapshot.docs.map((doc) => createServiceObject<T>(doc))
    console.log(`📄 Datos procesados:`, results)

    return results
  } catch (error) {
    console.error(`❌ Error getting all ${collectionName} documents:`, error)
    throw error
  }
}

const getServiceById = async <T extends Service>(collectionName: string, id: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return createServiceObject<T>(docSnap)
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error getting ${collectionName} document with id ${id}:`, error)
    throw error
  }
}

const updateService = async <T extends Service>(
  collectionName: string,
  id: string,
  data: Partial<T>,
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error(`Error updating ${collectionName} document with id ${id}:`, error)
    throw error
  }
}

const deleteService = async (collectionName: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting ${collectionName} document with id ${id}:`, error)
    throw error
  }
}

// Specific service interfaces
export interface Turno extends Service {
  name: string
  phone: string
  serviceName: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  userId?: string
  serviceId?: string
  servicePrice?: number
  serviceDuration?: number
  address?: string
  notes?: string
  cancelledAt?: any
}

export interface Servicio extends Service {
  clientName: string
  clientPhone: string
  serviceType: string
  date: string
  price: string
  completed: boolean
  notes: string
}

export interface Venta extends Service {
  productName: string
  clientName: string
  clientPhone: string
  quantity: number
  unitPrice: string
  totalPrice: string
  date: string
  notes: string
}

export interface Mensaje extends Service {
  nombre: string
  telefono: string
  email: string
  mensaje: string
  serviceType: string
  status: "unread" | "read" | "responded"
  empresa?: string
  servicio?: string
  urgencia?: string
  asunto?: string
  comoConociste?: string
}

export interface Usuario extends Service {
  name: string
  email: string
  phone: string
  role: string
}

export interface Product extends Service {
  name: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  category: string
  brand?: string
  image: string
  images?: string[]
  rating?: number
  reviews?: number
  isNew?: boolean
  isActive?: boolean
  specifications?: Record<string, string>
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface Cart extends Service {
  userId: string
  items: CartItem[]
  total: number
  status: "active" | "completed" | "abandoned"
}

export interface Perfil extends Service {
  userId: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
}

// Specific service implementations
export const turnosService = {
  createAppointment: (data: Omit<Turno, "id" | "createdAt" | "updatedAt">) => createService<Turno>("turnos", data),
  getAllAppointments: () => getAllServices<Turno>("turnos"),
  getAppointmentById: (id: string) => getServiceById<Turno>("turnos", id),
  updateAppointment: (id: string, data: Partial<Turno>) => updateService<Turno>("turnos", id, data),
  deleteAppointment: (id: string) => deleteService("turnos", id),

  // NUEVA FUNCIÓN: getUserAppointments
  getUserAppointments: async (userId: string): Promise<Turno[]> => {
    console.log("👤 === OBTENIENDO TURNOS DEL USUARIO ===", userId)
    try {
      if (!db) {
        throw new Error("Firebase db no está inicializado")
      }

      const q = query(collection(db, "turnos"), where("userId", "==", userId), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      console.log(`✅ Turnos del usuario obtenidos:`, querySnapshot.size)

      const appointments = querySnapshot.docs.map((doc) => createServiceObject<Turno>(doc))
      console.log(`📄 Turnos procesados:`, appointments)

      return appointments
    } catch (error) {
      console.error("❌ Error obteniendo turnos del usuario:", error)
      throw error
    }
  },

  // NUEVA FUNCIÓN: cancelAppointment
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    console.log("❌ === CANCELANDO TURNO ===", appointmentId)
    try {
      const docRef = doc(db, "turnos", appointmentId)
      await updateDoc(docRef, {
        status: "cancelled",
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log("✅ Turno cancelado exitosamente")
    } catch (error) {
      console.error("❌ Error cancelando turno:", error)
      throw error
    }
  },

  updateAppointmentStatus: async (id: string, status: Turno["status"]): Promise<void> => {
    try {
      const docRef = doc(db, "turnos", id)
      await updateDoc(docRef, { status, updatedAt: serverTimestamp() })
    } catch (error) {
      console.error("Error updating appointment status:", error)
      throw error
    }
  },
}

export const servicioService = {
  createService: (data: Omit<Servicio, "id" | "createdAt" | "updatedAt">) => createService<Servicio>("servicios", data),
  getAllServices: () => getAllServices<Servicio>("servicios"),
  getServiceById: (id: string) => getServiceById<Servicio>("servicios", id),
  updateService: (id: string, data: Partial<Servicio>) => updateService<Servicio>("servicios", id, data),
  deleteService: (id: string) => deleteService("servicios", id),
}

export const ventasService = {
  createSale: (data: Omit<Venta, "id" | "createdAt" | "updatedAt">) => createService<Venta>("ventas", data),
  getAllSales: () => getAllServices<Venta>("ventas"),
  getSaleById: (id: string) => getServiceById<Venta>("ventas", id),
  updateSale: (id: string, data: Partial<Venta>) => updateService<Venta>("ventas", id, data),
  deleteSale: (id: string) => deleteService("ventas", id),
}

export const mensajeService = {
  createMessage: async (data: Omit<Mensaje, "id" | "createdAt" | "updatedAt">): Promise<string> => {
    console.log("💬 === CREANDO MENSAJE ===", data)
    try {
      // Agregar status por defecto
      const messageData = {
        ...data,
        status: "unread" as const,
      }

      const messageId = await createService<Mensaje>("mensajes", messageData)
      console.log("✅ Mensaje creado exitosamente con ID:", messageId)
      return messageId
    } catch (error) {
      console.error("❌ Error creando mensaje:", error)
      throw error
    }
  },
  getMessages: () => getAllServices<Mensaje>("mensajes"),
  getMessageById: (id: string) => getServiceById<Mensaje>("mensajes", id),
  updateMessage: (id: string, data: Partial<Mensaje>) => updateService<Mensaje>("mensajes", id, data),
  deleteMessage: (id: string) => deleteService("mensajes", id),
  updateMessageStatus: async (id: string, status: Mensaje["status"]): Promise<void> => {
    try {
      const docRef = doc(db, "mensajes", id)
      await updateDoc(docRef, { status, updatedAt: serverTimestamp() })
    } catch (error) {
      console.error("Error updating message status:", error)
      throw error
    }
  },
}

export const usuarioService = {
  createUser: (data: Omit<Usuario, "id" | "createdAt" | "updatedAt">) => createService<Usuario>("usuarios", data),
  getAllUsers: () => getAllServices<Usuario>("usuarios"),
  getUserById: (id: string) => getServiceById<Usuario>("usuarios", id),
  updateUser: (id: string, data: Partial<Usuario>) => updateService<Usuario>("usuarios", id, data),
  deleteUser: (id: string) => deleteService("usuarios", id),
  updateUserStatus: async (id: string, isActive: boolean): Promise<void> => {
    try {
      const docRef = doc(db, "usuarios", id)
      await updateDoc(docRef, { isActive, updatedAt: serverTimestamp() })
    } catch (error) {
      console.error("Error updating user status:", error)
      throw error
    }
  },
}

// NUEVO: PERFIL SERVICE
export const perfilService = {
  getUserProfile: async (userId: string): Promise<Perfil | null> => {
    console.log("👤 === OBTENIENDO PERFIL DEL USUARIO ===", userId)
    try {
      if (!db) {
        throw new Error("Firebase db no está inicializado")
      }

      const q = query(collection(db, "perfiles"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.log("📭 No se encontró perfil para el usuario")
        return null
      }

      const profileDoc = querySnapshot.docs[0]
      const profile = createServiceObject<Perfil>(profileDoc)
      console.log("✅ Perfil encontrado:", profile)
      return profile
    } catch (error) {
      console.error("❌ Error obteniendo perfil:", error)
      throw error
    }
  },

  updateProfile: async (userId: string, profileData: Partial<Perfil>): Promise<void> => {
    console.log("📝 === ACTUALIZANDO PERFIL ===", { userId, profileData })
    try {
      if (!db) {
        throw new Error("Firebase db no está inicializado")
      }

      // Buscar perfil existente
      const q = query(collection(db, "perfiles"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        // Crear nuevo perfil
        const newProfile = {
          userId,
          ...profileData,
        }
        await createService<Perfil>("perfiles", newProfile)
        console.log("✅ Nuevo perfil creado")
      } else {
        // Actualizar perfil existente
        const profileDoc = querySnapshot.docs[0]
        await updateService<Perfil>("perfiles", profileDoc.id, profileData)
        console.log("✅ Perfil actualizado")
      }
    } catch (error) {
      console.error("❌ Error actualizando perfil:", error)
      throw error
    }
  },

  createProfile: async (profileData: Omit<Perfil, "id" | "createdAt" | "updatedAt">): Promise<string> => {
    console.log("🆕 === CREANDO PERFIL ===", profileData)
    try {
      const profileId = await createService<Perfil>("perfiles", profileData)
      console.log("✅ Perfil creado con ID:", profileId)
      return profileId
    } catch (error) {
      console.error("❌ Error creando perfil:", error)
      throw error
    }
  },
}

// PRODUCTOS SERVICE - CON LOGS DETALLADOS
export const productosService = {
  createProduct: async (data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> => {
    console.log("🚀 === INICIANDO CREACIÓN DE PRODUCTO ===")
    console.log("📝 Datos recibidos:", data)

    try {
      // Verificar Firebase
      console.log("🔍 Verificando Firebase...")
      if (!db) {
        throw new Error("❌ Firebase db no está inicializado")
      }
      console.log("✅ Firebase db disponible")

      // Preparar datos
      const productData = {
        name: data.name,
        description: data.description || "",
        price: Number(data.price),
        originalPrice: data.originalPrice || Number(data.price) * 1.2,
        stock: Number(data.stock) || 0,
        category: data.category,
        brand: data.brand || "Sin especificar",
        image: data.image || "/placeholder.svg?height=300&width=300",
        images: data.images || [data.image || "/placeholder.svg?height=600&width=600"],
        rating: data.rating || 4.5,
        reviews: data.reviews || 0,
        isNew: data.isNew !== undefined ? data.isNew : true,
        isActive: data.isActive !== undefined ? data.isActive : true,
        specifications: data.specifications || {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      console.log("📦 Datos preparados para Firebase:", productData)

      // Crear documento
      console.log("💾 Creando documento en colección 'productos'...")
      const docRef = await addDoc(collection(db, "productos"), productData)

      console.log("🎉 ¡PRODUCTO CREADO EXITOSAMENTE!")
      console.log("🆔 ID del documento:", docRef.id)
      console.log("📍 Path completo:", docRef.path)

      return docRef.id
    } catch (error) {
      console.error("💥 === ERROR AL CREAR PRODUCTO ===")
      console.error("❌ Error completo:", error)
      console.error("🔍 Tipo de error:", typeof error)
      console.error("📋 Error code:", error.code)
      console.error("📝 Error message:", error.message)
      console.error("🗂️ Error stack:", error.stack)
      throw error
    }
  },

  getAllProducts: async (): Promise<Product[]> => {
    console.log("📋 === OBTENIENDO TODOS LOS PRODUCTOS ===")
    return getAllServices<Product>("productos")
  },

  getActiveProducts: async (): Promise<Product[]> => {
    console.log("🟢 === OBTENIENDO PRODUCTOS ACTIVOS ===")
    try {
      if (!db) {
        throw new Error("Firebase db no está inicializado")
      }

      console.log("🔍 Creando query para productos activos...")
      const q = query(collection(db, "productos"), where("isActive", "==", true), orderBy("createdAt", "desc"))

      console.log("📡 Ejecutando query...")
      const querySnapshot = await getDocs(q)

      console.log("📊 Resultados obtenidos:", querySnapshot.size)

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Product[]

      console.log("✅ Productos procesados:", products.length)
      console.log("📄 Primer producto:", products[0])

      return products
    } catch (error) {
      console.error("❌ Error obteniendo productos activos:", error)
      throw error
    }
  },

  // NUEVA FUNCIÓN: getFeaturedProducts
  getFeaturedProducts: async (): Promise<Product[]> => {
    console.log("⭐ === OBTENIENDO PRODUCTOS DESTACADOS ===")
    try {
      if (!db) {
        throw new Error("Firebase db no está inicializado")
      }

      console.log("🔍 Creando query para productos destacados...")
      const q = query(
        collection(db, "productos"),
        where("isActive", "==", true),
        where("isNew", "==", true),
        orderBy("createdAt", "desc"),
        limit(6),
      )

      console.log("📡 Ejecutando query...")
      const querySnapshot = await getDocs(q)

      console.log("📊 Productos destacados obtenidos:", querySnapshot.size)

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Product[]

      console.log("✅ Productos destacados procesados:", products.length)
      return products
    } catch (error) {
      console.error("❌ Error obteniendo productos destacados:", error)
      // Fallback: devolver productos activos limitados
      try {
        const q = query(
          collection(db, "productos"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(6),
        )
        const querySnapshot = await getDocs(q)
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as Product[]

        console.log("✅ Fallback: productos activos obtenidos:", products.length)
        return products
      } catch (fallbackError) {
        console.error("❌ Error en fallback:", fallbackError)
        return []
      }
    }
  },

  updateProduct: (id: string, data: Partial<Product>) => updateService<Product>("productos", id, data),
  deleteProduct: (id: string) => deleteService("productos", id),

  toggleProductStatus: async (productId: string, isActive: boolean): Promise<void> => {
    try {
      const productRef = doc(db, "productos", productId)
      await updateDoc(productRef, { isActive, updatedAt: serverTimestamp() })
    } catch (error) {
      console.error("Error toggling product status:", error)
      throw error
    }
  },
}

// CARRITO SERVICE - FIREBASE INTEGRATION
export const carritoService = {
  // Crear carrito para usuario
  createUserCart: async (userId: string): Promise<string> => {
    console.log("🛒 === CREANDO CARRITO PARA USUARIO ===", userId)
    try {
      const cartData = {
        userId,
        items: [],
        total: 0,
        status: "active" as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "carrito"), cartData)
      console.log("✅ Carrito creado con ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("❌ Error creando carrito:", error)
      throw error
    }
  },

  // Obtener carrito del usuario
  getUserCart: async (userId: string): Promise<Cart | null> => {
    console.log("🔍 === OBTENIENDO CARRITO DEL USUARIO ===", userId)
    try {
      const q = query(collection(db, "carrito"), where("userId", "==", userId), where("status", "==", "active"))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.log("📭 No se encontró carrito activo para el usuario")
        return null
      }

      const cartDoc = querySnapshot.docs[0]
      const cart = createServiceObject<Cart>(cartDoc)
      console.log("✅ Carrito encontrado:", cart)
      return cart
    } catch (error) {
      console.error("❌ Error obteniendo carrito:", error)
      throw error
    }
  },

  // Agregar producto al carrito
  addToCart: async (userId: string, product: Product, quantity = 1): Promise<void> => {
    console.log("➕ === AGREGANDO PRODUCTO AL CARRITO ===", { userId, productId: product.id, quantity })
    try {
      let userCart = await carritoService.getUserCart(userId)

      if (!userCart) {
        const cartId = await carritoService.createUserCart(userId)
        userCart = await carritoService.getCartById(cartId)
      }

      if (!userCart) {
        throw new Error("No se pudo crear o encontrar el carrito")
      }

      const existingItemIndex = userCart.items.findIndex((item) => item.productId === product.id)
      const updatedItems = [...userCart.items]

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si el producto ya existe
        updatedItems[existingItemIndex].quantity += quantity
      } else {
        // Agregar nuevo producto
        const newItem: CartItem = {
          productId: product.id!,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          category: product.category,
        }
        updatedItems.push(newItem)
      }

      await carritoService.updateCart(userCart.id!, updatedItems)
      console.log("✅ Producto agregado al carrito exitosamente")
    } catch (error) {
      console.error("❌ Error agregando producto al carrito:", error)
      throw error
    }
  },

  // Actualizar carrito
  updateCart: async (cartId: string, items: CartItem[]): Promise<void> => {
    console.log("🔄 === ACTUALIZANDO CARRITO ===", { cartId, itemsCount: items.length })
    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      const cartRef = doc(db, "carrito", cartId)
      await updateDoc(cartRef, {
        items,
        total,
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Carrito actualizado exitosamente")
    } catch (error) {
      console.error("❌ Error actualizando carrito:", error)
      throw error
    }
  },

  // Obtener carrito por ID
  getCartById: async (cartId: string): Promise<Cart | null> => {
    return getServiceById<Cart>("carrito", cartId)
  },

  // Eliminar producto del carrito
  removeFromCart: async (userId: string, productId: string): Promise<void> => {
    console.log("🗑️ === ELIMINANDO PRODUCTO DEL CARRITO ===", { userId, productId })
    try {
      const userCart = await carritoService.getUserCart(userId)
      if (!userCart) {
        throw new Error("Carrito no encontrado")
      }

      const updatedItems = userCart.items.filter((item) => item.productId !== productId)
      await carritoService.updateCart(userCart.id!, updatedItems)
      console.log("✅ Producto eliminado del carrito")
    } catch (error) {
      console.error("❌ Error eliminando producto del carrito:", error)
      throw error
    }
  },

  // Actualizar cantidad de producto
  updateQuantity: async (userId: string, productId: string, quantity: number): Promise<void> => {
    console.log("📊 === ACTUALIZANDO CANTIDAD ===", { userId, productId, quantity })
    try {
      if (quantity <= 0) {
        await carritoService.removeFromCart(userId, productId)
        return
      }

      const userCart = await carritoService.getUserCart(userId)
      if (!userCart) {
        throw new Error("Carrito no encontrado")
      }

      const updatedItems = userCart.items.map((item) => (item.productId === productId ? { ...item, quantity } : item))

      await carritoService.updateCart(userCart.id!, updatedItems)
      console.log("✅ Cantidad actualizada")
    } catch (error) {
      console.error("❌ Error actualizando cantidad:", error)
      throw error
    }
  },

  // Limpiar carrito
  clearCart: async (userId: string): Promise<void> => {
    console.log("🧹 === LIMPIANDO CARRITO ===", userId)
    try {
      const userCart = await carritoService.getUserCart(userId)
      if (!userCart) {
        return
      }

      await carritoService.updateCart(userCart.id!, [])
      console.log("✅ Carrito limpiado")
    } catch (error) {
      console.error("❌ Error limpiando carrito:", error)
      throw error
    }
  },

  // Completar carrito (checkout)
  completeCart: async (userId: string): Promise<void> => {
    console.log("✅ === COMPLETANDO CARRITO ===", userId)
    try {
      const userCart = await carritoService.getUserCart(userId)
      if (!userCart) {
        throw new Error("Carrito no encontrado")
      }

      const cartRef = doc(db, "carrito", userCart.id!)
      await updateDoc(cartRef, {
        status: "completed",
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Carrito completado")
    } catch (error) {
      console.error("❌ Error completando carrito:", error)
      throw error
    }
  },
}

// Cart Service (Legacy - for backward compatibility)
export const cartService = {
  getCart() {
    if (typeof window !== "undefined") {
      const cart = localStorage.getItem("servitec_cart")
      return cart ? JSON.parse(cart) : []
    }
    return []
  },

  addToCart(product: Product) {
    if (typeof window !== "undefined") {
      const cart = this.getCart()
      const existingItem = cart.find((item: any) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({ ...product, quantity: 1 })
      }

      localStorage.setItem("servitec_cart", JSON.stringify(cart))
    }
  },

  removeFromCart(productId: string) {
    if (typeof window !== "undefined") {
      const cart = this.getCart()
      const updatedCart = cart.filter((item: any) => item.id !== productId)
      localStorage.setItem("servitec_cart", JSON.stringify(updatedCart))
    }
  },

  updateQuantity(productId: string, quantity: number) {
    if (typeof window !== "undefined") {
      const cart = this.getCart()
      const item = cart.find((item: any) => item.id === productId)

      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
          localStorage.setItem("servitec_cart", JSON.stringify(cart))
        }
      }
    }
  },

  clearCart() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("servitec_cart")
    }
  },

  getCartTotal() {
    const cart = this.getCart()
    return cart.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
  },

  getCartItemsCount() {
    const cart = this.getCart()
    return cart.reduce((count: number, item: any) => count + item.quantity, 0)
  },
}
