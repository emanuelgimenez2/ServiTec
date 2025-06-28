"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Activity,
  Star,
  Award,
  Zap,
  Calculator,
  Package,
  Plus,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import {
  servicioService,
  ventasService,
  productosService,
  turnosService,
  mensajeService,
  usuarioService,
} from "@/lib/firebase-services"

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

      // Calculate stats
      const pendingAppointments = appointmentsData.filter((a) => a.status === "pending").length
      const completedAppointments = appointmentsData.filter((a) => a.status === "completed").length
      const servicesRevenue = servicesData.reduce((sum, service) => sum + (Number.parseFloat(service.price) || 0), 0)
      const salesRevenue = salesData.reduce((sum, sale) => sum + (Number.parseFloat(sale.totalPrice) || 0), 0)
      const unreadMessages = messagesData.filter((m) => m.status === "unread").length

      setStats({
        totalUsers: usersData.length,
        totalAppointments: appointmentsData.length,
        totalOrders: 0, // No hay órdenes por ahora
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

  const addProduct = () => {
    const product = {
      id: Date.now(),
      ...newProduct,
      createdAt: new Date().toISOString(),
      rating: 4.5,
      reviews: 0,
      isNew: true,
      originalPrice: Number.parseFloat(newProduct.salePrice) * 1.2,
      price: Number.parseFloat(newProduct.salePrice),
      image: newProduct.image || "/placeholder.svg?height=300&width=300",
      images: [newProduct.image || "/placeholder.svg?height=600&width=600"],
      specifications: {
        Marca: newProduct.brand,
        Descripción: newProduct.description,
        ...newProduct.specifications,
      },
    }

    // Add to admin products
    const updatedProducts = [...products, product]
    setProducts(updatedProducts)
    localStorage.setItem("admin_products", JSON.stringify(updatedProducts))

    // Add to store products (for tienda page)
    const storeProducts = JSON.parse(localStorage.getItem("store_products") || "[]")
    const updatedStoreProducts = [...storeProducts, product]
    localStorage.setItem("store_products", JSON.stringify(updatedStoreProducts))

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
    loadData()
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Panel de Administración
                  <Zap className="inline-block w-8 h-8 ml-2 text-yellow-400" />
                </h1>
                <p className="text-white/80 text-lg">Bienvenido de vuelta, {user.name}</p>
                <div className="flex items-center mt-2">
                  <Award className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-white/90">Administrador Principal</span>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <p className="text-white/80 text-sm mt-2">Sistema Activo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Usuarios</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <p className="text-xs opacity-90">+{stats.monthlyGrowth}% este mes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Servicios Realizados</CardTitle>
              <FileText className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalServices}</div>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                <p className="text-xs opacity-90">Servicios completados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Mensajes</CardTitle>
              <MessageSquare className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalMessages}</div>
              <div className="flex items-center mt-2">
                <span className="text-xs opacity-90">{stats.unreadMessages} sin leer</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Ingresos Totales</CardTitle>
              <DollarSign className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <p className="text-xs opacity-90">Ingresos totales</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-white/20 text-white">
              Turnos
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white/20 text-white">
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white/20 text-white">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-white/20 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensajes
              {stats.unreadMessages > 0 && <Badge className="ml-2 bg-red-500 text-white">{stats.unreadMessages}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="accounting" className="data-[state=active]:bg-white/20 text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Contabilidad
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-white/20 text-white">
              <Package className="w-4 h-4 mr-2" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20 text-white">
              Analíticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Gestión de Turnos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white/90">Cliente</TableHead>
                      <TableHead className="text-white/90">Servicio</TableHead>
                      <TableHead className="text-white/90">Fecha</TableHead>
                      <TableHead className="text-white/90">Hora</TableHead>
                      <TableHead className="text-white/90">Estado</TableHead>
                      <TableHead className="text-white/90">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id} className="border-white/10">
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{appointment.name}</div>
                            <div className="text-sm text-white/70">{appointment.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">{appointment.serviceName}</TableCell>
                        <TableCell className="text-white">{formatDate(appointment.date)}</TableCell>
                        <TableCell className="text-white">{appointment.time}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {appointment.status === "pending" && (
                              <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}>
                                Confirmar
                              </Button>
                            )}
                            {appointment.status === "confirmed" && (
                              <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, "completed")}>
                                Completar
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Usuarios Registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white/90">Nombre</TableHead>
                      <TableHead className="text-white/90">Email</TableHead>
                      <TableHead className="text-white/90">Teléfono</TableHead>
                      <TableHead className="text-white/90">Fecha de Registro</TableHead>
                      <TableHead className="text-white/90">Rol</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-white/10">
                        <TableCell className="font-medium text-white">{user.name}</TableCell>
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell className="text-white">{user.phone}</TableCell>
                        <TableCell className="text-white">{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "administrador" ? "default" : "secondary"}>{user.role}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white/90">ID</TableHead>
                      <TableHead className="text-white/90">Cliente</TableHead>
                      <TableHead className="text-white/90">Productos</TableHead>
                      <TableHead className="text-white/90">Total</TableHead>
                      <TableHead className="text-white/90">Fecha</TableHead>
                      <TableHead className="text-white/90">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-white/10">
                        <TableCell className="font-medium text-white">#{order.id}</TableCell>
                        <TableCell className="text-white">{order.customerName}</TableCell>
                        <TableCell className="text-white">{order.items?.length || 0} productos</TableCell>
                        <TableCell className="text-white">{formatPrice(order.total)}</TableCell>
                        <TableCell className="text-white">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nueva pestaña de Mensajes */}
          <TabsContent value="messages">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Mensajes Recibidos
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-500 text-white">{stats.unreadMessages} Sin Leer</Badge>
                    <Badge className="bg-blue-500 text-white">{stats.totalMessages} Total</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nombre, teléfono, email o mensaje..."
                      value={messageFilters.search}
                      onChange={(e) => setMessageFilters({ ...messageFilters, search: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    />
                  </div>
                  <Select
                    value={messageFilters.type}
                    onValueChange={(value) => setMessageFilters({ ...messageFilters, type: value })}
                  >
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los servicios</SelectItem>
                      <SelectItem value="reparacion">Reparación PC</SelectItem>
                      <SelectItem value="starlink">Starlink</SelectItem>
                      <SelectItem value="camaras">Cámaras</SelectItem>
                      <SelectItem value="desarrollo">Desarrollo Web</SelectItem>
                      <SelectItem value="contacto">Contacto General</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={messageFilters.status}
                    onValueChange={(value) => setMessageFilters({ ...messageFilters, status: value })}
                  >
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="unread">Sin Leer</SelectItem>
                      <SelectItem value="responded">Respondido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white/90">Cliente</TableHead>
                      <TableHead className="text-white/90">Servicio</TableHead>
                      <TableHead className="text-white/90">Mensaje</TableHead>
                      <TableHead className="text-white/90">Fecha</TableHead>
                      <TableHead className="text-white/90">Estado</TableHead>
                      <TableHead className="text-white/90">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className="border-white/10">
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{message.nombre}</div>
                            <div className="text-sm text-white/70">{message.telefono}</div>
                            <div className="text-sm text-white/70">{message.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center space-x-2">{getServiceTypeBadge(message.serviceType)}</div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="max-w-xs truncate">{message.mensaje}</div>
                        </TableCell>
                        <TableCell className="text-white">{formatDate(message.createdAt)}</TableCell>
                        <TableCell>{getMessageStatusBadge(message.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (message.status === "unread") {
                                      updateMessageStatus(message.id, "responded")
                                    }
                                  }}
                                >
                                  Ver
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Mensaje de {message.nombre}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <strong>Nombre:</strong> {message.nombre}
                                    </div>
                                    <div>
                                      <strong>Teléfono:</strong> {message.telefono}
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {message.email}
                                    </div>
                                    <div>
                                      <strong>Servicio:</strong> {getServiceTypeBadge(message.serviceType)}
                                    </div>
                                  </div>
                                  <div>
                                    <strong>Mensaje:</strong>
                                    <Textarea value={message.mensaje} readOnly className="mt-2" rows={6} />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      onClick={() => updateMessageStatus(message.id, "responded")}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Marcar como Respondido
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resto de pestañas existentes */}
          <TabsContent value="accounting">
            <Tabs defaultValue="services" className="space-y-4">
              <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
                <TabsTrigger value="services" className="data-[state=active]:bg-white/20 text-white">
                  Servicios Realizados
                </TabsTrigger>
                <TabsTrigger value="sales" className="data-[state=active]:bg-white/20 text-white">
                  Ventas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Servicios Realizados</CardTitle>
                      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Servicio
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="clientName">Nombre del Cliente</Label>
                              <Input
                                id="clientName"
                                value={newService.clientName}
                                onChange={(e) => setNewService({ ...newService, clientName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="clientPhone">Teléfono</Label>
                              <Input
                                id="clientPhone"
                                value={newService.clientPhone}
                                onChange={(e) => setNewService({ ...newService, clientPhone: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="serviceType">Tipo de Servicio</Label>
                              <Select
                                value={newService.serviceType}
                                onValueChange={(value) => setNewService({ ...newService, serviceType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pc">Reparación PC</SelectItem>
                                  <SelectItem value="starlink">Starlink</SelectItem>
                                  <SelectItem value="camara">Cámaras</SelectItem>
                                  <SelectItem value="web">Página Web</SelectItem>
                                  <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {newService.serviceType === "otro" && (
                              <div>
                                <Label htmlFor="customService">Especificar Servicio</Label>
                                <Input
                                  id="customService"
                                  value={newService.customService}
                                  onChange={(e) => setNewService({ ...newService, customService: e.target.value })}
                                />
                              </div>
                            )}
                            <div>
                              <Label htmlFor="date">Fecha</Label>
                              <Input
                                id="date"
                                type="date"
                                value={newService.date}
                                onChange={(e) => setNewService({ ...newService, date: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="price">Precio</Label>
                              <Input
                                id="price"
                                type="number"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="notes">Notas</Label>
                              <Textarea
                                id="notes"
                                value={newService.notes}
                                onChange={(e) => setNewService({ ...newService, notes: e.target.value })}
                              />
                            </div>
                            <div className="col-span-2 flex items-center space-x-2">
                              <Checkbox
                                id="completed"
                                checked={newService.completed}
                                onCheckedChange={(checked) => setNewService({ ...newService, completed: checked })}
                              />
                              <Label htmlFor="completed">Servicio Completado</Label>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={addService}>Agregar Servicio</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4 mb-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Buscar por cliente, teléfono o servicio..."
                          value={serviceFilters.search}
                          onChange={(e) => setServiceFilters({ ...serviceFilters, search: e.target.value })}
                        />
                      </div>
                      <Select
                        value={serviceFilters.type}
                        onChange={(value) => setServiceFilters({ ...serviceFilters, type: value })}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los servicios</SelectItem>
                          <SelectItem value="pc">Reparación PC</SelectItem>
                          <SelectItem value="starlink">Starlink</SelectItem>
                          <SelectItem value="camara">Cámaras</SelectItem>
                          <SelectItem value="web">Página Web</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-white/90">Cliente</TableHead>
                          <TableHead className="text-white/90">Servicio</TableHead>
                          <TableHead className="text-white/90">Fecha</TableHead>
                          <TableHead className="text-white/90">Precio</TableHead>
                          <TableHead className="text-white/90">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredServices.map((service) => (
                          <TableRow key={service.id} className="border-white/10">
                            <TableCell className="text-white">
                              <div>
                                <div className="font-medium">{service.clientName}</div>
                                <div className="text-sm text-white/70">{service.clientPhone}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-white">
                              <div className="flex items-center space-x-2">
                                {getServiceTypeBadge(service.serviceType)}
                                <span>{service.serviceType}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-white">{formatDate(service.date)}</TableCell>
                            <TableCell className="text-white">
                              {formatPrice(Number.parseFloat(service.price))}
                            </TableCell>
                            <TableCell>
                              <Badge variant={service.completed ? "default" : "secondary"}>
                                {service.completed ? "Completado" : "Pendiente"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sales">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Ventas Realizadas</CardTitle>
                      <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Venta
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Agregar Nueva Venta</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="productName">Nombre del Producto</Label>
                              <Input
                                id="productName"
                                value={newSale.productName}
                                onChange={(e) => setNewSale({ ...newSale, productName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="saleClientName">Nombre del Cliente</Label>
                              <Input
                                id="saleClientName"
                                value={newSale.clientName}
                                onChange={(e) => setNewSale({ ...newSale, clientName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="saleClientPhone">Teléfono</Label>
                              <Input
                                id="saleClientPhone"
                                value={newSale.clientPhone}
                                onChange={(e) => setNewSale({ ...newSale, clientPhone: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="quantity">Cantidad</Label>
                              <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={newSale.quantity}
                                onChange={(e) => setNewSale({ ...newSale, quantity: Number.parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="unitPrice">Precio Unitario</Label>
                              <Input
                                id="unitPrice"
                                type="number"
                                value={newSale.unitPrice}
                                onChange={(e) => setNewSale({ ...newSale, unitPrice: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="saleDate">Fecha</Label>
                              <Input
                                id="saleDate"
                                type="date"
                                value={newSale.date}
                                onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="saleNotes">Notas</Label>
                              <Textarea
                                id="saleNotes"
                                value={newSale.notes}
                                onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>
                                Precio Total:{" "}
                                {formatPrice(Number.parseFloat(newSale.unitPrice || 0) * newSale.quantity)}
                              </Label>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddSaleOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={addSale}>Agregar Venta</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Input
                        placeholder="Buscar por cliente, teléfono o producto..."
                        value={saleFilters.search}
                        onChange={(e) => setSaleFilters({ ...saleFilters, search: e.target.value })}
                      />
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-white/90">Producto</TableHead>
                          <TableHead className="text-white/90">Cliente</TableHead>
                          <TableHead className="text-white/90">Cantidad</TableHead>
                          <TableHead className="text-white/90">Precio Unit.</TableHead>
                          <TableHead className="text-white/90">Total</TableHead>
                          <TableHead className="text-white/90">Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSales.map((sale) => (
                          <TableRow key={sale.id} className="border-white/10">
                            <TableCell className="text-white font-medium">{sale.productName}</TableCell>
                            <TableCell className="text-white">
                              <div>
                                <div className="font-medium">{sale.clientName}</div>
                                <div className="text-sm text-white/70">{sale.clientPhone}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-white">{sale.quantity}</TableCell>
                            <TableCell className="text-white">
                              {formatPrice(Number.parseFloat(sale.unitPrice))}
                            </TableCell>
                            <TableCell className="text-white">
                              {formatPrice(Number.parseFloat(sale.totalPrice))}
                            </TableCell>
                            <TableCell className="text-white">{formatDate(sale.date)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Nueva pestaña de Productos */}
          <TabsContent value="products">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Gestión de Productos</CardTitle>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="productName">Nombre del Producto</Label>
                          <Input
                            id="productName"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="productBrand">Marca</Label>
                          <Input
                            id="productBrand"
                            value={newProduct.brand}
                            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="productCategory">Categoría</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Notebooks">Notebooks</SelectItem>
                              <SelectItem value="Celulares">Celulares</SelectItem>
                              <SelectItem value="Parlantes">Parlantes</SelectItem>
                              <SelectItem value="Streaming">Streaming</SelectItem>
                              <SelectItem value="Smart Home">Smart Home</SelectItem>
                              <SelectItem value="Accesorios">Accesorios</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="productStock">Stock</Label>
                          <Input
                            id="productStock"
                            type="number"
                            min="0"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="purchasePrice">Precio de Compra (Privado)</Label>
                          <Input
                            id="purchasePrice"
                            type="number"
                            value={newProduct.purchasePrice}
                            onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="salePrice">Precio de Venta</Label>
                          <Input
                            id="salePrice"
                            type="number"
                            value={newProduct.salePrice}
                            onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="productDescription">Descripción</Label>
                          <Textarea
                            id="productDescription"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="productImage">URL de Imagen</Label>
                          <Input
                            id="productImage"
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            placeholder="/placeholder.svg?height=300&width=300"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={addProduct}>Agregar Producto</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nombre o marca..."
                      value={productFilters.search}
                      onChange={(e) => setProductFilters({ ...productFilters, search: e.target.value })}
                    />
                  </div>
                  <Select
                    value={productFilters.category}
                    onChange={(value) => setProductFilters({ ...productFilters, category: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las categorías</SelectItem>
                      <SelectItem value="Notebooks">Notebooks</SelectItem>
                      <SelectItem value="Celulares">Celulares</SelectItem>
                      <SelectItem value="Parlantes">Parlantes</SelectItem>
                      <SelectItem value="Streaming">Streaming</SelectItem>
                      <SelectItem value="Smart Home">Smart Home</SelectItem>
                      <SelectItem value="Accesorios">Accesorios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white/90">Producto</TableHead>
                      <TableHead className="text-white/90">Categoría</TableHead>
                      <TableHead className="text-white/90">Stock</TableHead>
                      <TableHead className="text-white/90">P. Compra</TableHead>
                      <TableHead className="text-white/90">P. Venta</TableHead>
                      <TableHead className="text-white/90">Margen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const margin =
                        ((Number.parseFloat(product.salePrice) - Number.parseFloat(product.purchasePrice)) /
                          Number.parseFloat(product.purchasePrice)) *
                        100
                      return (
                        <TableRow key={product.id} className="border-white/10">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-white/70">{product.brand}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            <Badge variant={Number.parseInt(product.stock) > 5 ? "default" : "destructive"}>
                              {product.stock} unidades
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            {formatPrice(Number.parseFloat(product.purchasePrice))}
                          </TableCell>
                          <TableCell className="text-white">
                            {formatPrice(Number.parseFloat(product.salePrice))}
                          </TableCell>
                          <TableCell className="text-white">
                            <Badge variant={margin > 30 ? "default" : margin > 15 ? "secondary" : "destructive"}>
                              {margin.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Servicios Más Solicitados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Reparación de Computadoras", count: 15, percentage: 40, color: "bg-blue-500" },
                      { name: "Instalación Starlink", count: 8, percentage: 25, color: "bg-green-500" },
                      { name: "Cámaras de Seguridad", count: 6, percentage: 20, color: "bg-purple-500" },
                      { name: "Desarrollo Web", count: 4, percentage: 15, color: "bg-orange-500" },
                    ].map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{service.name}</div>
                          <div className="text-sm text-white/70">{service.count} solicitudes</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{service.percentage}%</div>
                          <div className="w-20 bg-white/20 rounded-full h-2">
                            <div
                              className={`${service.color} h-2 rounded-full`}
                              style={{ width: `${service.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Productos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sales.slice(0, 5).map((sale, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{sale.productName}</div>
                          <div className="text-sm text-white/70">{sale.quantity} vendidos</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">
                            {formatPrice(Number.parseFloat(sale.totalPrice))}
                          </div>
                          <div className="text-sm text-white/70">Total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                        <div>
                          <div className="font-medium text-white">Ingresos por Servicios</div>
                          <div className="text-sm text-white/70">{stats.totalServices} servicios</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-400">
                        {formatPrice(
                          services.reduce((sum, service) => sum + (Number.parseFloat(service.price) || 0), 0),
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <div className="flex items-center">
                        <ShoppingCart className="w-8 h-8 text-blue-400 mr-3" />
                        <div>
                          <div className="font-medium text-white">Ingresos por Ventas</div>
                          <div className="text-sm text-white/70">{stats.totalSales} ventas</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {formatPrice(sales.reduce((sum, sale) => sum + (Number.parseFloat(sale.totalPrice) || 0), 0))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center">
                        <Package className="w-8 h-8 text-purple-400 mr-3" />
                        <div>
                          <div className="font-medium text-white">Valor del Inventario</div>
                          <div className="text-sm text-white/70">{stats.totalProducts} productos</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-400">
                        {formatPrice(
                          products.reduce(
                            (sum, product) =>
                              sum + (Number.parseFloat(product.purchasePrice) * Number.parseInt(product.stock) || 0),
                            0,
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Métricas de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-white mb-2">
                        <span>Turnos Completados</span>
                        <span>
                          {stats.completedAppointments}/{stats.totalAppointments}
                        </span>
                      </div>
                      <Progress
                        value={(stats.completedAppointments / Math.max(stats.totalAppointments, 1)) * 100}
                        className="bg-white/20"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-white mb-2">
                        <span>Productos en Stock</span>
                        <span>
                          {products.filter((p) => Number.parseInt(p.stock) > 0).length}/{products.length}
                        </span>
                      </div>
                      <Progress
                        value={
                          (products.filter((p) => Number.parseInt(p.stock) > 0).length / Math.max(products.length, 1)) *
                          100
                        }
                        className="bg-white/20"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-white mb-2">
                        <span>Mensajes Respondidos</span>
                        <span>
                          {stats.totalMessages - stats.unreadMessages}/{stats.totalMessages}
                        </span>
                      </div>
                      <Progress
                        value={((stats.totalMessages - stats.unreadMessages) / Math.max(stats.totalMessages, 1)) * 100}
                        className="bg-white/20"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-white mb-2">
                        <span>Satisfacción del Cliente</span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          {stats.customerSatisfaction}/5
                        </span>
                      </div>
                      <Progress value={(stats.customerSatisfaction / 5) * 100} className="bg-white/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
