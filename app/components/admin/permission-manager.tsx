"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Shield, Users, Settings, FileText, BarChart, Edit } from "lucide-react"
import { useAdmin } from "../../contexts/admin-context"

export default function PermissionManager() {
  const { users, permissions, updateUserPermissions } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userPermissions, setUserPermissions] = useState<string[]>([])

  // Filtrar usuários baseado no termo de busca
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "system":
        return <Settings className="w-4 h-4" />
      case "users":
        return <Users className="w-4 h-4" />
      case "content":
        return <FileText className="w-4 h-4" />
      case "reports":
        return <BarChart className="w-4 h-4" />
      case "settings":
        return <Settings className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "system":
        return "bg-red-100 text-red-800"
      case "users":
        return "bg-blue-100 text-blue-800"
      case "content":
        return "bg-green-100 text-green-800"
      case "reports":
        return "bg-purple-100 text-purple-800"
      case "settings":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEditPermissions = (user: any) => {
    setSelectedUser(user)
    setUserPermissions(user.permissions.map((p: any) => p.id))
  }

  const handlePermissionToggle = (permissionId: string) => {
    setUserPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    )
  }

  const handleSavePermissions = () => {
    if (!selectedUser) return

    const updatedPermissions = permissions.filter((p) => userPermissions.includes(p.id))
    updateUserPermissions(selectedUser.id, updatedPermissions)
    setSelectedUser(null)
    setUserPermissions([])
  }

  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof permissions>,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Permissões</h2>
          <p className="text-gray-600">Gerencie permissões de usuários do sistema</p>
        </div>
      </div>

      {/* Filtro de Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários e Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{user.avatar || user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={user.role === "admin" ? "bg-red-100 text-red-800" : ""}
                    >
                      {user.role === "admin"
                        ? "Administrador"
                        : user.role === "manager"
                          ? "Gerente"
                          : user.role === "user"
                            ? "Usuário"
                            : "Visualizador"}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => handleEditPermissions(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Permissões
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Permissões - {selectedUser?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                            <div key={category} className="space-y-3">
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(category)}
                                <h3 className="font-medium text-gray-900 capitalize">
                                  {category === "system"
                                    ? "Sistema"
                                    : category === "users"
                                      ? "Usuários"
                                      : category === "content"
                                        ? "Conteúdo"
                                        : category === "reports"
                                          ? "Relatórios"
                                          : category === "settings"
                                            ? "Configurações"
                                            : category}
                                </h3>
                              </div>
                              <div className="grid grid-cols-1 gap-2 ml-6">
                                {categoryPermissions.map((permission) => (
                                  <div key={permission.id} className="flex items-start space-x-3">
                                    <Checkbox
                                      id={permission.id}
                                      checked={userPermissions.includes(permission.id)}
                                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                                    />
                                    <div className="flex-1">
                                      <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                        {permission.name}
                                      </Label>
                                      <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setSelectedUser(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleSavePermissions}>Salvar Permissões</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Permissões Atuais */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Permissões Atuais:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.length === 0 ? (
                      <Badge variant="outline" className="text-gray-500">
                        Nenhuma permissão específica
                      </Badge>
                    ) : (
                      user.permissions.map((permission: any) => (
                        <Badge key={permission.id} variant="outline" className={getCategoryColor(permission.category)}>
                          {permission.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? "Nenhum usuário encontrado com esse termo de busca." : "Nenhum usuário encontrado."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Permissões */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Permissões Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
              <div key={category} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  {getCategoryIcon(category)}
                  <h3 className="font-medium text-gray-900 capitalize">
                    {category === "system"
                      ? "Sistema"
                      : category === "users"
                        ? "Usuários"
                        : category === "content"
                          ? "Conteúdo"
                          : category === "reports"
                            ? "Relatórios"
                            : category === "settings"
                              ? "Configurações"
                              : category}
                  </h3>
                </div>
                <div className="space-y-2">
                  {categoryPermissions.map((permission) => (
                    <div key={permission.id} className="text-sm">
                      <p className="font-medium text-gray-700">{permission.name}</p>
                      <p className="text-gray-500 text-xs">{permission.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
