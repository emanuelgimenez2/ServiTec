"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, User, Heart, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { signOut, syncAuthState } from "@/lib/auth-service"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isInHero, setIsInHero] = useState(true)
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState(0)
  const [wishlistItems, setWishlistItems] = useState(0)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const heroHeight = window.innerHeight * 0.8
      const isHomePage = window.location.pathname === "/"

      setIsScrolled(scrollPosition > 50)
      setIsInHero(isHomePage && scrollPosition < heroHeight)
    }

    // Escuchar cambios de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("🔥 Auth state changed:", firebaseUser?.email)

      // Sincronizar estado
      syncAuthState(firebaseUser)

      // Actualizar estado local
      updateUserFromStorage()
      setAuthLoading(false)
    })

    // Check for user session from localStorage
    const updateUserFromStorage = () => {
      const userData = localStorage.getItem("servitec_user")
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          console.log("👤 User loaded from storage:", parsedUser.email)
        } catch (error) {
          console.error("Error parsing user data:", error)
          localStorage.removeItem("servitec_user")
        }
      } else {
        setUser(null)
      }
    }

    // Check cart and wishlist items
    const updateCounts = () => {
      const userData = localStorage.getItem("servitec_user")
      if (userData) {
        const user = JSON.parse(userData)

        // Get user's cart from carrito collection
        const carritoCollection = JSON.parse(localStorage.getItem("carrito") || "[]")
        const userCart = carritoCollection.find((c) => c.userId === user.id)
        const cartItems = userCart ? userCart.items.reduce((total, item) => total + item.quantity, 0) : 0

        // Get user's wishlist from lista_de_deseos collection
        const wishlistCollection = JSON.parse(localStorage.getItem("lista_de_deseos") || "[]")
        const userWishlist = wishlistCollection.find((w) => w.userId === user.id)
        const wishlistItems = userWishlist ? userWishlist.items.length : 0

        setCartItems(cartItems)
        setWishlistItems(wishlistItems)
      } else {
        setCartItems(0)
        setWishlistItems(0)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Initial checks
    updateUserFromStorage()
    updateCounts()
    handleScroll()

    // Listen for storage changes and custom events
    const handleStorageChange = () => {
      updateUserFromStorage()
      updateCounts()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("userUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userUpdated", handleStorageChange)
      unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // NUEVA FUNCIÓN: Cerrar menú móvil automáticamente
  const handleMobileNavClick = () => {
    setIsOpen(false)
  }

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isInHero ? "bg-transparent backdrop-blur-sm" : "bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 shadow-lg"
  }`

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <nav className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="ServiTec Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-white">ServiTec</span>
            </Link>
            <div className="text-white">Cargando...</div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="logo.png" alt="ServiTec Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-xl font-bold text-white">ServiTec</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-orange-400 transition-colors">
              Inicio
            </Link>
            <div className="relative group">
              <button className="text-white hover:text-orange-400 transition-colors">Servicios</button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-4 space-y-2">
                  <Link
                    href="/servicios/reparacion"
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 rounded"
                  >
                    Reparación de Computadoras
                  </Link>
                  <Link href="/servicios/starlink" className="block px-4 py-2 text-gray-800 hover:bg-orange-50 rounded">
                    Instalación Starlink
                  </Link>
                  <Link href="/servicios/camaras" className="block px-4 py-2 text-gray-800 hover:bg-orange-50 rounded">
                    Instalación de Cámaras
                  </Link>
                  <Link
                    href="/servicios/desarrollo"
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 rounded"
                  >
                    Desarrollo Web
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/tienda" className="text-white hover:text-orange-400 transition-colors">
              Tienda
            </Link>
            <Link href="/turnos" className="text-white hover:text-orange-400 transition-colors">
              Turnos
            </Link>
            <Link href="/contacto" className="text-white hover:text-orange-400 transition-colors">
              Contacto
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="text-white hover:text-violet-300 relative">
                <Heart className="w-5 h-5" />
                {wishlistItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {wishlistItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/carrito">
              <Button variant="ghost" size="sm" className="text-white hover:text-violet-300 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>
            {user ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="text-white hover:text-violet-300">
                  <User className="w-5 h-5 mr-1" />
                  {user.name}
                  {user.role === "administrador" && <Shield className="w-4 h-4 ml-1 text-yellow-400" />}
                </Button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    <Link href="/perfil" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                      Mi Perfil
                    </Link>
                    <Link href="/mis-turnos" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                      Mis Turnos
                    </Link>
                    {user.role === "administrador" && (
                      <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-yellow-600" />
                          Admin
                        </div>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="text-white hover:text-violet-300">
                  <User className="w-5 h-5 mr-1" />
                  Ingresar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-sm rounded-lg mt-2 p-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-white hover:text-orange-400 transition-colors"
                onClick={handleMobileNavClick}
              >
                Inicio
              </Link>
              <div className="space-y-2">
                <span className="block text-white font-medium">Servicios</span>
                <Link
                  href="/servicios/reparacion"
                  className="block pl-4 text-white/80 hover:text-orange-400 transition-colors"
                  onClick={handleMobileNavClick}
                >
                  Reparación de Computadoras
                </Link>
                <Link
                  href="/servicios/starlink"
                  className="block pl-4 text-white/80 hover:text-orange-400 transition-colors"
                  onClick={handleMobileNavClick}
                >
                  Instalación Starlink
                </Link>
                <Link
                  href="/servicios/camaras"
                  className="block pl-4 text-white/80 hover:text-orange-400 transition-colors"
                  onClick={handleMobileNavClick}
                >
                  Instalación de Cámaras
                </Link>
                <Link
                  href="/servicios/desarrollo"
                  className="block pl-4 text-white/80 hover:text-orange-400 transition-colors"
                  onClick={handleMobileNavClick}
                >
                  Desarrollo Web
                </Link>
              </div>
              <Link
                href="/tienda"
                className="block text-white hover:text-orange-400 transition-colors"
                onClick={handleMobileNavClick}
              >
                Tienda
              </Link>
              <Link
                href="/turnos"
                className="block text-white hover:text-orange-400 transition-colors"
                onClick={handleMobileNavClick}
              >
                Turnos
              </Link>
              <Link
                href="/contacto"
                className="block text-white hover:text-orange-400 transition-colors"
                onClick={handleMobileNavClick}
              >
                Contacto
              </Link>
              <div className="pt-4 border-t border-white/20">
                <div className="flex space-x-4">
                  <Link href="/wishlist" onClick={handleMobileNavClick}>
                    <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
                      <Heart className="w-5 h-5" />
                      <span className="ml-1">Lista ({wishlistItems})</span>
                    </Button>
                  </Link>
                  <Link href="/carrito" onClick={handleMobileNavClick}>
                    <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
                      <ShoppingCart className="w-5 h-5" />
                      <span className="ml-1">Carrito ({cartItems})</span>
                    </Button>
                  </Link>
                  {user ? (
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
                        <User className="w-5 h-5" />
                        <span className="ml-1">{user.name}</span>
                      </Button>
                      <Link href="/perfil" onClick={handleMobileNavClick}>
                        <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
                          Mi Perfil
                        </Button>
                      </Link>
                      <Link href="/mis-turnos" onClick={handleMobileNavClick}>
                        <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
                          Mis Turnos
                        </Button>
                      </Link>
                      {user.role === "administrador" && (
                        <Link href="/admin" onClick={handleMobileNavClick}>
                          <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
                            <Shield className="w-5 h-5" />
                            <span className="ml-1">Admin</span>
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-orange-400"
                        onClick={() => {
                          handleSignOut()
                          handleMobileNavClick()
                        }}
                      >
                        Cerrar Sesión
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={handleMobileNavClick}>
                      <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
                        <User className="w-5 h-5" />
                        <span className="ml-1">Ingresar</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
