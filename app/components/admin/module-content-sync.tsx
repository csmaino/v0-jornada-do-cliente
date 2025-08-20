"use client"

import { useEffect } from "react"
import { useAdmin } from "../../contexts/admin-context"
import { useProgress } from "../../contexts/progress-context"

// Componente para sincronizar dados entre admin e progress
export default function ModuleContentSync() {
  const { modules, lastUpdate } = useAdmin()
  const { refreshUserData } = useProgress()

  useEffect(() => {
    // Quando os módulos são atualizados no admin, atualizar o contexto de progresso
    refreshUserData()
  }, [modules, lastUpdate, refreshUserData])

  return null // Componente invisível apenas para sincronização
}
