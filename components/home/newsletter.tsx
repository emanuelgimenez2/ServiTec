"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import { auth } from "@/lib/firebase"
import { perfilService } from "@/lib/firebase-services"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (e) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu email",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Verificar si hay un usuario logueado
      const currentUser = auth.currentUser

      if (currentUser) {
        // Usuario logueado: guardar en su perfil
        await perfilService.subscribeToNewsletter(currentUser.uid, email)
        console.log("✅ Newsletter guardado en perfil del usuario logueado")
      } else {
        // Usuario no logueado: crear perfil temporal o guardar en colección separada
        // Por ahora, mostrar mensaje pidiendo que se registre
        toast({
          title: "Registro requerido",
          description: "Para suscribirte al newsletter, por favor inicia sesión o regístrate",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      setIsSubscribed(true)
      setEmail("")

      toast({
        title: "¡Suscripción exitosa!",
        description: "Te has suscrito al newsletter. Recibirás nuestras novedades.",
      })
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      toast({
        title: "Error",
        description: "No se pudo completar la suscripción. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por suscribirte!</h3>
              <p className="text-white/80">Recibirás nuestras últimas novedades y ofertas especiales en tu email.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Mail className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-2xl font-bold text-white mb-2">Mantente Actualizado</h3>
              <p className="text-white/80">
                Suscríbete a nuestro newsletter y recibe las últimas novedades, ofertas especiales y consejos técnicos.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Tu email para notificaciones..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Suscribiendo...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Suscribirse
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-white/60 text-center">
                Al suscribirte, aceptas recibir emails promocionales. Puedes darte de baja en cualquier momento.
              </p>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/70">
              <AlertCircle className="h-4 w-4" />
              <span>Necesitas estar registrado para suscribirte</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
