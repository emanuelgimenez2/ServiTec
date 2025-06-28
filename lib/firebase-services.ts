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
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// Interfaces
export interface User {
  id?: string
  name: string
  email: string
  phone: string
  role: "usuario" | "administrador"
  createdAt: string
}

export interface Appointment {
  id?: string
  name: string
  phone: string
  email: string
  serviceName: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  userId?: string
  createdAt: string
}

export interface Message {
  id?: string
  nombre: string
  telefono: string
  email: string
  serviceType: string
  mensaje: string
  status: "unread" | "read" | "responded"
  createdAt: string
}

export interface Profile {
  id?: string
  userId: string
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  preferences?: any
  updatedAt: string
}

export interface Service {
  id?: string
  clientName: string
  clientPhone: string
  serviceType: string
  date: string
  price: string
  completed: boolean
  notes?: string
  createdAt: string
}

export interface Sale {
  id?: string
  productName: string
  clientName: string
  clientPhone: string
  quantity: number
  unitPrice: string
  totalPrice: string
  date: string
  notes?: string
  createdAt: string
}

export interface Product {
  id?: string
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
  createdAt: string
}

// Usuario Service
export const usuarioService = {
  async createUser(userData: Omit<User, "id" | "createdAt">) {
    try {
      const docRef = await addDoc(collection(db, "usuario"), {
        ...userData,
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, "usuario"), orderBy("createdAt", "desc")))
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as User[]
    } catch (error) {
      console.error("Error getting users:", error)
      throw error
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(collection(db, "usuario"), where("email", "==", email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as User
    } catch (error) {
      console.error("Error getting user by email:", error)
      throw error
    }
  },

  async updateUser(userId: string, userData: Partial<User>) {
    try {
      const userRef = doc(db, "usuario", userId)
      await updateDoc(userRef, userData)
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  },
}

// Turnos Service
export const turnosService = {
  async createAppointment(appointmentData: Omit<Appointment, "id" | "createdAt">) {
    try {
      const docRef = await addDoc(collection(db, "turnos"), {
        ...appointmentData,
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating appointment:", error)
      throw error
    }
  },

  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, "turnos"), orderBy("createdAt", "desc")))
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Appointment[]
    } catch (error) {
      console.error("Error getting appointments:", error)
      throw error
    }
  },

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    try {
      const q = query(collection(db, "turnos"), where("userId", "==", userId), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Appointment[]
    } catch (error) {
      console.error("Error getting user appointments:", error)
      throw error
    }
  },

  async updateAppointmentStatus(appointmentId: string, status: Appointment["status"]) {
    try {
      const appointmentRef = doc(db, "turnos", appointmentId)
      await updateDoc(appointmentRef, { status })
    } catch (error) {
      console.error("Error updating appointment status:", error)
      throw error
    }
  },

  async deleteAppointment(appointmentId: string) {
    try {
      await deleteDoc(doc(db, "turnos", appointmentId))
    } catch (error) {
      console.error("Error deleting appointment:", error)
      throw error
    }
  },
}

// Mensaje Service
export const mensajeService = {
  async createMessage(messageData: Omit<Message, "id" | "createdAt" | "status">) {
    try {
      const docRef = await addDoc(collection(db, "mensaje"), {
        ...messageData,
        status: "unread",
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating message:", error)
      throw error
    }
  },

  async getMessages(): Promise<Message[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, "mensaje"), orderBy("createdAt", "desc")))
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Message[]
    } catch (error) {
      console.error("Error getting messages:", error)
      throw error
    }
  },

  async updateMessageStatus(messageId: string, status: Message["status"]) {
    try {
      const messageRef = doc(db, "mensaje", messageId)
      await updateDoc(messageRef, { status })
    } catch (error) {
      console.error("Error updating message status:", error)
      throw error
    }
  },
}

// Perfil Service
export const perfilService = {
  async createProfile(profileData: Omit<Profile, "id" | "updatedAt">) {
    try {
      const docRef = await addDoc(collection(db, "perfil"), {
        ...profileData,
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating profile:", error)
      throw error
    }
  },

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      const q = query(collection(db, "perfil"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Profile
    } catch (error) {
      console.error("Error getting profile:", error)
      throw error
    }
  },

  async updateProfile(profileId: string, profileData: Partial<Profile>) {
    try {
      const profileRef = doc(db, "perfil", profileId)
      await updateDoc(profileRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  },
}

// Servicio Service
export const servicioService = {
  async createService(serviceData: Omit<Service, "id" | "createdAt">) {
    try {
      const docRef = await addDoc(collection(db, "servicio"), {
        ...serviceData,
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating service:", error)
      throw error
    }
  },

  async getAllServices(): Promise<Service[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, "servicio"), orderBy("createdAt", "desc")))
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Service[]
    } catch (error) {
      console.error("Error getting services:", error)
      throw error
    }
  },

  async updateService(serviceId: string, serviceData: Partial<Service>) {
    try {
      const serviceRef = doc(db, "servicio", serviceId)
      await updateDoc(serviceRef, serviceData)
    } catch (error) {
      console.error("Error updating service:", error)
      throw error
    }
  },

  async deleteService(serviceId: string) {
    try {
      await deleteDoc(doc(db, "servicio", serviceId))
    } catch (error) {
      console.error("Error deleting service:", error)
      throw error
    }
  },
}

// Ventas Service
export const ventasService = {
  async createSale(saleData: Omit<Sale, "id" | "createdAt">) {
    try {
      const docRef = await addDoc(collection(db, "ventas"), {
        ...saleData,
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating sale:", error)
      throw error
    }
  },

  async getAllSales(): Promise<Sale[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, "ventas"), orderBy("createdAt", "desc")))
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Sale[]
    } catch (error) {
      console.error("Error getting sales:", error)
      throw error
    }
  },

  async updateSale(saleId: string, saleData: Partial<Sale>) {
    try {
      const saleRef = doc(db, "ventas", saleId)
      await updateDoc(saleRef, saleData)
    } catch (error) {
      console.error("Error updating sale:", error)
      throw error
    }
  },

  async deleteSale(saleId: string) {
    try {
      await deleteDoc(doc(db, "ventas", saleId))
    } catch (error) {
      console.error("Error deleting sale:", error)
      throw error
    }
  },
}

// Productos Service
export const productosService = {
  async createProduct(productData: Omit<Product, "id" | "createdAt">) {
    try {
      const docRef = await addDoc(collection(db, "productos"), {
        ...productData,
        isActive: true,
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  },

  async getAllProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, "productos"), orderBy("createdAt", "desc")))
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Product[]
    } catch (error) {
      console.error("Error getting products:", error)
      throw error
    }
  },

  async getActiveProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, "productos"), where("isActive", "==", true), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Product[]
    } catch (error) {
      console.error("Error getting active products:", error)
      throw error
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, "productos"),
        where("isActive", "==", true),
        orderBy("createdAt", "desc"),
        limit(8),
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Product[]
    } catch (error) {
      console.error("Error getting featured products:", error)
      throw error
    }
  },

  async updateProduct(productId: string, productData: Partial<Product>) {
    try {
      const productRef = doc(db, "productos", productId)
      await updateDoc(productRef, productData)
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  },

  async toggleProductStatus(productId: string, isActive: boolean) {
    try {
      const productRef = doc(db, "productos", productId)
      await updateDoc(productRef, { isActive })
    } catch (error) {
      console.error("Error toggling product status:", error)
      throw error
    }
  },

  async deleteProduct(productId: string) {
    try {
      await deleteDoc(doc(db, "productos", productId))
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
  },
}

// Cart Service (local storage based)
export const cartService = {
  getCart() {
    if (typeof window !== "undefined") {
      const cart = localStorage.getItem("servitec_cart")
      return cart ? JSON.parse(cart) : []
    }
    return []
  },

  addToCart(product: any) {
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
