"use client"

import type React from "react"
import { useAdmin } from "../contexts/admin-context"
import { AlertTriangle, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PermissionGuardProps {
  permission?: string
  role?: "admin" | "manager" | "user" | "viewer"
  fallback?: React.ReactNode
  children: React.ReactNode
  showFallback?: boolean
}

export default function PermissionGuard({
  permission,
  role,
  fallback,
  children,
  showFallback = true,
}: PermissionGuardProps) {
  const { currentUser, hasPermission, isAdmin } = useAdmin()

  // Se não há usuário logado
  if (!currentUser) {
    return showFallback ? (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-medium">Acesso negado</p>
          <p className="text-red-600 text-sm">Você precisa estar logado para acessar este conteúdo.</p>
        </CardContent>
      </Card>
    ) : null
  }

  // Verificar permissão específica
  if (permission && !hasPermission(permission) && !isAdmin) {
    return showFallback
      ? fallback || (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-orange-700 font-medium">Permissão insuficiente</p>
              <p className="text-orange-600 text-sm">Você não tem permissão para acessar este conteúdo.</p>
            </CardContent>
          </Card>
        )
      : null
  }

  // Verificar role específica
  if (role && currentUser.role !== role && !isAdmin) {
    return showFallback
      ? fallback || (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-medium">Acesso restrito</p>
              <p className="text-red-600 text-sm">Este conteúdo é restrito para usuários com role: {role}</p>
            </CardContent>
          </Card>
        )
      : null
  }

  return <>{children}</>
}
