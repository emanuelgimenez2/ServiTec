"use client"

import type React from "react"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Mail,
  Calendar,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Plus,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Filter,
} from "lucide-react"
import { usuarioService, type Usuario } from "@/lib/firebase-services"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function AdminUsers() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "usuario",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterRole, filterStatus])

  const loadUsers = async () => {
    try {
      setLoading(true)
      console.log("🔄 Cargando usuarios desde Firebase colección 'usuario'...")

      // Cambiar de usuarioService.getAllUsers() a cargar directamente desde "usuario"
      const usersRef = collection(db, "usuario")
      const querySnapshot = await getDocs(usersRef)

      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      }))

      console.log("👥 Usuarios cargados desde 'usuario':", usersData)
      setUsers(usersData)
    } catch (error) {
      console.error("❌ Error loading users:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm),
      )
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => (filterStatus === "active" ? user.isActive : !user.isActive))
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setFilteredUsers(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingUser) {
        await usuarioService.updateUser(editingUser.id!, formData)
        toast({
          title: "Usuario actualizado",
          description: "El usuario se actualizó correctamente",
        })
      } else {
        await usuarioService.createUser(formData)
        toast({
          title: "Usuario creado",
          description: "El usuario se creó correctamente",
        })
      }

      setIsDialogOpen(false)
      setEditingUser(null)
      setFormData({ name: "", email: "", phone: "", role: "usuario" })
      await loadUsers()
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el usuario",
        variant: "destructive",
      })
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      setUpdating(userId)
      await usuarioService.deleteUser(userId)
      await loadUsers()
      toast({
        title: "Usuario eliminado",
        description: "El usuario se eliminó correctamente",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await usuarioService.updateUserStatus(userId, isActive)
      await loadUsers()

      toast({
        title: "Estado actualizado",
        description: `Usuario ${isActive ? "activado" : "desactivado"}`,
      })
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (user: Usuario) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", phone: "", role: "usuario" })
    setIsDialogOpen(true)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "administrador":
      case "admin":
        return "bg-red-500/20 text-red-200 border-red-500/30"
      case "manager":
        return "bg-blue-500/20 text-blue-200 border-blue-500/30"
      case "usuario":
      case "user":
        return "bg-green-500/20 text-green-200 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-500/30"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "administrador":
      case "admin":
        return "Administrador"
      case "manager":
        return "Gerente"
      case "usuario":
      case "user":
        return "Usuario"
      default:
        return role
    }
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    admins: users.filter((u) => u.role === "administrador").length,
    regularUsers: users.filter((u) => u.role === "usuario").length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-white/70">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Usuarios</h2>
          <p className="text-white/70">Gestiona los usuarios del sistema</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={loadUsers} variant="ghost" className="text-white hover:bg-white/10" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Dashboard desplegable */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Dashboard de Usuarios</CardTitle>
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
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-sm text-white/70">Total Usuarios</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                    <p className="text-sm text-white/70">Activos</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{stats.admins}</p>
                    <p className="text-sm text-white/70">Admins</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{filteredUsers.length}</p>
                    <p className="text-sm text-white/70">Filtrados</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filtros en modal */}
      <div className="flex justify-end">
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtros de Búsqueda</DialogTitle>
              <DialogDescription>Filtra los usuarios del sistema</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Nombre, email, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="usuario">Usuario</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
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
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de usuarios */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white truncate">{user.name}</h3>
                            <Badge className={getRoleColor(user.role)}>{getRoleText(user.role)}</Badge>
                            <Badge className={user.isActive ? "bg-green-500" : "bg-red-500"}>
                              {user.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm text-white/70">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-white/70">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Usuario</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage
                                      src={selectedUser.avatar || "/placeholder.svg"}
                                      alt={selectedUser.name}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg">
                                      {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                                    <div className="flex gap-2 mt-1">
                                      <Badge className={getRoleColor(selectedUser.role)}>
                                        {getRoleText(selectedUser.role)}
                                      </Badge>
                                      <Badge className={selectedUser.isActive ? "bg-green-500" : "bg-red-500"}>
                                        {selectedUser.isActive ? "Activo" : "Inactivo"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                  <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm">{selectedUser.email}</p>
                                  </div>
                                  {selectedUser.phone && (
                                    <div>
                                      <Label className="text-sm font-medium">Teléfono</Label>
                                      <p className="text-sm">{selectedUser.phone}</p>
                                    </div>
                                  )}
                                  <div>
                                    <Label className="text-sm font-medium">Fecha de registro</Label>
                                    <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => openEditDialog(user)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={() => updateUserStatus(user.id!, !user.isActive)}
                          size="sm"
                          className={user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay usuarios</h3>
              <p className="text-white/60">
                {searchTerm
                  ? "No se encontraron usuarios con el término de búsqueda"
                  : "Aún no hay usuarios registrados en el sistema"}
              </p>
              {!searchTerm && (
                <Button onClick={openCreateDialog} className="mt-4 bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer usuario
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Modifica los datos del usuario" : "Completa los datos para crear un nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ingresa el nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+57 300 123 4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario">Usuario</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" onClick={() => setIsDialogOpen(false)} variant="outline">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {editingUser ? "Actualizar" : "Crear"} Usuario
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
