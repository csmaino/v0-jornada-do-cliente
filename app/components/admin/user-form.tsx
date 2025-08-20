"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { useAdmin, type User } from "../../contexts/admin-context"

interface UserFormProps {
  user?: User | null
  onClose: () => void
}

export default function UserForm({ user, onClose }: UserFormProps) {
  const { addUser, updateUser, availableCargos, availableDepartments, availableStakeholders, addCargo, isAdmin } =
    useAdmin()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "manager" | "user" | "viewer",
    status: "active" as "active" | "inactive" | "pending",
    department: [] as string[],
    stakeholders: [] as string[],
    empresa: "",
    grupo: "",
    cnpj: "",
    cargo: "",
  })

  const [newCargo, setNewCargo] = useState("")
  const [showNewCargoInput, setShowNewCargoInput] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department || [],
        stakeholders: user.stakeholders || [],
        empresa: user.empresa || "",
        grupo: user.grupo || "",
        cnpj: user.cnpj || "",
        cargo: user.cargo || "",
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (user) {
      updateUser(user.id, formData)
    } else {
      addUser({
        ...formData,
        permissions: [],
      })
    }

    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultiSelectChange = (field: "department" | "stakeholders", value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value),
    }))
  }

  const handleAddNewCargo = () => {
    if (newCargo.trim() && isAdmin) {
      addCargo(newCargo.trim())
      setFormData((prev) => ({ ...prev, cargo: newCargo.trim() }))
      setNewCargo("")
      setShowNewCargoInput(false)
    }
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Função no Sistema</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="cargo">Cargo</Label>
                {isAdmin && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCargoInput(!showNewCargoInput)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Novo Cargo
                  </Button>
                )}
              </div>

              {showNewCargoInput && isAdmin && (
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Digite o novo cargo..."
                    value={newCargo}
                    onChange={(e) => setNewCargo(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddNewCargo} size="sm">
                    Adicionar
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowNewCargoInput(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <Select value={formData.cargo} onValueChange={(value) => handleChange("cargo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {availableCargos.map((cargo) => (
                    <SelectItem key={cargo} value={cargo}>
                      {cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Departamento(s)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                {availableDepartments.map((dept) => (
                  <div key={dept} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dept-${dept}`}
                      checked={formData.department.includes(dept)}
                      onCheckedChange={(checked) => handleMultiSelectChange("department", dept, checked as boolean)}
                    />
                    <Label htmlFor={`dept-${dept}`} className="text-sm">
                      {dept}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.department.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.department.map((dept) => (
                    <Badge key={dept} variant="secondary" className="text-xs">
                      {dept}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => handleChange("empresa", e.target.value)}
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <Label htmlFor="grupo">Grupo</Label>
                <Input
                  id="grupo"
                  value={formData.grupo}
                  onChange={(e) => handleChange("grupo", e.target.value)}
                  placeholder="Grupo empresarial"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleChange("cnpj", formatCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stakeholders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stakeholder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg max-h-40 overflow-y-auto">
              {availableStakeholders.map((stakeholder) => (
                <div key={stakeholder} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stakeholder-${stakeholder}`}
                    checked={formData.stakeholders.includes(stakeholder)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange("stakeholders", stakeholder, checked as boolean)
                    }
                  />
                  <Label htmlFor={`stakeholder-${stakeholder}`} className="text-sm">
                    {stakeholder}
                  </Label>
                </div>
              ))}
            </div>
            {formData.stakeholders.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {formData.stakeholders.map((stakeholder) => (
                  <Badge key={stakeholder} variant="outline" className="text-xs">
                    {stakeholder}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{user ? "Salvar Alterações" : "Criar Usuário"}</Button>
        </div>
      </form>
    </>
  )
}
