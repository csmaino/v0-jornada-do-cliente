"use client"
import { Bell, Settings, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { useAdmin } from "../contexts/admin-context"

export default function Header() {
  const { currentUser, isAdmin, isManager, hasPermission, logout } = useAdmin()

  return (
    <header className="bg-[#033860] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logo-maino-branco.png" alt="Mainô" width={140} height={46} className="h-10 w-auto" priority />
          </div>

          {/* Right side - Notifications and User */}
          <div className="flex items-center space-x-4">
            {/* Admin Panel Access */}
            {(isAdmin || hasPermission("system.admin")) && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-slate-700 hover:scale-110 transition-all duration-200"
                  title="Painel Administrativo"
                >
                  <Shield className="h-6 w-6" />
                </Button>
              </Link>
            )}

            {/* Notification Bell - APENAS O SINO, SEM BADGE */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-slate-700 hover:scale-110 transition-all duration-200"
                onClick={() => window.open("https://changelog.maino.com.br/", "_blank")}
                disabled={!hasPermission("content.view")}
              >
                <Bell className="h-6 w-6" />
              </Button>
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-700 rounded-lg px-2 py-1 transition-colors">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {currentUser?.avatar || currentUser?.name.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-white text-sm font-medium">{currentUser?.name || "Usuário"}</span>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                        {currentUser?.role === "admin"
                          ? "Admin"
                          : currentUser?.role === "manager"
                            ? "Gerente"
                            : currentUser?.role === "user"
                              ? "Usuário"
                              : "Visualizador"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  <p className="text-xs text-gray-500">{currentUser?.department}</p>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>

                {hasPermission("settings.view") && (
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                {(isAdmin || hasPermission("system.admin")) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Painel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
