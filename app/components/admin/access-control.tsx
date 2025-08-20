"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Lock, Eye, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useAdmin } from "../../contexts/admin-context"

interface AccessRule {
  id: string
  name: string
  description: string
  type: "ip" | "time" | "role" | "department"
  condition: string
  action: "allow" | "deny"
  enabled: boolean
  priority: number
}

export default function AccessControl() {
  const { users, isAdmin } = useAdmin()
  const [accessRules, setAccessRules] = useState<AccessRule[]>([
    {
      id: "1",
      name: "Acesso Admin Apenas Horário Comercial",
      description: "Administradores só podem acessar durante horário comercial",
      type: "time",
      condition: "09:00-18:00",
      action: "allow",
      enabled: true,
      priority: 1,
    },
    {
      id: "2",
      name: "Bloquear IPs Suspeitos",
      description: "Bloquear acesso de IPs conhecidamente maliciosos",
      type: "ip",
      condition: "192.168.1.100-192.168.1.200",
      action: "deny",
      enabled: true,
      priority: 2,
    },
    {
      id: "3",
      name: "Acesso Departamento TI",
      description: "Apenas departamento de TI pode acessar configurações do sistema",
      type: "department",
      condition: "TI",
      action: "allow",
      enabled: true,
      priority: 3,
    },
  ])

  const [newRule, setNewRule] = useState<Partial<AccessRule>>({
    name: "",
    description: "",
    type: "role",
    condition: "",
    action: "allow",
    enabled: true,
    priority: accessRules.length + 1,
  })

  const handleToggleRule = (ruleId: string) => {
    setAccessRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const handleDeleteRule = (ruleId: string) => {
    setAccessRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  const handleAddRule = () => {
    if (newRule.name && newRule.condition) {
      const rule: AccessRule = {
        id: Date.now().toString(),
        name: newRule.name,
        description: newRule.description || "",
        type: newRule.type || "role",
        condition: newRule.condition,
        action: newRule.action || "allow",
        enabled: newRule.enabled || true,
        priority: newRule.priority || accessRules.length + 1,
      }
      setAccessRules((prev) => [...prev, rule])
      setNewRule({
        name: "",
        description: "",
        type: "role",
        condition: "",
        action: "allow",
        enabled: true,
        priority: accessRules.length + 2,
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ip":
        return <Shield className="w-4 h-4" />
      case "time":
        return <Clock className="w-4 h-4" />
      case "role":
        return <Eye className="w-4 h-4" />
      case "department":
        return <Lock className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getActionColor = (action: string) => {
    return action === "allow" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ip":
        return "bg-blue-100 text-blue-800"
      case "time":
        return "bg-purple-100 text-purple-800"
      case "role":
        return "bg-orange-100 text-orange-800"
      case "department":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Acesso Restrito</h3>
        <p className="text-gray-600">Apenas administradores podem acessar o controle de acesso.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Controle de Acesso</h2>
        <p className="text-gray-600">Configure regras de acesso e segurança do sistema</p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regras Ativas</p>
                <p className="text-2xl font-bold text-green-600">{accessRules.filter((rule) => rule.enabled).length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regras Inativas</p>
                <p className="text-2xl font-bold text-gray-600">{accessRules.filter((rule) => !rule.enabled).length}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Regras</p>
                <p className="text-2xl font-bold text-blue-600">{accessRules.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Rule */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Regra de Acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ruleName">Nome da Regra</Label>
              <Input
                id="ruleName"
                value={newRule.name}
                onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Acesso apenas horário comercial"
              />
            </div>
            <div>
              <Label htmlFor="ruleType">Tipo</Label>
              <Select
                value={newRule.type}
                onValueChange={(value) => setNewRule((prev) => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="role">Por Função</SelectItem>
                  <SelectItem value="department">Por Departamento</SelectItem>
                  <SelectItem value="time">Por Horário</SelectItem>
                  <SelectItem value="ip">Por IP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ruleCondition">Condição</Label>
              <Input
                id="ruleCondition"
                value={newRule.condition}
                onChange={(e) => setNewRule((prev) => ({ ...prev, condition: e.target.value }))}
                placeholder="Ex: admin, TI, 09:00-18:00, 192.168.1.0/24"
              />
            </div>
            <div>
              <Label htmlFor="ruleAction">Ação</Label>
              <Select
                value={newRule.action}
                onValueChange={(value) => setNewRule((prev) => ({ ...prev, action: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Permitir</SelectItem>
                  <SelectItem value="deny">Negar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="ruleDescription">Descrição</Label>
              <Input
                id="ruleDescription"
                value={newRule.description}
                onChange={(e) => setNewRule((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição opcional da regra"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleAddRule}>Adicionar Regra</Button>
          </div>
        </CardContent>
      </Card>

      {/* Access Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>Regras de Acesso Configuradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accessRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(rule.type)}
                    <div>
                      <h3 className="font-medium text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-500">{rule.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getTypeColor(rule.type)} variant="secondary">
                          {rule.type === "ip"
                            ? "IP"
                            : rule.type === "time"
                              ? "Horário"
                              : rule.type === "role"
                                ? "Função"
                                : "Departamento"}
                        </Badge>
                        <Badge className={getActionColor(rule.action)}>
                          {rule.action === "allow" ? "Permitir" : "Negar"}
                        </Badge>
                        <span className="text-xs text-gray-500">Condição: {rule.condition}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`rule-${rule.id}`} className="text-sm">
                      {rule.enabled ? "Ativa" : "Inativa"}
                    </Label>
                    <Switch
                      id={`rule-${rule.id}`}
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users
              .filter((user) => user.status === "active")
              .map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.avatar || user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {user.lastLogin ? `Último acesso: ${user.lastLogin.toLocaleTimeString()}` : "Nunca acessou"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
