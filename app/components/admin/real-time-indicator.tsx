"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useAdmin } from "../../contexts/admin-context"

export default function RealTimeIndicator() {
  const { currentUser } = useAdmin()
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Atualiza a cada 30 segundos

    // Verificar status online/offline
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!currentUser) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-3 min-w-64">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Status do Sistema</span>
          <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
            {isOnline ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </div>

        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Usuário:</span>
            <span className="font-medium">{currentUser.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Role:</span>
            <Badge variant="outline" className="text-xs">
              {currentUser.role === "admin"
                ? "Admin"
                : currentUser.role === "manager"
                  ? "Gerente"
                  : currentUser.role === "user"
                    ? "Usuário"
                    : "Visualizador"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Permissões:</span>
            <span className="font-medium">{currentUser.permissions.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Última atualização:</span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
