"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Save, ArrowLeft, Calendar, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { perfilService } from "@/lib/firebase-services"

export default function PerfilPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    cartItems: 0,
    wishlistItems: 0,
    memberSince: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (!currentUser) {
        router.push("/auth")
        return
      }

      // Cargar datos del perfil
      loadUserProfile(currentUser)

      // Establecer datos básicos del usuario
      setProfileData({
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: "",
        address: "",
      })

      // Calculate user stats
      calculateStats(currentUser)
    })

    return () => unsubscribe()
  }, [router])

  const loadUserProfile = async (currentUser: FirebaseUser) => {
    try {
      const profile = await perfilService.getUserProfile(currentUser.uid)
      if (profile) {
        setProfileData({
          name: profile.name || currentUser.displayName || "",
          email: profile.email || currentUser.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const calculateStats = (currentUser: FirebaseUser) => {
    // Get appointments
    const appointments = JSON.parse(localStorage.getItem("servitec_appointments") || "[]")
    const userAppointments = appointments.filter((apt: any) => apt.userId === currentUser.uid)

    // Get cart items
    const carritoCollection = JSON.parse(localStorage.getItem("carrito") || "[]")
    const userCart = carritoCollection.find((c: any) => c.userId === currentUser.uid)
    const cartItems = userCart ? userCart.items.reduce((total: number, item: any) => total + item.quantity, 0) : 0

    // Get wishlist items
    const wishlistCollection = JSON.parse(localStorage.getItem("lista_de_deseos") || "[]")
    const userWishlist = wishlistCollection.find((w: any) => w.userId === currentUser.uid)
    const wishlistItems = userWishlist ? userWishlist.items.length : 0

    setStats({
      totalAppointments: userAppointments.length,
      completedAppointments: userAppointments.filter((apt: any) => apt.status === "completed").length,
      cartItems,
      wishlistItems,
      memberSince: new Date(currentUser.metadata.creationTime || Date.now()).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
      }),
    })
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setProfileLoading(true)

    try {
      await perfilService.updateProfile(user.uid, profileData)

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar tu perfil. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setProfileLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tu información personal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user.photoURL ? (
                      <img src={user.photoURL || "/placeholder.svg"} alt="Profile" className="w-20 h-20 rounded-full" />
                    ) : (
                      <User className="w-12 h-12" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{user.displayName || profileData.name}</h2>
                  <p className="text-white/80 mb-4">{user.email}</p>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Usuario
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Turnos totales</span>
                  </div>
                  <Badge variant="outline">{stats.totalAppointments}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Turnos completados</span>
                  </div>
                  <Badge variant="outline">{stats.completedAppointments}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-600">Items en carrito</span>
                  </div>
                  <Badge variant="outline">{stats.cartItems}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">Lista de deseos</span>
                  </div>
                  <Badge variant="outline">{stats.wishlistItems}</Badge>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Miembro desde <span className="font-medium">{stats.memberSince}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nombre completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="pl-10"
                          required
                          disabled
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">El email no se puede modificar</p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="pl-10"
                          placeholder="+54 11 1234-5678"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          className="pl-10"
                          placeholder="Tu dirección"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Información de la cuenta</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>
                        <strong>Proveedor:</strong> Google
                      </p>
                      <p>
                        <strong>Verificado:</strong> {user.emailVerified ? "Sí" : "No"}
                      </p>
                      <p>
                        <strong>Último acceso:</strong>{" "}
                        {new Date(user.metadata.lastSignInTime || Date.now()).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={profileLoading}
                      className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {profileLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
