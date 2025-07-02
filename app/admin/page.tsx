"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Activity,
  Award,
  Zap,
  Calculator,
  Package,
  FileText,
  MessageSquare,
  TestTube,
  BarChart3,
  RefreshCw,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  servicioService,
  ventasService,
  productosService,
  turnosService,
  mensajeService,
  usuarioService,
} from "@/lib/firebase-services"
import { testFirebaseConnection } from "@/lib/firebase-test"
import AdminDashboard from "@/components/admin/dashboard"
import AdminAnalytics from "@/components/admin/analytics"
import AdminMessages from "@/components/admin/messages"
import AdminUsers from "@/components/admin/users"
import AdminProducts from "@/components/admin/products"
import AdminAppointments from "@/components/admin/appointments"
import AdminOrders from "@/components/admin/orders"
import AdminAccounting from "@/components/admin/accounting"

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    monthlyGrowth: 15.2,
    customerSatisfaction: 4.8,
    totalServices: 0,
    totalSales: 0,
    totalProducts: 0,
    totalMessages: 0,
    unreadMessages: 0,
  })
  const [appointments, setAppointments] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [services, setServices] = useState([])
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState([])
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [serviceFilters, setServiceFilters] = useState({ type: "todos", search: "" })
  const [saleFilters, setSaleFilters] = useState({ search: "" })
  const [productFilters, setProductFilters] = useState({ category: "todos", search: "" })
  const [messageFilters, setMessageFilters] = useState({ type: "todos", search: "", status: "todos" })
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showDashboard, setShowDashboard] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Form states
  const [newService, setNewService] = useState({
    clientName: "",
    clientPhone: "",
    serviceType: "",
    customService: "",
    date: "",
    price: "",
    completed: false,
    image: null,
    notes: "",
  })

  const [newSale, setNewSale] = useState({
    productName: "",
    clientName: "",
    clientPhone: "",
    quantity: 1,
    unitPrice: "",
    totalPrice: "",
    date: "",
    notes: "",
  })

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stock: "",
    purchasePrice: "",
    salePrice: "",
    description: "",
    image: "",
    brand: "",
    specifications: {},
  })

  useEffect(() => {
    checkAdminAccess()
  }, [router])

  const checkAdminAccess = async () => {
    const userData = localStorage.getItem("servitec_user")
    if (!userData) {
      router.push("/auth")
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== "administrador") {
      router.push("/")
      return
    }

    setUser(user)
    await loadData()
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [appointmentsData, usersData, servicesData, salesData, productsData, messagesData] = await Promise.all([
        turnosService.getAllAppointments(),
        usuarioService.getAllUsers(),
        servicioService.getAllServices(),
        ventasService.getAllSales(),
        productosService.getAllProducts(),
        mensajeService.getMessages(),
      ])

      setAppointments(appointmentsData)
      setUsers(usersData)
      setServices(servicesData)
      setSales(salesData)
      setProducts(productsData)
      setMessages(messagesData)

      // Cargar pedidos del localStorage
      const ordersData = JSON.parse(localStorage.getItem("admin_orders") || "[]")
      setOrders(ordersData)

      // Guardar en localStorage para los componentes de analíticas
      localStorage.setItem("admin_users", JSON.stringify(usersData))
      localStorage.setItem("admin_appointments", JSON.stringify(appointmentsData))
      localStorage.setItem("admin_services", JSON.stringify(servicesData))
      localStorage.setItem("admin_sales", JSON.stringify(salesData))
      localStorage.setItem("admin_products", JSON.stringify(productsData))
      localStorage.setItem("admin_messages", JSON.stringify(messagesData))

      // Calculate stats
      const pendingAppointments = appointmentsData.filter((a) => a.status === "pending").length
      const completedAppointments = appointmentsData.filter((a) => a.status === "completed").length
      const servicesRevenue = servicesData.reduce((sum, service) => sum + (Number.parseFloat(service.price) || 0), 0)
      const salesRevenue = salesData.reduce((sum, sale) => sum + (Number.parseFloat(sale.totalPrice) || 0), 0)
      const unreadMessages = messagesData.filter((m) => m.status === "unread").length

      setStats({
        totalUsers: usersData.length,
        totalAppointments: appointmentsData.length,
        totalOrders: ordersData.length,
        totalRevenue: servicesRevenue + salesRevenue,
        pendingAppointments,
        completedAppointments,
        monthlyGrowth: 15.2,
        customerSatisfaction: 4.8,
        totalServices: servicesData.length,
        totalSales: salesData.length,
        totalProducts: productsData.length,
        totalMessages: messagesData.length,
        unreadMessages,
      })
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Error al cargar los datos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // FUNCIÓN DE PRUEBA DE FIREBASE
  const runFirebaseTest = async () => {
    console.log("🧪 Ejecutando prueba de Firebase...")
    try {
      const result = await testFirebaseConnection()

      if (result.success) {
        toast({
          title: "✅ Prueba exitosa",
          description: `Firebase funciona. Documentos: ${result.documentsCount}`,
        })
      } else {
        toast({
          title: "❌ Prueba fallida",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error en prueba:", error)
      toast({
        title: "❌ Error en prueba",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await turnosService.updateAppointmentStatus(appointmentId, newStatus)
      await loadData()

      toast({
        title: "Estado actualizado",
        description: `Turno ${newStatus === "confirmed" ? "confirmado" : newStatus === "completed" ? "completado" : "cancelado"}`,
      })
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del turno",
        variant: "destructive",
      })
    }
  }

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      await mensajeService.updateMessageStatus(messageId, newStatus)
      await loadData()

      toast({
        title: "Estado actualizado",
        description: `Mensaje marcado como ${newStatus === "read" ? "leído" : "respondido"}`,
      })
    } catch (error) {
      console.error("Error updating message:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del mensaje",
        variant: "destructive",
      })
    }
  }

  const addService = async () => {
    try {
      const serviceData = {
        clientName: newService.clientName,
        clientPhone: newService.clientPhone,
        serviceType: newService.serviceType === "otro" ? newService.customService : newService.serviceType,
        date: newService.date,
        price: newService.price,
        completed: newService.completed,
        notes: newService.notes,
      }

      await servicioService.createService(serviceData)
      await loadData()

      setNewService({
        clientName: "",
        clientPhone: "",
        serviceType: "",
        customService: "",
        date: "",
        price: "",
        completed: false,
        image: null,
        notes: "",
      })
      setIsAddServiceOpen(false)

      toast({
        title: "Servicio agregado",
        description: "El servicio ha sido registrado exitosamente",
      })
    } catch (error) {
      console.error("Error adding service:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el servicio",
        variant: "destructive",
      })
    }
  }

  const addSale = async () => {
    try {
      const saleData = {
        productName: newSale.productName,
        clientName: newSale.clientName,
        clientPhone: newSale.clientPhone,
        quantity: newSale.quantity,
        unitPrice: newSale.unitPrice,
        totalPrice: (Number.parseFloat(newSale.unitPrice) * Number.parseInt(newSale.quantity)).toString(),
        date: newSale.date,
        notes: newSale.notes,
      }

      await ventasService.createSale(saleData)
      await loadData()

      setNewSale({
        productName: "",
        clientName: "",
        clientPhone: "",
        quantity: 1,
        unitPrice: "",
        totalPrice: "",
        date: "",
        notes: "",
      })
      setIsAddSaleOpen(false)

      toast({
        title: "Venta registrada",
        description: "La venta ha sido registrada exitosamente",
      })
    } catch (error) {
      console.error("Error adding sale:", error)
      toast({
        title: "Error",
        description: "No se pudo registrar la venta",
        variant: "destructive",
      })
    }
  }

  const addProduct = async () => {
    console.log("🚀 === INICIANDO PROCESO DE AGREGAR PRODUCTO ===")
    console.log("📝 Estado del formulario:", newProduct)

    // Validación de campos requeridos
    if (!newProduct.name || !newProduct.salePrice || !newProduct.category) {
      console.log("❌ Validación fallida - campos requeridos faltantes")
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos: Nombre, Precio de Venta y Categoría",
        variant: "destructive",
      })
      return
    }

    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description || "",
        price: Number.parseFloat(newProduct.salePrice),
        originalPrice: Number.parseFloat(newProduct.salePrice) * 1.2,
        stock: Number.parseInt(newProduct.stock) || 0,
        category: newProduct.category,
        brand: newProduct.brand || "Sin especificar",
        image: newProduct.image || "/placeholder.svg?height=300&width=300",
        images: [newProduct.image || "/placeholder.svg?height=600&width=600"],
        rating: 4.5,
        reviews: 0,
        isNew: true,
        isActive: true,
        specifications: {
          Marca: newProduct.brand || "Sin especificar",
          Descripción: newProduct.description || "",
          ...newProduct.specifications,
        },
      }

      console.log("📦 Datos preparados para enviar:", productData)

      const productId = await productosService.createProduct(productData)
      console.log("🎉 Producto creado con ID:", productId)

      await loadData()

      setNewProduct({
        name: "",
        category: "",
        stock: "",
        purchasePrice: "",
        salePrice: "",
        description: "",
        image: "",
        brand: "",
        specifications: {},
      })
      setIsAddProductOpen(false)

      toast({
        title: "¡Producto agregado!",
        description: "El producto ha sido agregado exitosamente y está disponible en la tienda",
      })
    } catch (error) {
      console.error("💥 Error completo al agregar producto:", error)
      toast({
        title: "Error",
        description: `No se pudo agregar el producto: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR")
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" },
      confirmed: { label: "Confirmado", variant: "default" },
      completed: { label: "Completado", variant: "default" },
      cancelled: { label: "Cancelado", variant: "destructive" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getServiceTypeBadge = (type) => {
    const colors = {
      reparacion: "bg-blue-500",
      starlink: "bg-green-500",
      camaras: "bg-purple-500",
      desarrollo: "bg-orange-500",
      contacto: "bg-gray-500",
      otro: "bg-gray-500",
    }
    return <Badge className={`${colors[type] || colors.otro} text-white`}>{type.toUpperCase()}</Badge>
  }

  const getMessageStatusBadge = (status) => {
    const statusConfig = {
      unread: { label: "Sin Leer", variant: "destructive" as const },
      read: { label: "Leído", variant: "secondary" as const },
      responded: { label: "Respondido", variant: "default" as const },
    }

    const config = statusConfig[status] || statusConfig.unread
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredServices = services.filter((service) => {
    const matchesType =
      serviceFilters.type === "todos" || service.serviceType.toLowerCase().includes(serviceFilters.type)
    const matchesSearch =
      service.clientName.toLowerCase().includes(serviceFilters.search.toLowerCase()) ||
      service.clientPhone.includes(serviceFilters.search) ||
      service.serviceType.toLowerCase().includes(serviceFilters.search.toLowerCase())
    return matchesType && matchesSearch
  })

  const filteredSales = sales.filter((sale) => {
    return (
      sale.clientName.toLowerCase().includes(saleFilters.search.toLowerCase()) ||
      sale.clientPhone.includes(saleFilters.search) ||
      sale.productName.toLowerCase().includes(saleFilters.search.toLowerCase())
    )
  })

  const filteredProducts = products.filter((product) => {
    const matchesCategory = productFilters.category === "todos" || product.category === productFilters.category
    const matchesSearch =
      product.name.toLowerCase().includes(productFilters.search.toLowerCase()) ||
      product.brand.toLowerCase().includes(productFilters.search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredMessages = messages.filter((message) => {
    const matchesType = messageFilters.type === "todos" || message.serviceType === messageFilters.type
    const matchesStatus = messageFilters.status === "todos" || message.status === messageFilters.status
    const matchesSearch =
      message.nombre.toLowerCase().includes(messageFilters.search.toLowerCase()) ||
      message.telefono.includes(messageFilters.search) ||
      message.email.toLowerCase().includes(messageFilters.search.toLowerCase()) ||
      message.mensaje.toLowerCase().includes(messageFilters.search.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  // Tabs para móvil
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "products", label: "Productos", icon: Package },
    { id: "appointments", label: "Turnos", icon: FileText },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "messages", label: "Mensajes", icon: MessageSquare },
    { id: "accounting", label: "Contabilidad", icon: Calculator },
    { id: "analytics", label: "Analíticas", icon: BarChart3 },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Cargando Panel de Administración...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-16">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header Mejorado */}
        <div className="mb-4 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-lg">
                  <Activity className="w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl lg:text-5xl font-bold text-white mb-1 lg:mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Panel de Administración
                    <Zap className="inline-block w-3 h-3 sm:w-6 sm:h-6 lg:w-10 lg:h-10 ml-1 sm:ml-2 lg:ml-3 text-yellow-400 animate-pulse" />
                  </h1>
                  <p className="text-white/80 text-xs sm:text-sm lg:text-xl">Bienvenido de vuelta, {user.name}</p>
                  <div className="flex items-center mt-1 sm:mt-2 lg:mt-3 gap-1 sm:gap-2 lg:gap-4">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-yellow-400" />
                      <span className="text-white/90 text-xs sm:text-sm lg:text-lg">Administrador Principal</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10 text-xs">
                      <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
                      Sistema Activo
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                <Button
                  onClick={loadData}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  size="sm"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  )}
                  <span className="hidden sm:inline text-xs sm:text-sm">Actualizar</span>
                </Button>
                <Button
                  onClick={runFirebaseTest}
                  className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hidden lg:flex"
                  size="sm"
                >
                  <TestTube className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  <span className="text-xs sm:text-sm">Probar Firebase</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Mejoradas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-8 mb-4 sm:mb-8 lg:mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 lg:pb-3">
              <CardTitle className="text-xs sm:text-sm lg:text-lg font-medium opacity-90">Total Usuarios</CardTitle>
              <div className="bg-white/20 rounded-full p-1 sm:p-2 lg:p-3">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">{stats.totalUsers}</div>
              <div className="flex items-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                <p className="text-xs lg:text-sm opacity-90">+{stats.monthlyGrowth}% este mes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 lg:pb-3">
              <CardTitle className="text-xs sm:text-sm lg:text-lg font-medium opacity-90">
                Servicios Realizados
              </CardTitle>
              <div className="bg-white/20 rounded-full p-1 sm:p-2 lg:p-3">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">{stats.totalServices}</div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                <p className="text-xs lg:text-sm opacity-90">Servicios completados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 lg:pb-3">
              <CardTitle className="text-xs sm:text-sm lg:text-lg font-medium opacity-90">Productos</CardTitle>
              <div className="bg-white/20 rounded-full p-1 sm:p-2 lg:p-3">
                <Package className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">{stats.totalProducts}</div>
              <div className="flex items-center">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                <p className="text-xs lg:text-sm opacity-90">En inventario</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 lg:pb-3">
              <CardTitle className="text-xs sm:text-sm lg:text-lg font-medium opacity-90">Ingresos Totales</CardTitle>
              <div className="bg-white/20 rounded-full p-1 sm:p-2 lg:p-3">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 pt-0">
              <div className="text-sm sm:text-xl lg:text-4xl font-bold mb-1 lg:mb-2">
                {formatPrice(stats.totalRevenue)}
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                <p className="text-xs lg:text-sm opacity-90">Ingresos totales</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4 sm:mb-6">
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 h-10 text-sm"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 mr-2" /> : <Menu className="w-4 h-4 mr-2" />}
            {isMobileMenuOpen ? "Cerrar Menú" : "Abrir Menú de Navegación"}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mb-4 sm:mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <div className="space-y-2">
              {/* Dashboard con flecha */}
              <div>
                <Button
                  onClick={() => setShowDashboard(!showDashboard)}
                  variant="ghost"
                  className="w-full justify-between text-white hover:bg-white/10 h-8 text-sm"
                >
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Dashboard
                  </div>
                  {showDashboard ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                {showDashboard && (
                  <div className="ml-6 mt-2 p-2 bg-white/5 rounded-lg">
                    <AdminDashboard />
                  </div>
                )}
              </div>

              {/* Otros tabs */}
              {tabs.slice(1).map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setIsMobileMenuOpen(false)
                    }}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`w-full justify-start text-left h-8 text-sm ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{tab.label}</span>
                    {tab.id === "messages" && stats.unreadMessages > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white text-xs">{stats.unreadMessages}</Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Content con Tabs Mejoradas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6 lg:space-y-8">
          <TabsList className="hidden lg:flex bg-white/10 backdrop-blur-sm border-white/20 p-2 rounded-2xl shadow-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-white/20 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-sm lg:text-lg font-medium transition-all duration-200 flex items-center"
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  {tab.label}
                  {tab.id === "messages" && stats.unreadMessages > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white animate-pulse text-xs">{stats.unreadMessages}</Badge>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/10 shadow-2xl">
              <AdminDashboard />
            </div>
          </TabsContent>

          {/* Productos Tab */}
          <TabsContent value="products" className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/10 shadow-2xl">
              <AdminProducts />
            </div>
          </TabsContent>

          {/* Turnos Tab */}
          <TabsContent value="appointments" className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/10 shadow-2xl">
              <AdminAppointments />
            </div>
          </TabsContent>

          {/* Pedidos Tab */}
          <TabsContent value="orders" className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/10 shadow-2xl">
              <AdminOrders />
            </div>
          </TabsContent>

          {/* Usuarios Tab */}
          <TabsContent value="users" className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/10 shadow-2xl">
              <AdminUsers />
            </div>
          </TabsContent>

          {/* Mensajes Tab */}
          <TabsContent value="messages" className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/10 shadow-2xl">
              <AdminMessages />
            </div>
          </TabsContent>

          {/* Contabilidad Tab */}
          <TabsContent value="accounting" className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/10 shadow-2xl">
              <AdminAccounting />
            </div>
          </TabsContent>

          {/* Analíticas Tab */}
          <TabsContent value="analytics" className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-8 border border-white/10 shadow-2xl">
              <AdminAnalytics />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
