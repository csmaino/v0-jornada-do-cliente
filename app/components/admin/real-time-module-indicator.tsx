"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { useAdmin } from "../../contexts/admin-context"

export default function RealTimeModuleIndicator() {
  const { modules, lastUpdate, isAdmin } = useAdmin()
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      setShowUpdateNotification(true)
      const timer = setTimeout(() => setShowUpdateNotification(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [lastUpdate, isAdmin])

  if (!isAdmin || !showUpdateNotification) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge className="bg-green-600 text-white px-3 py-2 flex items-center space-x-2 animate-pulse">
        <CheckCircle className="w-4 h-4" />
        <span>Módulos atualizados em tempo real!</span>
      </Badge>
    </div>
  )
}
