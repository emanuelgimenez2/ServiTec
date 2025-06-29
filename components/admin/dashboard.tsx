"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  ShoppingBag,
  Calendar,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Star,
  Activity,
  BarChart3,
  Zap,
  ChevronRight,
} from "lucide-react"
import {
  turnosService,
  servicioService,
  ventasService,
  mensajeService,
  usuarioService,
  productosService,
} from "@/lib/firebase-services"

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalAppointments: number
  totalMessages: number
  totalSales: number
  totalRevenue: number
  pendingAppointments: number
  unreadMessages: number
  activeProducts: number
  completedServices: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalAppointments: 0,
    totalMessages: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingAppointments: 0,
    unreadMessages: 0,
    activeProducts: 0,
    completedServices: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [showAllActivity, setShowAllActivity] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Cargar datos en paralelo
      const [users, products, appointments, messages, sales, services] = await Promise.all([
        usuarioService.getAllUsers(),
        productosService.getAllProducts(),
        turnosService.getAllAppointments(),
        mensajeService.getMessages(),
        ventasService.getAllSales(),
        servicioService.getAllServices(),
      ])

      // Calcular estadísticas
      const totalRevenue = sales.reduce((sum, sale) => sum + Number.parseFloat(sale.totalPrice), 0)
      const pendingAppointments = appointments.filter((apt) => apt.status === "pending").length
      const unreadMessages = messages.filter((msg) => msg.status === "unread").length
      const activeProducts = products.filter((prod) => prod.isActive).length
      const completedServices = services.filter((serv) => serv.completed).length

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalAppointments: appointments.length,
        totalMessages: messages.length,
        totalSales: sales.length,
        totalRevenue,
        pendingAppointments,
        unreadMessages,
        activeProducts,
        completedServices,
      })

      // Actividad reciente (últimos 10 elementos para móvil)
      const recentItems = [
        ...appointments.slice(0, 4).map((item) => ({ type: "appointment", data: item })),
        ...messages.slice(0, 4).map((item) => ({ type: "message", data: item })),
        ...sales.slice(0, 2).map((item) => ({ type: "sale", data: item })),
      ]
      setRecentActivity(recentItems)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, trend, color, subtitle, priority = false }: any) => (
    <Card
      className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group ${priority ? "ring-2 ring-orange-500/50" : ""}`}
    >
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-white/70 text-xs sm:text-sm font-medium">{title}</p>
            <div className="flex items-baseline space-x-1 sm:space-x-2">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{value}</p>
              {trend && (
                <Badge className={`${color} text-xs hidden sm:inline-flex`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {trend}
                </Badge>
              )}
            </div>
            {subtitle && <p className="text-white/50 text-xs hidden sm:block">{subtitle}</p>}
          </div>
          <div
            className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/70 text-sm sm:text-base">Resumen general de tu negocio</p>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20 animate-pulse">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="h-16 sm:h-20 bg-white/10 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">Resumen general de tu negocio</p>
        </div>
        <Button
          onClick={loadDashboardData}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm"
        >
          <Activity className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Actualizar</span>
          <span className="sm:hidden">↻</span>
        </Button>
      </div>

      {/* Stats Grid - Más compacto en móvil */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Estadísticas prioritarias para móvil */}
        <StatCard
          title="Citas Pendientes"
          value={stats.pendingAppointments}
          icon={Clock}
          color="from-orange-500 to-orange-600"
          subtitle={`${stats.totalAppointments} citas totales`}
          priority={true}
        />
        <StatCard
          title="Mensajes Sin Leer"
          value={stats.unreadMessages}
          icon={MessageSquare}
          color="from-red-500 to-red-600"
          subtitle={`${stats.totalMessages} mensajes totales`}
          priority={true}
        />
        <StatCard
          title="Productos Activos"
          value={stats.activeProducts}
          icon={Package}
          trend="+8%"
          color="from-green-500 to-green-600"
          subtitle={`${stats.totalProducts} productos totales`}
        />
        <StatCard
          title="Ingresos"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}k`}
          icon={DollarSign}
          trend="+23%"
          color="from-emerald-500 to-emerald-600"
          subtitle="Ingresos acumulados"
        />

        {/* Estadísticas adicionales - ocultas en móvil pequeño */}
        <div className="hidden lg:contents">
          <StatCard
            title="Usuarios Totales"
            value={stats.totalUsers}
            icon={Users}
            trend="+12%"
            color="from-blue-500 to-blue-600"
            subtitle="Usuarios registrados"
          />
          <StatCard
            title="Ventas Realizadas"
            value={stats.totalSales}
            icon={ShoppingBag}
            trend="+15%"
            color="from-purple-500 to-purple-600"
            subtitle="Ventas completadas"
          />
          <StatCard
            title="Servicios Completados"
            value={stats.completedServices}
            icon={Star}
            trend="+18%"
            color="from-yellow-500 to-yellow-600"
            subtitle="Servicios finalizados"
          />
          <StatCard
            title="Rendimiento"
            value="98.5%"
            icon={BarChart3}
            trend="+2%"
            color="from-indigo-500 to-indigo-600"
            subtitle="Satisfacción general"
          />
        </div>
      </div>

      {/* Recent Activity & Quick Actions - Más compacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center text-sm sm:text-base lg:text-lg">
                <Activity className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Actividad Reciente
              </CardTitle>
              {recentActivity.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllActivity(!showAllActivity)}
                  className="text-white/70 hover:text-white text-xs sm:text-sm"
                >
                  {showAllActivity ? "Ver menos" : "Ver todo"}
                  <ChevronRight className={`ml-1 h-3 w-3 transition-transform ${showAllActivity ? "rotate-90" : ""}`} />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-2 sm:space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, showAllActivity ? recentActivity.length : 3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0">
                    {item.type === "appointment" && <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                    {item.type === "message" && <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                    {item.type === "sale" && <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate text-xs sm:text-sm">
                      {item.type === "appointment" && `Nueva cita: ${item.data.name}`}
                      {item.type === "message" && `Mensaje de: ${item.data.nombre}`}
                      {item.type === "sale" && `Venta: ${item.data.productName}`}
                    </p>
                    <p className="text-white/60 text-xs">{new Date(item.data.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 text-xs">
                    {item.type === "appointment" && item.data.status}
                    {item.type === "message" && item.data.status}
                    {item.type === "sale" && "Completada"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Activity className="h-8 w-8 sm:h-12 sm:w-12 text-white/30 mx-auto mb-3 sm:mb-4" />
                <p className="text-white/60 text-sm sm:text-base">No hay actividad reciente</p>
              </div>
            )}
          </CardContent>
        </Card>

       
      </div>
    </div>
  )
}
