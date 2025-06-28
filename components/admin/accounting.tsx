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
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown, Wrench, ShoppingBag } from "lucide-react"

interface ServiceRecord {
  id: string
  type: "service"
  category: "Reparación PC" | "Starlink" | "Cámaras" | "Desarrollo Web"
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
  const [newRecord, setNewRecord] = useState<Partial<AccountingRecord>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, filterType, filterStatus])

  const loadRecords = () => {
    const services = JSON.parse(localStorage.getItem("admin_services") || "[]")
    const sales = JSON.parse(localStorage.getItem("admin_sales") || "[]")
    const allRecords = [...services, ...sales]
    setRecords(allRecords)
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

  const addRecord = () => {
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

    setNewRecord({})
    setIsAddingRecord(false)
    toast({
      title: "Registro agregado",
      description: "El registro contable ha sido agregado exitosamente",
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
          <Badge variant="default" className="bg-green-500">
            Completado
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "cancelled":
      case "refunded":
        return <Badge variant="destructive">{status === "cancelled" ? "Cancelado" : "Reembolsado"}</Badge>
      default:
        return null
    }
  }

  const stats = {
    totalRevenue: records.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.amount, 0),
    servicesRevenue: records
      .filter((r) => r.type === "service" && r.status === "completed")
      .reduce((sum, r) => sum + r.amount, 0),
    salesRevenue: records
      .filter((r) => r.type === "sale" && r.status === "completed")
      .reduce((sum, r) => sum + r.amount, 0),
    totalServices: records.filter((r) => r.type === "service").length,
    totalSales: records.filter((r) => r.type === "sale").length,
    pendingAmount: records.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Contabilidad
          </h2>
          <p className="text-muted-foreground">Gestión de servicios y ventas</p>
        </div>
        <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Registro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Registro</DialogTitle>
              <DialogDescription>Registra un nuevo servicio o venta</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={(newRecord as SaleRecord).quantity || ""}
                        onChange={(e) => setNewRecord({ ...newRecord, quantity: Number.parseInt(e.target.value) || 0 })}
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

              <div className="grid gap-4 md:grid-cols-2">
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

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingRecord(false)}>
                  Cancelar
                </Button>
                <Button onClick={addRecord}>Agregar Registro</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servicios</p>
                <p className="text-xl font-bold text-blue-600">${stats.servicesRevenue.toLocaleString()}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ventas</p>
                <p className="text-xl font-bold text-purple-600">${stats.salesRevenue.toLocaleString()}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servicios</p>
                <p className="text-2xl font-bold">{stats.totalServices}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-xl font-bold text-orange-600">${stats.pendingAmount.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Cliente, descripción, producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
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
              <Label>Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
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

      {/* Lista de registros */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Contables ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron registros con los filtros aplicados</p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={
                              record.type === "service" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
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
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString("es-AR")}
                          </span>
                        </div>

                        <div className="grid gap-1 md:grid-cols-2">
                          <div>
                            <span className="font-medium">{record.client}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-bold text-green-600">${record.amount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {record.type === "service" ? (
                            <>
                              <strong>{(record as ServiceRecord).category}:</strong>{" "}
                              {(record as ServiceRecord).description}
                            </>
                          ) : (
                            <>
                              <strong>{(record as SaleRecord).productName}</strong> - Cantidad:{" "}
                              {(record as SaleRecord).quantity} × ${(record as SaleRecord).unitPrice?.toLocaleString()}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="destructive" onClick={() => deleteRecord(record.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
