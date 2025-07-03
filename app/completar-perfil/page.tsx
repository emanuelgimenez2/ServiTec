"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { User, Phone, MapPin, CheckCircle, Mail } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { completeUserProfile } from "@/lib/auth-service"

export default function CompletarPerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth")
        return
      }

      // Check if user already completed profile
      const userData = JSON.parse(localStorage.getItem("servitec_user") || "{}")
      if (userData.isProfileComplete) {
        // Redirect based on role
        if (user.email === "admin@servitec.com") {
          router.push("/admin")
        } else {
          router.push("/")
        }
        return
      }

      setUser(user)
      // Pre-fill name from Google account
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
      }))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio"
    } else if (formData.phone.length < 8) {
      newErrors.phone = "El teléfono debe tener al menos 8 dígitos"
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.phone
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!user) return

    setSaving(true)
    try {
      await completeUserProfile(user.uid, formData)

      toast({
        title: "¡Perfil completado!",
        description: "Tu información ha sido guardada correctamente",
      })

      // Redirect based on user role
      setTimeout(() => {
        if (user.email === "admin@servitec.com") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }, 1500)
    } catch (error) {
      console.error("Error completing profile:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el perfil. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Completa tu Perfil</CardTitle>
          <p className="text-gray-600">Para continuar, necesitamos algunos datos adicionales</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (solo mostrar, no editable) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Label>
              <Input id="email" value={user?.email || ""} disabled className="bg-gray-100 text-gray-600" />
              <p className="text-xs text-gray-500">Este email viene de tu cuenta de Google</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Nombre Completo *
              </Label>
              <Input
                id="name"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Teléfono *
              </Label>
              <Input
                id="phone"
                placeholder="Tu número de teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Dirección (Opcional)
              </Label>
              <Textarea
                id="address"
                placeholder="Tu dirección completa"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">¿Por qué necesitamos esta información?</p>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• Para contactarte sobre tus turnos, servicios y/o productos</li>
                    <li>• Para personalizar tu experiencia</li>
                    <li>• Para envíos de productos (si aplica)</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
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
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completar Perfil
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">Los campos marcados con * son obligatorios</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
