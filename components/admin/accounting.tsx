"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wrench,
  ShoppingBag,
  Edit,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react"
import { servicioService, ventasService } from "@/lib/firebase-services"

interface ServiceRecord {
  id: string
  type: "service"
  category: "Reparación PC" | "Starlink" | "Cámaras" | "Desarrollo Web" | string
  description: string
  client: string
  amount: number
  date: string
  status: "completed" | "pending" | "cancelled"
}

interface SaleRecord {
  id: string
  type: "sale"
  productName: string
  quantity: number
  unitPrice: number
  amount: number
  client: string
  date: string
  status: "completed" | "pending" | "refunded"
}

type AccountingRecord = ServiceRecord | SaleRecord

export default function AdminAccounting() {
  const [records, setRecords] = useState<AccountingRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AccountingRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AccountingRecord | null>(null)
  const [newRecord, setNewRecord] = useState<Partial<AccountingRecord>>({})
  const [showDashboard, setShowDashboard] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AccountingRecord | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, filterType, filterStatus])

  const loadRecords = async () => {
    try {
      // Cargar desde Firebase
      const [services, sales] = await Promise.all([servicioService.getAllServices(), ventasService.getAllSales()])

      // Convertir servicios a formato de contabilidad
      const serviceRecords = services.map((service) => ({
        id: service.id,
        type: "service",
        category: service.serviceType,
        description: service.notes || `Servicio: ${service.serviceType}`,
        client: service.clientName,
        amount: Number.parseFloat(service.price) || 0,
        date: service.date,
        status: service.completed ? "completed" : "pending",
      }))

      // Convertir ventas a formato de contabilidad
      const saleRecords = sales.map((sale) => ({
        id: sale.id,
        type: "sale",
        productName: sale.productName,
        quantity: sale.quantity,
        unitPrice: Number.parseFloat(sale.unitPrice) || 0,
        amount: Number.parseFloat(sale.totalPrice) || 0,
        client: sale.clientName,
        date: sale.date,
        status: "completed",
      }))

      const allRecords = [...serviceRecords, ...saleRecords]
      setRecords(allRecords)

      // También guardar en localStorage para compatibilidad
      localStorage.setItem("admin_services", JSON.stringify(serviceRecords))
      localStorage.setItem("admin_sales", JSON.stringify(saleRecords))
    } catch (error) {
      console.error("Error loading records from Firebase:", error)
      // Fallback a localStorage si Firebase falla
      const services = JSON.parse(localStorage.getItem("admin_services") || "[]")
      const sales = JSON.parse(localStorage.getItem("admin_sales") || "[]")
      const allRecords = [...services, ...sales]
      setRecords(allRecords)
    }
  }

  const filterRecords = () => {
    let filtered = records

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (record.type === "service" &&
            (record as ServiceRecord).description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (record.type === "sale" &&
            (record as SaleRecord).productName.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((record) => record.type === filterType)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((record) => record.status === filterStatus)
    }

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setFilteredRecords(filtered)
  }

  const addRecord = async () => {
    if (!newRecord.type || !newRecord.client || !newRecord.amount || !newRecord.date) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    const record: AccountingRecord = {
      id: Date.now().toString(),
      ...newRecord,
      status: "completed",
      amount: Number(newRecord.amount) || 0,
    } as AccountingRecord

    const updatedRecords = [...records, record]
    setRecords(updatedRecords)

    // Guardar en localStorage según el tipo
    if (record.type === "service") {
      const services = updatedRecords.filter((r) => r.type === "service")
      localStorage.setItem("admin_services", JSON.stringify(services))
    } else {
      const sales = updatedRecords.filter((r) => r.type === "sale")
      localStorage.setItem("admin_sales", JSON.stringify(sales))
    }

    // Guardar en Firebase
    try {
      if (record.type === "service") {
        await servicioService.createService({
          clientName: record.client,
          clientPhone: "No especificado",
          serviceType: record.category || "Otro",
          date: record.date,
          price: record.amount.toString(),
          completed: true,
          notes: record.description || "",
        })
      } else {
        await ventasService.createSale({
          productName: (record as SaleRecord).productName,
          clientName: record.client,
          clientPhone: "No especificado",
          quantity: (record as SaleRecord).quantity || 1,
          unitPrice: (record as SaleRecord).unitPrice?.toString() || "0",
          totalPrice: record.amount.toString(),
          date: record.date,
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error saving to Firebase:", error)
    }

    setNewRecord({})
    setIsAddingRecord(false)
    toast({
      title: "Registro agregado",
      description: "El registro contable ha sido agregado exitosamente",
    })
  }

  const updateRecord = () => {
    if (!editingRecord) return

    const updatedRecords = records.map((r) =>
      r.id === editingRecord.id ? { ...editingRecord, amount: Number(editingRecord.amount) || 0 } : r,
    )
    setRecords(updatedRecords)

    // Actualizar localStorage
    const services = updatedRecords.filter((r) => r.type === "service")
    const sales = updatedRecords.filter((r) => r.type === "sale")
    localStorage.setItem("admin_services", JSON.stringify(services))
    localStorage.setItem("admin_sales", JSON.stringify(sales))

    setEditingRecord(null)
    toast({
      title: "Registro actualizado",
      description: "El registro ha sido actualizado exitosamente",
    })
  }

  const deleteRecord = (recordId: string) => {
    const updatedRecords = records.filter((r) => r.id !== recordId)
    setRecords(updatedRecords)

    // Actualizar localStorage
    const services = updatedRecords.filter((r) => r.type === "service")
    const sales = updatedRecords.filter((r) => r.type === "sale")
    localStorage.setItem("admin_services", JSON.stringify(services))
    localStorage.setItem("admin_sales", JSON.stringify(sales))

    toast({
      title: "Registro eliminado",
      description: "El registro ha sido eliminado exitosamente",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500 text-xs">
            Completado
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="text-xs">
            Pendiente
          </Badge>
        )
      case "cancelled":
      case "refunded":
        return (
          <Badge variant="destructive" className="text-xs">
            {status === "cancelled" ? "Cancelado" : "Reembolsado"}
          </Badge>
        )
      default:
        return null
    }
  }

  const formatAmount = (amount: number | undefined) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "$0"
    }
    return `$${amount.toLocaleString()}`
  }

  const stats = {
    totalRevenue: records.filter((r) => r.status === "completed").reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    servicesRevenue: records
      .filter((r) => r.type === "service" && r.status === "completed")
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    salesRevenue: records
      .filter((r) => r.type === "sale" && r.status === "completed")
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    totalServices: records.filter((r) => r.type === "service").length,
    totalSales: records.filter((r) => r.type === "sale").length,
    pendingAmount: records.filter((r) => r.status === "pending").reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Contabilidad</h2>
          <p className="text-white/70">Gestión de servicios y ventas</p>
        </div>
      </div>

      {/* Dashboard desplegable */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Dashboard Contable</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setShowDashboard(!showDashboard)}
              className="text-white hover:bg-white/10"
            >
              {showDashboard ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showDashboard && (
          <CardContent>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/70">Ingresos Totales</p>
                      <p className="text-lg lg:text-2xl font-bold text-green-400">{formatAmount(stats.totalRevenue)}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/70">Servicios</p>
                      <p className="text-sm lg:text-xl font-bold text-blue-400">
                        {formatAmount(stats.servicesRevenue)}
                      </p>
                    </div>
                    <Wrench className="h-5 w-5 lg:h-8 lg:w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/70">Ventas</p>
                      <p className="text-sm lg:text-xl font-bold text-purple-400">{formatAmount(stats.salesRevenue)}</p>
                    </div>
                    <ShoppingBag className="h-5 w-5 lg:h-8 lg:w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/70">Pendientes</p>
                      <p className="text-sm lg:text-xl font-bold text-orange-400">
                        {formatAmount(stats.pendingAmount)}
                      </p>
                    </div>
                    <TrendingDown className="h-5 w-5 lg:h-8 lg:w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filtros y botón agregar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 flex-1">
          <CardHeader>
            <CardTitle className="text-white">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-white">
                  Buscar
                </Label>
                <Input
                  id="search"
                  placeholder="Cliente, descripción, producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Tipo</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="service">Servicios</SelectItem>
                    <SelectItem value="sale">Ventas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Estado</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex lg:items-end lg:pb-6">
          <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full lg:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Registro</DialogTitle>
                <DialogDescription>Registra un nuevo servicio o venta</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={newRecord.type || ""}
                      onValueChange={(value) => setNewRecord({ ...newRecord, type: value as "service" | "sale" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Servicio</SelectItem>
                        <SelectItem value="sale">Venta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Input
                      placeholder="Nombre del cliente"
                      value={newRecord.client || ""}
                      onChange={(e) => setNewRecord({ ...newRecord, client: e.target.value })}
                    />
                  </div>
                </div>

                {newRecord.type === "service" && (
                  <>
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select
                        value={(newRecord as ServiceRecord).category || ""}
                        onValueChange={(value) =>
                          setNewRecord({ ...newRecord, category: value as ServiceRecord["category"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Reparación PC">Reparación PC</SelectItem>
                          <SelectItem value="Starlink">Starlink</SelectItem>
                          <SelectItem value="Cámaras">Cámaras</SelectItem>
                          <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea
                        placeholder="Descripción del servicio"
                        value={(newRecord as ServiceRecord).description || ""}
                        onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {newRecord.type === "sale" && (
                  <>
                    <div className="space-y-2">
                      <Label>Producto</Label>
                      <Input
                        placeholder="Nombre del producto"
                        value={(newRecord as SaleRecord).productName || ""}
                        onChange={(e) => setNewRecord({ ...newRecord, productName: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          placeholder="1"
                          value={(newRecord as SaleRecord).quantity || ""}
                          onChange={(e) =>
                            setNewRecord({ ...newRecord, quantity: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Precio Unitario</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={(newRecord as SaleRecord).unitPrice || ""}
                          onChange={(e) => {
                            const unitPrice = Number.parseFloat(e.target.value) || 0
                            const quantity = (newRecord as SaleRecord).quantity || 1
                            setNewRecord({
                              ...newRecord,
                              unitPrice,
                              amount: unitPrice * quantity,
                            })
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Monto Total</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newRecord.amount || ""}
                      onChange={(e) => setNewRecord({ ...newRecord, amount: Number.parseFloat(e.target.value) || 0 })}
                      disabled={newRecord.type === "sale"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      value={newRecord.date || ""}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddingRecord(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addRecord}>Agregar Registro</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de registros */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Registros Contables ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron registros con los filtros aplicados</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col gap-2">
                        <Badge
                          variant="outline"
                          className={
                            record.type === "service"
                              ? "bg-blue-500/20 text-blue-300 border-blue-400 text-xs"
                              : "bg-purple-500/20 text-purple-300 border-purple-400 text-xs"
                          }
                        >
                          {record.type === "service" ? (
                            <>
                              <Wrench className="w-3 h-3 mr-1" />
                              Servicio
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3 mr-1" />
                              Venta
                            </>
                          )}
                        </Badge>
                        {getStatusBadge(record.status)}
                      </div>

                      <div className="space-y-2">
                        <span className="font-medium text-white text-sm truncate">{record.client}</span>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="font-bold text-green-400 text-sm">{formatAmount(record.amount)}</span>
                        </div>
                      </div>

                      <div className="text-xs text-white/70">
                        {record.type === "service" ? (
                          <p className="line-clamp-2">
                            <strong>{(record as ServiceRecord).category}:</strong>{" "}
                            {(record as ServiceRecord).description}
                          </p>
                        ) : (
                          <p className="line-clamp-2">
                            <strong>{(record as SaleRecord).productName}</strong> - Cantidad:{" "}
                            {(record as SaleRecord).quantity} × {formatAmount((record as SaleRecord).unitPrice)}
                          </p>
                        )}
                        <p className="mt-1">{new Date(record.date).toLocaleDateString("es-AR")}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1"
                              onClick={() => setSelectedRecord(record)}
                            >
                              <Eye className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">Ver</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Detalles del Registro</DialogTitle>
                              <DialogDescription>Información completa del registro contable</DialogDescription>
                            </DialogHeader>
                            {selectedRecord && (
                              <div className="space-y-4">
                                <div className="grid gap-4 grid-cols-1">
                                  <div>
                                    <Label className="text-sm font-medium">Cliente</Label>
                                    <p className="text-sm">{selectedRecord.client}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Monto</Label>
                                    <p className="text-sm font-bold text-green-600">
                                      {formatAmount(selectedRecord.amount)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Fecha</Label>
                                    <p className="text-sm">
                                      {new Date(selectedRecord.date).toLocaleDateString("es-AR")}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Estado</Label>
                                    <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                                  </div>
                                </div>

                                {selectedRecord.type === "service" && (
                                  <>
                                    <div>
                                      <Label className="text-sm font-medium">Categoría</Label>
                                      <p className="text-sm">{(selectedRecord as ServiceRecord).category}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Descripción</Label>
                                      <p className="text-sm">{(selectedRecord as ServiceRecord).description}</p>
                                    </div>
                                  </>
                                )}

                                {selectedRecord.type === "sale" && (
                                  <>
                                    <div>
                                      <Label className="text-sm font-medium">Producto</Label>
                                      <p className="text-sm">{(selectedRecord as SaleRecord).productName}</p>
                                    </div>
                                    <div className="grid gap-4 grid-cols-1">
                                      <div>
                                        <Label className="text-sm font-medium">Cantidad</Label>
                                        <p className="text-sm">{(selectedRecord as SaleRecord).quantity}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Precio Unitario</Label>
                                        <p className="text-sm">
                                          {formatAmount((selectedRecord as SaleRecord).unitPrice)}
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                )}

                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => setEditingRecord(selectedRecord)}
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteRecord(selectedRecord.id)}
                                    className="flex-1"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogDescription>Modifica la información del registro</DialogDescription>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input
                    value={editingRecord.client}
                    onChange={(e) => setEditingRecord({ ...editingRecord, client: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    value={editingRecord.amount}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        amount: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={editingRecord.date}
                  onChange={(e) => setEditingRecord({ ...editingRecord, date: e.target.value })}
                />
              </div>

              {editingRecord.type === "service" && (
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={(editingRecord as ServiceRecord).description}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        description: e.target.value,
                      } as ServiceRecord)
                    }
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingRecord(null)}>
                  Cancelar
                </Button>
                <Button onClick={updateRecord}>Actualizar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
