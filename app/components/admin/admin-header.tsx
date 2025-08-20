"use client"

import { ArrowLeft, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAdmin } from "../../contexts/admin-context"

export default function AdminHeader() {
  const { currentUser } = useAdmin()

  return (
    <header className="bg-[#033860] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/logo-maino-branco.png"
                alt="Mainô Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Usuário e Ações */}
          <div className="flex items-center space-x-4">
            {/* Informações do Usuário */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#59B4E3] rounded-full flex items-center justify-center">
                {currentUser?.avatar ? (
                  <span className="text-sm font-medium">{currentUser.avatar}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser?.name || "Rafael Moreira"}</p>
                <p className="text-xs text-gray-300 capitalize">{currentUser?.role || "Admin"}</p>
              </div>
            </div>

            {/* Voltar ao Site */}
            <Link
              href="/"
              className="flex items-center space-x-2 bg-[#59B4E3] hover:bg-[#4A9BD1] px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar ao Site</span>
              <span className="sm:hidden">Voltar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Linha decorativa */}
      <div className="h-1 bg-gradient-to-r from-[#59B4E3] to-[#4A9BD1]"></div>
    </header>
  )
}
