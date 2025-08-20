"use client"

import { AdminProvider } from "../contexts/admin-context"
import AdminHeader from "../components/admin/admin-header"
import AdminPanel from "../components/admin/admin-panel"
import { useEffect, useState } from "react"
import { testConnection } from "../lib/database"

function AdminContent() {
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking")

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testConnection()
      setConnectionStatus(isConnected ? "connected" : "error")
    }

    checkConnection()
  }, [])

  if (connectionStatus === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando ao banco de dados...</p>
        </div>
      </div>
    )
  }

  if (connectionStatus === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 mb-4">Não foi possível conectar ao banco de dados Neon.</p>
          <p className="text-sm text-gray-500">Verifique se a variável DATABASE_URL está configurada.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminPanel />
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  )
}
