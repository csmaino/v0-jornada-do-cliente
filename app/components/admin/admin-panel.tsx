"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Activity, Settings, Eye, AlertTriangle, BookOpen } from "lucide-react"
import { useAdmin } from "../../contexts/admin-context"
import UserManagement from "./user-management"
import PermissionManager from "./permission-manager"
import SystemSettings from "./system-settings"
import AccessControl from "./access-control"
import ModuleManager from "./module-manager"

type AdminTab = "dashboard" | "users" | "permissions" | "settings" | "access" | "modules"

// Função para formatar data de forma segura
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "Nunca acessou"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return "Data inválida"
    return dateObj.toLocaleDateString("pt-BR")
  } catch (error) {
    return "Data inválida"
  }
}

export default function AdminPanel() {
  const { currentUser, users, modules, isAdmin, hasPermission } = useAdmin()
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")

  if (!currentUser || (!isAdmin && !hasPermission("system.admin"))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Você não tem permissão para acessar o painel administrativo.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    pendingUsers: users.filter((u) => u.status === "pending").length,
    inactiveUsers: users.filter((u) => u.status === "inactive").length,
    totalModules: modules.length,
    activeModules: modules.filter((m) => m.isActive).length,
    totalContents: modules.reduce((acc, module) => acc + module.contents.length, 0),
    activeContents: modules.reduce((acc, module) => acc + module.contents.filter((c) => c.isActive).length, 0),
  }

  const tabs = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: Activity,
      permission: "system.admin",
    },
    {
      id: "users" as const,
      label: "Usuários",
      icon: Users,
      permission: "users.view",
    },
    {
      id: "modules" as const,
      label: "Módulos",
      icon: BookOpen,
      permission: "system.admin",
    },
    {
      id: "permissions" as const,
      label: "Permissões",
      icon: Shield,
      permission: "users.edit",
    },
    {
      id: "access" as const,
      label: "Controle de Acesso",
      icon: Eye,
      permission: "system.admin",
    },
    {
      id: "settings" as const,
      label: "Configurações",
      icon: Settings,
      permission: "settings.view",
    },
  ]

  const visibleTabs = tabs.filter((tab) => hasPermission(tab.permission))

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />
      case "modules":
        return <ModuleManager />
      case "permissions":
        return <PermissionManager />
      case "settings":
        return <SystemSettings />
      case "access":
        return <AccessControl />
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                      <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Módulos Ativos</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.activeModules}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conteúdos Ativos</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.activeContents}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usuários Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{user.avatar || user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.empresa}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {user.status === "active" ? "Ativo" : user.status === "pending" ? "Pendente" : "Inativo"}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{`Último acesso: ${formatDate(user.lastLogin)}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Módulos e Conteúdos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modules.slice(0, 3).map((module) => (
                      <div key={module.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{module.name}</h4>
                          <Badge variant={module.isActive ? "default" : "secondary"}>
                            {module.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {module.contents.length} conteúdo{module.contents.length !== 1 ? "s" : ""}
                          </span>
                          <span>
                            {module.plans.length} plano{module.plans.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie usuários, módulos, permissões e configurações do sistema</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {currentUser.role === "admin" ? "Administrador" : "Gerente"}
              </Badge>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser.avatar || currentUser.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  )
}
