"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  ShoppingCart,
  DollarSign,
  Package,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface DashboardStats {
  users: number
  appointments: number
  orders: number
  revenue: number
  products: number
  messages: {
    total: number
    unread: number
    responded: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    appointments: 0,
    orders: 0,
    revenue: 0,
    products: 0,
    messages: { total: 0, unread: 0, responded: 0 },
  })

  useEffect(() => {
    // Simular carga de estadísticas
    const loadStats = () => {
      const users = JSON.parse(localStorage.getItem("admin_users") || "[]")
      const appointments = JSON.parse(localStorage.getItem("admin_appointments") || "[]")
      const orders = JSON.parse(localStorage.getItem("admin_orders") || "[]")
      const services = JSON.parse(localStorage.getItem("admin_services") || "[]")
      const sales = JSON.parse(localStorage.getItem("admin_sales") || "[]")
      const products = JSON.parse(localStorage.getItem("admin_products") || "[]")
      const messages = JSON.parse(localStorage.getItem("admin_messages") || "[]")

      const totalRevenue = [...services, ...sales].reduce((sum, item) => sum + (item.amount || 0), 0)
      const unreadMessages = messages.filter((msg: any) => msg.status === "unread").length
      const respondedMessages = messages.filter((msg: any) => msg.status === "responded").length

      setStats({
        users: users.length,
        appointments: appointments.length,
        orders: orders.length,
        revenue: totalRevenue,
        products: products.length,
        messages: {
          total: messages.length,
          unread: unreadMessages,
          responded: respondedMessages,
        },
      })
    }

    loadStats()
    const interval = setInterval(loadStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const responseRate =
    stats.messages.total > 0 ? Math.round((stats.messages.responded / stats.messages.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground">Resumen general del sistema ServiTec</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          <CheckCircle className="w-4 h-4 mr-1" />
          Sistema Activo
        </Badge>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
            <p className="text-xs text-muted-foreground">Usuarios registrados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.appointments}</div>
            <p className="text-xs text-muted-foreground">Citas programadas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.orders}</div>
            <p className="text-xs text-muted-foreground">Órdenes de compra</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ingresos totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Mensajes y Productos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Sistema de Mensajes
            </CardTitle>
            <CardDescription>Gestión de consultas y solicitudes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total de mensajes</span>
              <Badge variant="secondary">{stats.messages.total}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Sin responder
              </span>
              <Badge variant="destructive">{stats.messages.unread}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Respondidos
              </span>
              <Badge variant="default" className="bg-green-500">
                {stats.messages.responded}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tasa de respuesta</span>
                <span className="font-medium">{responseRate}%</span>
              </div>
              <Progress value={responseRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-500" />
              Inventario
            </CardTitle>
            <CardDescription>Estado del inventario de productos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Productos totales</span>
              <Badge variant="secondary">{stats.products}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                En stock
              </span>
              <Badge variant="default" className="bg-blue-500">
                {Math.floor(stats.products * 0.8)}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                Stock bajo
              </span>
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                {Math.floor(stats.products * 0.2)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Disponibilidad</span>
                <span className="font-medium">80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas importantes */}
      {stats.messages.unread > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Atención Requerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              Tienes {stats.messages.unread} mensaje{stats.messages.unread !== 1 ? "s" : ""} sin responder. Revisa la
              sección de mensajes para atender las consultas pendientes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
