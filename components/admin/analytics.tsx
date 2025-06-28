"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Activity,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  ChevronRight,
} from "lucide-react"
import { turnosService, ventasService, mensajeService, productosService } from "@/lib/firebase-services"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState<any[]>([])
  const [appointmentsData, setAppointmentsData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [showAllCharts, setShowAllCharts] = useState(false)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    growthRate: 0,
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)

      const [sales, appointments, products, messages] = await Promise.all([
        ventasService.getAllSales(),
        turnosService.getAllAppointments(),
        productosService.getAllProducts(),
        mensajeService.getMessages(),
      ])

      // Procesar datos de ventas por mes
      const salesByMonth = sales.reduce((acc: any, sale) => {
        const month = new Date(sale.createdAt).toLocaleDateString("es-ES", { month: "short" })
        acc[month] = (acc[month] || 0) + Number.parseFloat(sale.totalPrice)
        return acc
      }, {})

      const salesChartData = Object.entries(salesByMonth).map(([month, revenue]) => ({
        month,
        revenue,
        sales: sales.filter((s) => new Date(s.createdAt).toLocaleDateString("es-ES", { month: "short" }) === month)
          .length,
      }))

      // Procesar datos de citas por estado
      const appointmentsByStatus = appointments.reduce((acc: any, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1
        return acc
      }, {})

      const appointmentsChartData = Object.entries(appointmentsByStatus).map(([status, count]) => ({
        status,
        count,
      }))

      // Procesar datos por categoría de productos
      const productsByCategory = products.reduce((acc: any, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1
        return acc
      }, {})

      const categoryChartData = Object.entries(productsByCategory).map(([category, count]) => ({
        category,
        count,
      }))

      // Datos de ingresos por semana (últimas 8 semanas)
      const revenueByWeek = []
      for (let i = 7; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i * 7)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        const weekEnd = new Date(date.setDate(date.getDate() + 6))

        const weekSales = sales.filter((sale) => {
          const saleDate = new Date(sale.createdAt)
          return saleDate >= weekStart && saleDate <= weekEnd
        })

        const weekRevenue = weekSales.reduce((sum, sale) => sum + Number.parseFloat(sale.totalPrice), 0)

        revenueByWeek.push({
          week: `S${8 - i}`,
          revenue: weekRevenue,
          orders: weekSales.length,
        })
      }

      // Calcular estadísticas
      const totalRevenue = sales.reduce((sum, sale) => sum + Number.parseFloat(sale.totalPrice), 0)
      const totalSales = sales.length
      const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0
      const conversionRate = messages.length > 0 ? (totalSales / messages.length) * 100 : 0

      setSalesData(salesChartData)
      setAppointmentsData(appointmentsChartData)
      setCategoryData(categoryChartData)
      setRevenueData(revenueByWeek)
      setStats({
        totalRevenue,
        totalSales,
        avgOrderValue,
        conversionRate,
        growthRate: 15.3, // Simulado
      })
    } catch (error) {
      console.error("Error loading analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, trend, isPositive, subtitle }: any) => (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-white/70 text-xs sm:text-sm font-medium">{title}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
                  {trend}
                </span>
              </div>
            )}
            {subtitle && <p className="text-white/50 text-xs hidden sm:block">{subtitle}</p>}
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Analíticas</h1>
            <p className="text-white/70 text-sm sm:text-base">Análisis detallado de tu negocio</p>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
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
            Analíticas
          </h1>
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">
            Análisis detallado del rendimiento de tu negocio
          </p>
        </div>
        <Button
          onClick={loadAnalyticsData}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm"
        >
          <Activity className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Actualizar</span>
          <span className="sm:hidden">↻</span>
        </Button>
      </div>

      {/* Stats Cards - 2 columnas en móvil */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}k`}
          icon={DollarSign}
          trend="+15.3%"
          isPositive={true}
          subtitle="vs mes anterior"
        />
        <StatCard
          title="Ventas Totales"
          value={stats.totalSales}
          icon={ShoppingBag}
          trend="+8.2%"
          isPositive={true}
          subtitle="órdenes completadas"
        />
        <StatCard
          title="Valor Promedio"
          value={`$${(stats.avgOrderValue / 1000).toFixed(1)}k`}
          icon={BarChart3}
          trend="+12.1%"
          isPositive={true}
          subtitle="por orden"
        />
        <StatCard
          title="Conversión"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend="+2.4%"
          isPositive={true}
          subtitle="mensajes a ventas"
        />
      </div>

      {/* Charts Grid - Más compacto en móvil */}
      <div className="space-y-4 sm:space-y-6">
        {/* Gráfico principal - siempre visible */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-white flex items-center text-sm sm:text-base lg:text-lg">
              <LineChartIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Ingresos por Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="url(#colorRevenue)" strokeWidth={2} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Botón para mostrar más gráficos */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllCharts(!showAllCharts)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm"
          >
            {showAllCharts ? "Ocultar gráficos" : "Ver más gráficos"}
            <ChevronRight
              className={`ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform ${showAllCharts ? "rotate-90" : ""}`}
            />
          </Button>
        </div>

        {/* Gráficos adicionales - colapsables */}
        {showAllCharts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Sales Chart */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-white flex items-center text-sm sm:text-base lg:text-lg">
                  <BarChart3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Ventas por Mes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="sales" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointments Status */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-white flex items-center text-sm sm:text-base lg:text-lg">
                  <PieChartIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Estado de Citas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={appointmentsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                      fontSize={10}
                    >
                      {appointmentsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
