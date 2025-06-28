"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, ShoppingCart, DollarSign, MessageSquare } from "lucide-react"

interface AnalyticsData {
  users: any[]
  appointments: any[]
  orders: any[]
  services: any[]
  sales: any[]
  messages: any[]
  products: any[]
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    users: [],
    appointments: [],
    orders: [],
    services: [],
    sales: [],
    messages: [],
    products: [],
  })
  const [timeRange, setTimeRange] = useState("30")

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = () => {
    const users = JSON.parse(localStorage.getItem("admin_users") || "[]")
    const appointments = JSON.parse(localStorage.getItem("admin_appointments") || "[]")
    const orders = JSON.parse(localStorage.getItem("admin_orders") || "[]")
    const services = JSON.parse(localStorage.getItem("admin_services") || "[]")
    const sales = JSON.parse(localStorage.getItem("admin_sales") || "[]")
    const messages = JSON.parse(localStorage.getItem("admin_messages") || "[]")
    const products = JSON.parse(localStorage.getItem("admin_products") || "[]")

    setData({
      users,
      appointments,
      orders,
      services,
      sales,
      messages,
      products,
    })
  }

  // Filtrar datos por rango de tiempo
  const filterByTimeRange = (items: any[], dateField = "createdAt") => {
    const days = Number.parseInt(timeRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return items.filter((item) => new Date(item[dateField]) >= cutoffDate)
  }

  // Datos para gráficos
  const revenueData = () => {
    const filteredServices = filterByTimeRange(data.services, "date")
    const filteredSales = filterByTimeRange(data.sales, "date")

    const dailyRevenue = new Map()

    // Procesar servicios
    filteredServices.forEach((service) => {
      const date = new Date(service.date).toLocaleDateString("es-AR")
      dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + service.amount)
    })

    // Procesar ventas
    filteredSales.forEach((sale) => {
      const date = new Date(sale.date).toLocaleDateString("es-AR")
      dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + sale.amount)
    })

    return Array.from(dailyRevenue.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7) // Últimos 7 días
  }

  const servicesCategoryData = () => {
    const filteredServices = filterByTimeRange(data.services, "date")
    const categories = new Map()

    filteredServices.forEach((service) => {
      const category = service.category
      categories.set(category, (categories.get(category) || 0) + 1)
    })

    return Array.from(categories.entries()).map(([name, value]) => ({ name, value }))
  }

  const messagesTypeData = () => {
    const filteredMessages = filterByTimeRange(data.messages)
    const types = new Map()

    filteredMessages.forEach((message) => {
      const type = message.type
      types.set(type, (types.get(type) || 0) + 1)
    })

    return Array.from(types.entries()).map(([name, value]) => ({ name, value }))
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Estadísticas generales
  const stats = {
    totalRevenue: [...data.services, ...data.sales].reduce((sum, item) => sum + (item.amount || 0), 0),
    totalUsers: data.users.length,
    totalOrders: data.orders.length,
    totalMessages: data.messages.length,
    unreadMessages: data.messages.filter((m) => m.status === "unread").length,
    completedAppointments: data.appointments.filter((a) => a.status === "completed").length,
    activeProducts: data.products.filter((p) => p.isActive).length,
  }

  const filteredStats = {
    revenue: filterByTimeRange([...data.services, ...data.sales], "date").reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    ),
    users: filterByTimeRange(data.users).length,
    orders: filterByTimeRange(data.orders).length,
    messages: filterByTimeRange(data.messages).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analíticas
          </h2>
          <p className="text-muted-foreground">Reportes y estadísticas del sistema</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 días</SelectItem>
            <SelectItem value="30">Últimos 30 días</SelectItem>
            <SelectItem value="90">Últimos 90 días</SelectItem>
            <SelectItem value="365">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">${filteredStats.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total: ${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuarios</p>
                <p className="text-2xl font-bold text-blue-600">{filteredStats.users}</p>
                <p className="text-xs text-muted-foreground">Total: {stats.totalUsers}</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pedidos</p>
                <p className="text-2xl font-bold text-purple-600">{filteredStats.orders}</p>
                <p className="text-xs text-muted-foreground">Total: {stats.totalOrders}</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <ShoppingCart className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensajes</p>
                <p className="text-2xl font-bold text-orange-600">{filteredStats.messages}</p>
                <p className="text-xs text-muted-foreground">Sin leer: {stats.unreadMessages}</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de ingresos */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Diarios</CardTitle>
            <CardDescription>Últimos 7 días de ingresos por servicios y ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ingresos"]} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de servicios por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios por Categoría</CardTitle>
            <CardDescription>Distribución de servicios realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicesCategoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {servicesCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de mensajes por tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Mensajes por Tipo</CardTitle>
            <CardDescription>Consultas recibidas por tipo de servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messagesTypeData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métricas adicionales */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas del Sistema</CardTitle>
            <CardDescription>Indicadores clave de rendimiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tasa de conversión de mensajes</span>
                <span className="font-medium">
                  {stats.totalMessages > 0
                    ? Math.round(
                        (data.messages.filter((m) => m.status === "responded").length / stats.totalMessages) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  stats.totalMessages > 0
                    ? (data.messages.filter((m) => m.status === "responded").length / stats.totalMessages) * 100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Turnos completados</span>
                <span className="font-medium">
                  {data.appointments.length > 0
                    ? Math.round((stats.completedAppointments / data.appointments.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  data.appointments.length > 0 ? (stats.completedAppointments / data.appointments.length) * 100 : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Productos activos</span>
                <span className="font-medium">
                  {data.products.length > 0 ? Math.round((stats.activeProducts / data.products.length) * 100) : 0}%
                </span>
              </div>
              <Progress
                value={data.products.length > 0 ? (stats.activeProducts / data.products.length) * 100 : 0}
                className="h-2"
              />
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Productos con stock bajo</span>
                <Badge variant="destructive">{data.products.filter((p) => p.stock <= 5).length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mensajes sin responder</span>
                <Badge variant="destructive">{stats.unreadMessages}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Turnos pendientes</span>
                <Badge variant="secondary">{data.appointments.filter((a) => a.status === "pending").length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
