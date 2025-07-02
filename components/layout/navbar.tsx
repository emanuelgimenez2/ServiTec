"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, User, Shield, Heart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { signOut, syncAuthState } from "@/lib/auth-service"
import { carritoService, listaDeseosService } from "@/lib/firebase-services"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isInHero, setIsInHero] = useState(true)
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState(0)
  const [wishlistItems, setWishlistItems] = useState(0)
  const [authLoading, setAuthLoading] = useState(true)

  // Función para actualizar contadores desde Firebase
  const updateCountersFromFirebase = async (userId) => {
    try {
      // Actualizar carrito
      if (carritoService && carritoService.getUserCart) {
        const userCart = await carritoService.getUserCart(userId)
        if (userCart && userCart.items) {
          const totalItems = userCart.items.reduce((sum, item) => sum + item.quantity, 0)
          setCartItems(totalItems)
          console.log("🛒 Cart items updated:", totalItems)
        } else {
          setCartItems(0)
        }
      }

      // Actualizar favoritos
      if (listaDeseosService && listaDeseosService.getUserWishlist) {
        const favoriteIds = await listaDeseosService.getUserWishlist(userId)
        setWishlistItems(favoriteIds.length)
        console.log("❤️ Wishlist items updated:", favoriteIds.length)
      }
    } catch (error) {
      console.error("Error updating counters:", error)
      setCartItems(0)
      setWishlistItems(0)
    }
  }

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

    // Escuchar eventos personalizados para actualizar contadores
    const handleCartUpdate = () => {
      updateCounts()
    }

    const handleWishlistUpdate = () => {
      updateCounts()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("userUpdated", handleStorageChange)
    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("wishlistUpdated", handleWishlistUpdate)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userUpdated", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
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
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="ServiTec Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-lg sm:text-xl font-bold text-white">ServiTec</span>
            </Link>
            <div className="text-white text-sm">Cargando...</div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="logo.png" alt="ServiTec Logo" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-lg sm:text-xl font-bold text-white">ServiTec</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
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
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Favoritos */}
            {user && (
              <Link href="/favoritos">
                <Button variant="ghost" size="sm" className="text-white hover:text-violet-300 relative p-2">
                  <Heart className="w-5 h-5" />
                  {wishlistItems > 0 && (
                    <>
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center p-0 border-2 border-white">
                        {wishlistItems > 9 ? "9+" : wishlistItems}
                      </Badge>
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </>
                  )}
                </Button>
              </Link>
            )}

            <Link href="/carrito">
              <Button variant="ghost" size="sm" className="text-white hover:text-violet-300 relative p-2">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <>
                    <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center p-0 border-2 border-white">
                      {cartItems > 9 ? "9+" : cartItems}
                    </Badge>
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-violet-300 flex items-center space-x-2 p-2"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user.photoURL || user.avatar || ""} alt={user.name || "Usuario"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline text-sm">{user.name}</span>
                  {user.role === "administrador" && <Shield className="w-4 h-4 ml-1 text-yellow-400" />}
                </Button>

                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    <Link href="/perfil" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                      Mi Perfil
                    </Link>
                    <Link href="/mis-compras" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded">
                      Mis Compras
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
                <Button variant="ghost" size="sm" className="text-white hover:text-violet-300 p-2">
                  <User className="w-5 h-5 mr-1" />
                  <span className="hidden lg:inline">Ingresar</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 backdrop-blur-sm rounded-lg mt-2 p-3 border border-white/10">
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-white hover:text-orange-400 transition-colors text-sm"
                onClick={handleMobileNavClick}
              >
                Inicio
              </Link>
              {/* Servicios */}
              <div className="space-y-2">
                <span className="block text-white font-medium text-sm">Servicios</span>
                <div className="pl-3 space-y-1">
                  <Link
                    href="/servicios/reparacion"
                    className="block text-white/80 hover:text-orange-400 transition-colors text-xs"
                    onClick={handleMobileNavClick}
                  >
                    Reparación de Computadoras
                  </Link>
                  <Link
                    href="/servicios/starlink"
                    className="block text-white/80 hover:text-orange-400 transition-colors text-xs"
                    onClick={handleMobileNavClick}
                  >
                    Instalación Starlink
                  </Link>
                  <Link
                    href="/servicios/camaras"
                    className="block text-white/80 hover:text-orange-400 transition-colors text-xs"
                    onClick={handleMobileNavClick}
                  >
                    Instalación de Cámaras
                  </Link>
                  <Link
                    href="/servicios/desarrollo"
                    className="block text-white/80 hover:text-orange-400 transition-colors text-xs"
                    onClick={handleMobileNavClick}
                  >
                    Desarrollo Web
                  </Link>
                </div>
              </div>
              <Link
                href="/tienda"
                className="block text-white hover:text-orange-400 transition-colors text-sm"
                onClick={handleMobileNavClick}
              >
                Tienda
              </Link>
              <Link
                href="/turnos"
                className="block text-white hover:text-orange-400 transition-colors text-sm"
                onClick={handleMobileNavClick}
              >
                Turnos
              </Link>
              <Link
                href="/contacto"
                className="block text-white hover:text-orange-400 transition-colors text-sm"
                onClick={handleMobileNavClick}
              >
                Contacto
              </Link>

              {/* Separador */}
              <div className="border-t border-white/20 pt-3">
                {/* Carrito y Usuario */}
                <div className="space-y-2">
                  {/* Favoritos en móvil */}
                  {user && (
                    <Link href="/favoritos" onClick={handleMobileNavClick}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-white hover:text-orange-400 relative p-2 h-8"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        <span className="text-sm">Favoritos ({wishlistItems})</span>
                        {wishlistItems > 0 && (
                          <div className="absolute left-5 top-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </Button>
                    </Link>
                  )}

                  <Link href="/carrito" onClick={handleMobileNavClick}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-white hover:text-orange-400 relative p-2 h-8"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span className="text-sm">Carrito ({cartItems})</span>
                      {cartItems > 0 && (
                        <div className="absolute left-5 top-0.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      )}
                    </Button>
                  </Link>

                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-white p-2">
                        <Avatar className="w-5 h-5 mr-2">
                          <AvatarImage src={user.photoURL || user.avatar || ""} alt={user.name || "Usuario"} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs">
                            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.name}</span>
                        {user.role === "administrador" && <Shield className="w-3 h-3 ml-2 text-yellow-400" />}
                      </div>

                      <div className="pl-6 space-y-1">
                        <Link href="/perfil" onClick={handleMobileNavClick}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-white/80 hover:text-orange-400 text-xs p-1 h-7"
                          >
                            Mi Perfil
                          </Button>
                        </Link>

                        <Link href="/mis-compras" onClick={handleMobileNavClick}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-white/80 hover:text-orange-400 text-xs p-1 h-7"
                          >
                            <Package className="w-3 h-3 mr-2" />
                            Mis Compras
                          </Button>
                        </Link>

                        <Link href="/mis-turnos" onClick={handleMobileNavClick}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-white/80 hover:text-orange-400 text-xs p-1 h-7"
                          >
                            Mis Turnos
                          </Button>
                        </Link>

                        {user.role === "administrador" && (
                          <Link href="/admin" onClick={handleMobileNavClick}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-white/80 hover:text-orange-400 text-xs p-1 h-7"
                            >
                              <Shield className="w-3 h-3 mr-2 text-yellow-600" />
                              Panel Admin
                            </Button>
                          </Link>
                        )}

                        <Button
                          onClick={() => {
                            handleSignOut()
                            handleMobileNavClick()
                          }}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-white/80 hover:text-orange-400 text-xs p-1 h-7"
                        >
                          Cerrar Sesión
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={handleMobileNavClick}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-white hover:text-orange-400 p-2 h-8"
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span className="text-sm">Ingresar</span>
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
