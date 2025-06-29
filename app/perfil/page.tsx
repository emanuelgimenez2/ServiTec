"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Save,
  ArrowLeft,
  Camera,
  Shield,
  Bell,
  CreditCard,
  History,
} from "lucide-react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserDocument } from "@/lib/auth-service"
import { perfilService, turnosService } from "@/lib/firebase-services"

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth")
        return
      }

      const userData = await getUserDocument(user.uid)
      if (userData) {
        setUser(userData)
        await loadProfile(userData.id)
        await loadUserAppointments(userData.id)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadProfile = async (userId: string) => {
    try {
      const userProfile = await perfilService.getUserProfile(userId)
      if (userProfile) {
        setProfile(userProfile)
        setFormData({
          name: userProfile.name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          address: userProfile.address || "",
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const loadUserAppointments = async (userId: string) => {
    try {
      const userAppointments = await turnosService.getUserAppointments(userId)
      setAppointments(userAppointments.slice(0, 3)) // Solo los últimos 3
    } catch (error) {
      console.error("Error loading appointments:", error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      await perfilService.updateProfile(user.id, formData)

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido guardada correctamente",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el perfil",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Cargando perfil...</p>
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
              <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
              <p className="text-white/70">Gestiona tu información personal y configuración</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar and Basic Info */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.photoURL || "/placeholder.svg"} />
                      <AvatarFallback className="bg-purple-500 text-white text-xl">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{user?.displayName || "Usuario"}</h3>
                    <p className="text-white/70">{user?.email}</p>
                    <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">Cuenta Verificada</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/90">
                      <User className="h-4 w-4 inline mr-1" />
                      Nombre Completo
                    </Label>
                    <Input
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/90">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Teléfono
                  </Label>
                  <Input
                    placeholder="Tu número de teléfono"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/90">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Dirección
                  </Label>
                  <Textarea
                    placeholder="Tu dirección completa"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Turnos Recientes
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/mis-turnos")}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Ver Todos
                </Button>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-white/50 mb-4" />
                    <p className="text-white/70">No tienes turnos recientes</p>
                    <Button
                      onClick={() => router.push("/turnos")}
                      className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Reservar Turno
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div>
                          <h4 className="font-semibold text-white">{appointment.serviceName}</h4>
                          <p className="text-sm text-white/70">
                            {new Date(appointment.date).toLocaleDateString("es-AR")} - {appointment.time}
                          </p>
                        </div>
                        <Badge
                          className={
                            appointment.status === "completed"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : appointment.status === "confirmed"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          }
                        >
                          {appointment.status === "completed"
                            ? "Completado"
                            : appointment.status === "confirmed"
                              ? "Confirmado"
                              : "Pendiente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Turnos Totales</span>
                  <span className="text-2xl font-bold text-white">{appointments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Miembro desde</span>
                  <span className="text-white">
                    {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : "2024"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => router.push("/turnos")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Reservar Turno
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => router.push("/mis-turnos")}
                >
                  <History className="mr-2 h-4 w-4" />
                  Ver Mis Turnos
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => router.push("/tienda")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Ir a la Tienda
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-white/70" />
                    <span className="text-white/90">Notificaciones</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Activas</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-white/70" />
                    <span className="text-white/90">Privacidad</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Configurada</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
