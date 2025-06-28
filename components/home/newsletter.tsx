"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Te has suscrito correctamente a nuestro newsletter.",
      })
      setEmail("")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
            <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>

          {/* Header */}
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Mantente Actualizado</h2>
          <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe ofertas exclusivas, novedades tecnológicas y consejos útiles
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Tu email aquí..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/40"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Suscribirse
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Benefits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-white/90 justify-items-center">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Ofertas Exclusivas</h3>
              <p className="text-xs sm:text-sm text-white/70">Descuentos especiales solo para suscriptores</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Novedades Tech</h3>
              <p className="text-xs sm:text-sm text-white/70">Las últimas tendencias en tecnología</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl">💡</span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Consejos Útiles</h3>
              <p className="text-xs sm:text-sm text-white/70">Tips para cuidar tus dispositivos</p>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-white/70 text-center">
            No compartimos tu información. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  )
}
