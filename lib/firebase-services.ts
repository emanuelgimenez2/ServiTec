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
  setDoc,
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
  isActive?: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand?: string
  image: string
  images?: string[]
  stock: number
  isActive: boolean
  isNew?: boolean
  rating?: number
  reviews?: number
  specifications?: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "active" | "completed"
  compraNumber?: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  id?: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: string
  paymentMethod: string
  createdAt?: any
  updatedAt?: any
}

export interface Perfil extends Service {
  userId: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
  emailNotificaciones?: string
}

// Specific service implementations
export const turnosService = {
  createAppointment: (data: Omit<Turno, "id" | "createdAt" | "updatedAt">) => createService<Turno>("turnos", data),
  getAllAppointments: () => getAllServices<Turno>("turnos"),
  getAppointmentById: (id: string) => getServiceById<Turno>("turnos", id),
  updateAppointment: (id: string, data: Partial<Turno>) => updateService<Turno>("turnos", id, data),
  deleteAppointment: (id: string) => deleteService("turnos", id),

  getUserAppointments: async (userId: string): Promise<Turno[]> => {
    console.log("👤 === OBTENIENDO TURNOS DEL USUARIO ===", userId)
    try {
      if (!db) {
        throw new Error("Firebase db no está inicializado")
      }

      const q = query(collection(db, "turnos"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)

      console.log(`✅ Turnos del usuario obtenidos:`, querySnapshot.size)

      const appointments = querySnapshot.docs.map((doc) => createServiceObject<Turno>(doc))
      console.log(`📄 Turnos procesados:`, appointments)

      return appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (error) {
      console.error("❌ Error obteniendo turnos del usuario:", error)
      throw error
    }
  },

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

export const perfilService = {
  getUserProfile: async (userId: string): Promise<Perfil | null> => {
    console.log("👤 === OBTENIENDO PERFIL DEL USUARIO ===", userId)
    try {
      if (!db) {
        throw new Error("Firebase db no está inicializado")
      }

      const q = query(collection(db, "perfil"), where("userId", "==", userId))
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

      const q = query(collection(db, "perfil"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        const newProfile = {
          userId,
          ...profileData,
        }
        await createService<Perfil>("perfil", newProfile)
        console.log("✅ Nuevo perfil creado")
      } else {
        const profileDoc = querySnapshot.docs[0]
        await updateService<Perfil>("perfil", profileDoc.id, profileData)
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
      const profileId = await createService<Perfil>("perfil", profileData)
      console.log("✅ Perfil creado con ID:", profileId)
      return profileId
    } catch (error) {
      console.error("❌ Error creando perfil:", error)
      throw error
    }
  },

  subscribeToNewsletter: async (userId: string, email: string): Promise<void> => {
    console.log("📧 === SUSCRIBIENDO A NEWSLETTER ===", { userId, email })
    try {
      await perfilService.updateProfile(userId, { emailNotificaciones: email })
      console.log("✅ Suscripción a newsletter exitosa")
    } catch (error) {
      console.error("❌ Error suscribiendo a newsletter:", error)
      throw error
    }
  },
}

export const productosService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log("🔥 Obteniendo todos los productos...")
      const querySnapshot = await getDocs(collection(db, "productos"))
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Product[]

      console.log(`✅ ${products.length} productos obtenidos`)
      return products
    } catch (error) {
      console.error("❌ Error obteniendo productos:", error)
      throw error
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, "productos", id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Product
      }

      return null
    } catch (error) {
      console.error("Error obteniendo producto:", error)
      throw error
    }
  },

  async createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "productos"), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creando producto:", error)
      throw error
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, "productos", id)
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error actualizando producto:", error)
      throw error
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "productos", id))
    } catch (error) {
      console.error("Error eliminando producto:", error)
      throw error
    }
  },

  updateStock: async (productId: string, newStock: number): Promise<void> => {
    try {
      const docRef = doc(db, "productos", productId)
      await updateDoc(docRef, {
        stock: newStock,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error actualizando stock:", error)
      throw error
    }
  },
}

// Helper function to generate cart document name - ARREGLADO
const generateCartDocumentName = (userName: string, compraNumber: number): string => {
  // Validar que userName existe y no es undefined/null
  if (!userName || typeof userName !== "string") {
    console.warn("⚠️ userName es undefined o inválido, usando 'usuario' por defecto")
    userName = "usuario"
  }

  // Limpiar el nombre del usuario (remover espacios, caracteres especiales)
  const cleanName = userName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 20) // Limitar longitud

  return `${cleanName || "usuario"}-compra${compraNumber}`
}

export const carritoService = {
  async getUserCart(userId: string): Promise<Cart | null> {
    try {
      console.log("🛒 Obteniendo carrito para usuario:", userId)

      // Buscar carrito activo del usuario - Query simplificada
      const q = query(collection(db, "carrito"), where("userId", "==", userId), where("status", "==", "active"))

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // Ordenar por fecha de creación en el cliente
        const docs = querySnapshot.docs.sort((a, b) => {
          const aTime = a.data().createdAt?.toDate?.()?.getTime() || 0
          const bTime = b.data().createdAt?.toDate?.()?.getTime() || 0
          return bTime - aTime
        })

        const doc = docs[0]
        const cartData = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Cart

        console.log("✅ Carrito encontrado:", cartData.id, "Items:", cartData.items.length)
        return cartData
      }

      console.log("ℹ️ No se encontró carrito activo, creando uno nuevo...")
      return await this.createUserCart(userId)
    } catch (error) {
      console.error("❌ Error obteniendo carrito:", error)
      throw error
    }
  },

  async createUserCart(userId: string): Promise<Cart> {
    try {
      console.log("🆕 Creando nuevo carrito para usuario:", userId)

      const newCart = {
        userId,
        items: [],
        total: 0,
        status: "active" as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "carrito"), newCart)

      const cart: Cart = {
        id: docRef.id,
        userId,
        items: [],
        total: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log("✅ Carrito creado:", cart.id)
      return cart
    } catch (error) {
      console.error("❌ Error creando carrito:", error)
      throw error
    }
  },

  async addToCart(userId: string, product: Product, quantity = 1): Promise<void> {
    try {
      console.log("➕ Agregando al carrito:", { userId, productId: product.id, quantity })

      let cart = await this.getUserCart(userId)
      if (!cart) {
        cart = await this.createUserCart(userId)
      }

      // Verificar stock disponible
      if (product.stock < quantity) {
        throw new Error("Stock insuficiente")
      }

      // Buscar si el producto ya existe en el carrito
      const existingItemIndex = cart.items.findIndex((item) => item.productId === product.id)

      if (existingItemIndex >= 0) {
        // Verificar cuánto stock ya está en el carrito
        const currentQuantityInCart = cart.items[existingItemIndex].quantity
        const newQuantity = currentQuantityInCart + quantity

        // Verificar que no exceda el stock disponible
        if (newQuantity > product.stock) {
          throw new Error(
            `Ya agregaste ${currentQuantityInCart} unidades de este producto. Solo tenemos ${product.stock} en stock.`,
          )
        }

        cart.items[existingItemIndex].quantity = newQuantity
      } else {
        // Agregar nuevo producto al carrito
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          category: product.category,
        }
        cart.items.push(newItem)
      }

      // Recalcular total
      cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Actualizar en Firebase
      const cartRef = doc(db, "carrito", cart.id)
      await updateDoc(cartRef, {
        items: cart.items,
        total: cart.total,
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Producto agregado al carrito exitosamente")
    } catch (error) {
      console.error("❌ Error agregando al carrito:", error)
      throw error
    }
  },

  async updateQuantity(userId: string, productId: string, newQuantity: number): Promise<void> {
    try {
      console.log("📊 Actualizando cantidad:", { userId, productId, newQuantity })

      const cart = await this.getUserCart(userId)
      if (!cart) throw new Error("Carrito no encontrado")

      const itemIndex = cart.items.findIndex((item) => item.productId === productId)
      if (itemIndex === -1) throw new Error("Producto no encontrado en el carrito")

      if (newQuantity <= 0) {
        // Eliminar producto si la cantidad es 0 o menor
        cart.items.splice(itemIndex, 1)
      } else {
        // Actualizar cantidad
        cart.items[itemIndex].quantity = newQuantity
      }

      // Recalcular total
      cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Actualizar en Firebase
      const cartRef = doc(db, "carrito", cart.id)
      await updateDoc(cartRef, {
        items: cart.items,
        total: cart.total,
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Cantidad actualizada exitosamente")
    } catch (error) {
      console.error("❌ Error actualizando cantidad:", error)
      throw error
    }
  },

  async removeFromCart(userId: string, productId: string): Promise<void> {
    try {
      console.log("🗑️ Eliminando del carrito:", { userId, productId })

      const cart = await this.getUserCart(userId)
      if (!cart) throw new Error("Carrito no encontrado")

      // Filtrar el producto a eliminar
      cart.items = cart.items.filter((item) => item.productId !== productId)

      // Recalcular total
      cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Actualizar en Firebase
      const cartRef = doc(db, "carrito", cart.id)
      await updateDoc(cartRef, {
        items: cart.items,
        total: cart.total,
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Producto eliminado del carrito exitosamente")
    } catch (error) {
      console.error("❌ Error eliminando del carrito:", error)
      throw error
    }
  },

  async clearCart(userId: string): Promise<void> {
    try {
      console.log("🧹 Limpiando carrito:", userId)

      const cart = await this.getUserCart(userId)
      if (!cart) throw new Error("Carrito no encontrado")

      // Limpiar items y total
      const cartRef = doc(db, "carrito", cart.id)
      await updateDoc(cartRef, {
        items: [],
        total: 0,
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Carrito limpiado exitosamente")
    } catch (error) {
      console.error("❌ Error limpiando carrito:", error)
      throw error
    }
  },

  async completeCart(userId: string, userName?: string): Promise<void> {
    try {
      console.log("✅ Completando carrito:", { userId, userName })

      const cart = await this.getUserCart(userId)
      if (!cart) throw new Error("Carrito no encontrado")

      // Obtener el número de compra actual del usuario - Query simplificada
      const userCartsQuery = query(collection(db, "carrito"), where("userId", "==", userId))

      const allCarts = await getDocs(userCartsQuery)
      const completedCarts = allCarts.docs.filter((doc) => doc.data().status === "completed")
      const compraNumber = completedCarts.length + 1

      // Generar nombre del documento - ARREGLADO
      const documentName = generateCartDocumentName(userName || "usuario ", userName, compraNumber)

      // Crear nuevo documento con nombre personalizado
      const cartData = {
        userId,
        items: cart.items,
        total: cart.total,
        status: "completed",
        compraNumber: compraNumber,
        userName: userName || "usuario",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Crear documento con ID personalizado
      const customDocRef = doc(db, "carrito", documentName)
      await setDoc(customDocRef, cartData)

      // Eliminar el carrito activo original
      const cartRef = doc(db, "carrito", cart.id)
      await deleteDoc(cartRef)

      console.log("✅ Carrito completado exitosamente con nombre:", documentName)
    } catch (error) {
      console.error("❌ Error completando carrito:", error)
      throw error
    }
  },
}

export const pedidosService = {
  async createOrder(orderData: Order): Promise<string> {
    try {
      console.log("📦 Creando nuevo pedido...")

      const docRef = await addDoc(collection(db, "pedidos"), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Pedido creado:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("❌ Error creando pedido:", error)
      throw error
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      console.log("📋 Obteniendo todos los pedidos...")
      const querySnapshot = await getDocs(collection(db, "pedidos"))

      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Order[]

      // Ordenar por fecha de creación en el cliente
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      console.log(`✅ ${orders.length} pedidos obtenidos`)
      return orders
    } catch (error) {
      console.error("❌ Error obteniendo pedidos:", error)
      throw error
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      console.log("📋 Obteniendo pedidos del usuario:", userId)

      const q = query(collection(db, "pedidos"), where("userId", "==", userId))

      const querySnapshot = await getDocs(q)
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Order[]

      // Ordenar por fecha de creación en el cliente
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      console.log(`✅ ${orders.length} pedidos obtenidos`)
      return orders
    } catch (error) {
      console.error("❌ Error obteniendo pedidos:", error)
      throw error
    }
  },

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
    try {
      console.log("📝 Actualizando estado del pedido:", { orderId, status })

      const orderRef = doc(db, "pedidos", orderId)
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Estado del pedido actualizado")
    } catch (error) {
      console.error("❌ Error actualizando estado del pedido:", error)
      throw error
    }
  },

  async updateOrder(orderId: string, orderData: Partial<Order>): Promise<void> {
    try {
      console.log("📝 Actualizando pedido:", { orderId, orderData })

      const orderRef = doc(db, "pedidos", orderId)
      await updateDoc(orderRef, {
        ...orderData,
        updatedAt: serverTimestamp(),
      })

      console.log("✅ Pedido actualizado")
    } catch (error) {
      console.error("❌ Error actualizando pedido:", error)
      throw error
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    try {
      console.log("🗑️ Eliminando pedido:", orderId)

      const orderRef = doc(db, "pedidos", orderId)
      await deleteDoc(orderRef)

      console.log("✅ Pedido eliminado")
    } catch (error) {
      console.error("❌ Error eliminando pedido:", error)
      throw error
    }
  },
}

// Servicio para lista de deseos (favoritos) - ARREGLADO
export const listaDeseosService = {
  async getUserWishlist(userId: string): Promise<string[]> {
    try {
      console.log("❤️ Obteniendo lista de deseos para usuario:", userId)

      const wishlistRef = doc(db, "lista-de-deseos", userId)
      const wishlistDoc = await getDoc(wishlistRef)

      if (wishlistDoc.exists()) {
        const productos = wishlistDoc.data().productos || []
        console.log("✅ Lista de deseos encontrada:", productos.length, "productos")
        return productos
      } else {
        console.log("📭 No se encontró lista de deseos, creando una nueva...")
        return []
      }
    } catch (error) {
      console.error("❌ Error obteniendo lista de deseos:", error)
      throw error
    }
  },

  async addToWishlist(userId: string, productId: string): Promise<void> {
    try {
      console.log("➕ Agregando a lista de deseos:", { userId, productId })

      const wishlistRef = doc(db, "lista-de-deseos", userId)
      const wishlistDoc = await getDoc(wishlistRef)

      let productos: string[] = []
      if (wishlistDoc.exists()) {
        productos = wishlistDoc.data().productos || []
      }

      // Verificar si el producto ya está en la lista
      if (!productos.includes(productId)) {
        productos.push(productId)

        await setDoc(
          wishlistRef,
          {
            userId,
            productos,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )

        console.log("✅ Producto agregado a lista de deseos")
      } else {
        console.log("ℹ️ Producto ya está en la lista de deseos")
      }
    } catch (error) {
      console.error("❌ Error agregando a lista de deseos:", error)
      throw error
    }
  },

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    try {
      console.log("🗑️ Eliminando de lista de deseos:", { userId, productId })

      const wishlistRef = doc(db, "lista-de-deseos", userId)
      const wishlistDoc = await getDoc(wishlistRef)

      if (wishlistDoc.exists()) {
        const productos = wishlistDoc.data().productos || []
        const updatedProductos = productos.filter((id: string) => id !== productId)

        await setDoc(
          wishlistRef,
          {
            userId,
            productos: updatedProductos,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )

        console.log("✅ Producto eliminado de lista de deseos")
      }
    } catch (error) {
      console.error("❌ Error eliminando de lista de deseos:", error)
      throw error
    }
  },

  async updateWishlist(userId: string, productos: string[]): Promise<void> {
    try {
      console.log("📝 Actualizando lista de deseos:", { userId, productos })

      const wishlistRef = doc(db, "lista-de-deseos", userId)
      await setDoc(
        wishlistRef,
        {
          userId,
          productos,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      console.log("✅ Lista de deseos actualizada")
    } catch (error) {
      console.error("❌ Error actualizando lista de deseos:", error)
      throw error
    }
  },
}
