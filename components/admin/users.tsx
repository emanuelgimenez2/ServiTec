"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Users, Search, Plus, Edit, Trash2, Mail, Phone, Calendar, RefreshCw, ChevronRight } from "lucide-react"
import { usuarioService, type Usuario } from "@/lib/firebase-services"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function UsersComponent() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showAllUsers, setShowAllUsers] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
  })

  useEffect(() => {
    loadUsers()
  }, [])

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
      setFormData({ name: "", email: "", phone: "", role: "user" })
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
    setFormData({ name: "", email: "", phone: "", role: "user" })
    setIsDialogOpen(true)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

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

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Usuarios</h1>
            <p className="text-white/70 text-sm sm:text-base">Gestiona los usuarios del sistema</p>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20 animate-pulse">
              <CardContent className="p-4 sm:p-6">
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
            Usuarios
          </h1>
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">Gestiona los usuarios del sistema</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button onClick={loadUsers} variant="ghost" className="text-white hover:bg-white/10" size="sm">
            <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
          <Button
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            size="sm"
          >
            <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Nuevo Usuario</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      {/* Users Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-white">{users.length}</p>
              <p className="text-xs sm:text-sm text-white/70">Total Usuarios</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-green-400">
                {users.filter((u) => u.role === "usuario" || u.role === "user").length}
              </p>
              <p className="text-xs sm:text-sm text-white/70">Usuarios</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-red-400">
                {users.filter((u) => u.role === "administrador" || u.role === "admin").length}
              </p>
              <p className="text-xs sm:text-sm text-white/70">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-400">{filteredUsers.length}</p>
              <p className="text-xs sm:text-sm text-white/70">Filtrados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-4 sm:p-6">
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {/* Header para mostrar/ocultar todos */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Usuarios ({filteredUsers.length})</h3>
                {filteredUsers.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllUsers(!showAllUsers)}
                    className="text-white/70 hover:text-white text-xs sm:text-sm"
                  >
                    {showAllUsers ? "Ver menos" : "Ver todos"}
                    <ChevronRight className={`ml-1 h-3 w-3 transition-transform ${showAllUsers ? "rotate-90" : ""}`} />
                  </Button>
                )}
              </div>

              {/* Lista de usuarios */}
              <div className="space-y-3">
                {filteredUsers.slice(0, showAllUsers ? filteredUsers.length : 5).map((user) => (
                  <Card
                    key={user.id}
                    className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-white text-sm sm:text-base truncate">{user.name}</h3>
                              <Badge className={getRoleColor(user.role)}>{getRoleText(user.role)}</Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-xs sm:text-sm text-white/70">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs sm:text-sm text-white/70">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-white/50">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            onClick={() => openEditDialog(user)}
                            size="sm"
                            variant="ghost"
                            className="text-blue-400 hover:bg-blue-500/10 p-2"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteUser(user.id!)}
                            disabled={updating === user.id}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:bg-red-500/10 p-2"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No hay usuarios</h3>
              <p className="text-white/60 text-sm sm:text-base">
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
        <DialogContent className="bg-gray-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
            <DialogDescription className="text-white/70">
              {editingUser ? "Modifica los datos del usuario" : "Completa los datos para crear un nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nombre completo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Ingresa el nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Teléfono
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="+57 300 123 4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Rol
              </Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                required
              >
                <option value="usuario">Usuario</option>
                <option value="manager">Gerente</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
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
