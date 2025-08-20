"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Database, Bell, Download, RefreshCw, AlertTriangle, CheckCircle, Clock, HardDrive } from "lucide-react"

interface SystemLog {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error"
  category: string
  message: string
  user?: string
}

interface BackupInfo {
  id: string
  date: Date
  size: string
  type: "automatic" | "manual"
  status: "completed" | "failed" | "in_progress"
}

export default function SystemSettings() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    loginAttempts: 5,
    ipWhitelist: false,
  })

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    logLevel: "info",
    emailNotifications: true,
    systemAlerts: true,
  })

  // Mock data para logs
  const [systemLogs] = useState<SystemLog[]>([
    {
      id: "1",
      timestamp: new Date(),
      level: "info",
      category: "Usuário",
      message: "Novo usuário criado: João Silva",
      user: "admin@maino.com.br",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 3600000),
      level: "warning",
      category: "Sistema",
      message: "Tentativa de login falhada para usuário inexistente",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 7200000),
      level: "info",
      category: "Backup",
      message: "Backup automático concluído com sucesso",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 10800000),
      level: "error",
      category: "Sistema",
      message: "Erro na sincronização de dados",
      user: "sistema",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 14400000),
      level: "info",
      category: "Módulo",
      message: "Módulo 'Gestão Financeira' atualizado",
      user: "admin@maino.com.br",
    },
  ])

  // Mock data para backups
  const [backups] = useState<BackupInfo[]>([
    {
      id: "1",
      date: new Date(),
      size: "2.3 GB",
      type: "automatic",
      status: "completed",
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000),
      size: "2.1 GB",
      type: "automatic",
      status: "completed",
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000),
      size: "2.0 GB",
      type: "manual",
      status: "completed",
    },
    {
      id: "4",
      date: new Date(Date.now() - 259200000),
      size: "1.9 GB",
      type: "automatic",
      status: "failed",
    },
  ])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "in_progress":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const exportLogsToExcel = () => {
    try {
      if (typeof window === "undefined" || !window.XLSX) {
        alert("Biblioteca de exportação não disponível. Recarregue a página e tente novamente.")
        return
      }

      const logsData = systemLogs.map((log) => ({
        "Data/Hora": log.timestamp.toLocaleString("pt-BR"),
        Nível: log.level.toUpperCase(),
        Categoria: log.category,
        Mensagem: log.message,
        Usuário: log.user || "Sistema",
      }))

      const ws = window.XLSX.utils.json_to_sheet(logsData)
      const wb = window.XLSX.utils.book_new()
      window.XLSX.utils.book_append_sheet(wb, ws, "Logs do Sistema")
      window.XLSX.writeFile(wb, `logs_sistema_${new Date().toISOString().split("T")[0]}.xlsx`)

      console.log("✅ Logs exportados com sucesso!")
    } catch (error) {
      console.error("❌ Erro ao exportar logs:", error)
      alert("Erro ao exportar logs. Tente novamente.")
    }
  }

  const exportBackupsToExcel = () => {
    try {
      if (typeof window === "undefined" || !window.XLSX) {
        alert("Biblioteca de exportação não disponível. Recarregue a página e tente novamente.")
        return
      }

      const backupsData = backups.map((backup) => ({
        Data: backup.date.toLocaleDateString("pt-BR"),
        Hora: backup.date.toLocaleTimeString("pt-BR"),
        Tamanho: backup.size,
        Tipo: backup.type === "automatic" ? "Automático" : "Manual",
        Status: backup.status === "completed" ? "Concluído" : backup.status === "failed" ? "Falhou" : "Em Progresso",
      }))

      const ws = window.XLSX.utils.json_to_sheet(backupsData)
      const wb = window.XLSX.utils.book_new()
      window.XLSX.utils.book_append_sheet(wb, ws, "Histórico de Backups")
      window.XLSX.writeFile(wb, `backups_${new Date().toISOString().split("T")[0]}.xlsx`)

      console.log("✅ Histórico de backups exportado com sucesso!")
    } catch (error) {
      console.error("❌ Erro ao exportar backups:", error)
      alert("Erro ao exportar histórico de backups. Tente novamente.")
    }
  }

  const handleSecuritySettingChange = (key: string, value: any) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))
    console.log(`🔐 Configuração de segurança atualizada: ${key} = ${value}`)
  }

  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }))
    console.log(`⚙️ Configuração do sistema atualizada: ${key} = ${value}`)
  }

  const performManualBackup = () => {
    console.log("🔄 Iniciando backup manual...")
    alert("Backup manual iniciado. Você será notificado quando concluído.")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
          <p className="text-gray-600">Gerencie configurações de segurança e sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Segurança */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <CardTitle>Configurações de Segurança</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Autenticação de Dois Fatores</Label>
                <p className="text-xs text-gray-500">Exigir 2FA para todos os usuários</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => handleSecuritySettingChange("twoFactorAuth", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Timeout de Sessão (minutos)</Label>
              <Input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSecuritySettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                min="5"
                max="480"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Política de Senha</Label>
              <Select
                value={securitySettings.passwordPolicy}
                onValueChange={(value) => handleSecuritySettingChange("passwordPolicy", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básica (6+ caracteres)</SelectItem>
                  <SelectItem value="medium">Média (8+ caracteres, números)</SelectItem>
                  <SelectItem value="strong">Forte (12+ caracteres, símbolos)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tentativas de Login</Label>
              <Input
                type="number"
                value={securitySettings.loginAttempts}
                onChange={(e) => handleSecuritySettingChange("loginAttempts", Number.parseInt(e.target.value))}
                min="3"
                max="10"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Lista Branca de IPs</Label>
                <p className="text-xs text-gray-500">Restringir acesso por IP</p>
              </div>
              <Switch
                checked={securitySettings.ipWhitelist}
                onCheckedChange={(checked) => handleSecuritySettingChange("ipWhitelist", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-green-600" />
              <CardTitle>Configurações do Sistema</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Modo Manutenção</Label>
                <p className="text-xs text-gray-500">Bloquear acesso ao sistema</p>
              </div>
              <Switch
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => handleSystemSettingChange("maintenanceMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Backup Automático</Label>
                <p className="text-xs text-gray-500">Backup diário automático</p>
              </div>
              <Switch
                checked={systemSettings.autoBackup}
                onCheckedChange={(checked) => handleSystemSettingChange("autoBackup", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Frequência de Backup</Label>
              <Select
                value={systemSettings.backupFrequency}
                onValueChange={(value) => handleSystemSettingChange("backupFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Nível de Log</Label>
              <Select
                value={systemSettings.logLevel}
                onValueChange={(value) => handleSystemSettingChange("logLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">Apenas Erros</SelectItem>
                  <SelectItem value="warning">Avisos e Erros</SelectItem>
                  <SelectItem value="info">Todas as Informações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Notificações por Email</Label>
                <p className="text-xs text-gray-500">Alertas por email</p>
              </div>
              <Switch
                checked={systemSettings.emailNotifications}
                onCheckedChange={(checked) => handleSystemSettingChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Alertas do Sistema</Label>
                <p className="text-xs text-gray-500">Notificações no painel</p>
              </div>
              <Switch
                checked={systemSettings.systemAlerts}
                onCheckedChange={(checked) => handleSystemSettingChange("systemAlerts", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs do Sistema */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <CardTitle>Logs do Sistema</CardTitle>
            </div>
            <Button onClick={exportLogsToExcel} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {systemLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                {getLevelIcon(log.level)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {log.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{log.timestamp.toLocaleString("pt-BR")}</span>
                    </div>
                    {log.user && <span className="text-xs text-gray-400">{log.user}</span>}
                  </div>
                  <p className="text-sm text-gray-900">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Backups */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-600" />
              <CardTitle>Histórico de Backups</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button onClick={exportBackupsToExcel} size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Histórico
              </Button>
              <Button onClick={performManualBackup} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Backup Manual
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(backup.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{backup.date.toLocaleDateString("pt-BR")}</span>
                      <span className="text-sm text-gray-500">{backup.date.toLocaleTimeString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={backup.type === "automatic" ? "default" : "secondary"}>
                        {backup.type === "automatic" ? "Automático" : "Manual"}
                      </Badge>
                      <span className="text-xs text-gray-500">{backup.size}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      backup.status === "completed"
                        ? "default"
                        : backup.status === "failed"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {backup.status === "completed"
                      ? "Concluído"
                      : backup.status === "failed"
                        ? "Falhou"
                        : "Em Progresso"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
