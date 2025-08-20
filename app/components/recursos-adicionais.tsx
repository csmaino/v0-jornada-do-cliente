"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Headphones,
  Users,
  BookOpen,
  Clock,
  Calendar,
  Globe,
  Phone,
  Mail,
  FileText,
  Video,
  Book,
  CreditCard,
  Lock,
} from "lucide-react"
import { memo, useMemo, useCallback } from "react"
import { useAdmin } from "../contexts/admin-context"
import PermissionGuard from "./permission-guard"

interface RecursoCardProps {
  titulo: string
  descricao: string
  icone: "suporte" | "consultoria" | "ajuda" | "assinaturas"
  itens: { icone: React.ReactNode; texto: string | React.ReactNode }[]
  botaoTexto: string
  botaoCor: "azul" | "verde"
  permission?: string
  requiresRole?: "admin" | "manager" | "user" | "viewer"
}

// Memoização do componente RecursoCard
const RecursoCard = memo(
  ({ titulo, descricao, icone, itens, botaoTexto, botaoCor, permission, requiresRole }: RecursoCardProps) => {
    const { hasPermission, currentUser } = useAdmin()

    // useMemo para otimizar a seleção do ícone
    const getIcone = useMemo(() => {
      switch (icone) {
        case "suporte":
          return <Headphones className="w-6 h-6 text-blue-700" />
        case "consultoria":
          return <Users className="w-6 h-6 text-green-600" />
        case "ajuda":
          return <BookOpen className="w-6 h-6 text-blue-700" />
        case "assinaturas":
          return <CreditCard className="w-6 h-6 text-green-600" />
      }
    }, [icone])

    // useMemo para otimizar classes de background do ícone
    const getIconeBg = useMemo(() => {
      switch (icone) {
        case "suporte":
          return "bg-blue-100"
        case "consultoria":
          return "bg-green-100"
        case "ajuda":
          return "bg-blue-100"
        case "assinaturas":
          return "bg-green-100"
      }
    }, [icone])

    // useMemo para otimizar classes do botão
    const getBotaoClasses = useMemo(() => {
      return botaoCor === "azul"
        ? "bg-[#033860] hover:bg-[#022b4b] text-white"
        : "bg-[#2A7221] hover:bg-[#236219] text-white"
    }, [botaoCor])

    // Verificar se o usuário tem acesso
    const hasAccess = useMemo(() => {
      if (permission && !hasPermission(permission)) return false
      if (requiresRole && currentUser?.role !== requiresRole && currentUser?.role !== "admin") return false
      return true
    }, [permission, requiresRole, hasPermission, currentUser])

    // useCallback para otimizar o clique do botão
    const handleButtonClick = useCallback(() => {
      if (!hasAccess) {
        alert("Você não tem permissão para acessar este recurso.")
        return
      }

      if (botaoTexto === "Acessar Central de Ajuda") {
        window.open("https://ajuda.maino.com.br/pt-BR/", "_blank")
      } else if (botaoTexto === "Falar com atendente") {
        window.open("https://api.whatsapp.com/message/OEM3ZM56VHVBO1?autoload=1&app_absent=0", "_blank")
      }
    }, [botaoTexto, hasAccess])

    // useMemo para otimizar a renderização dos itens
    const itensRenderizados = useMemo(() => {
      return itens.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.icone}
          <span className={`text-sm ${hasAccess ? "text-gray-700" : "text-gray-400"}`}>{item.texto}</span>
        </div>
      ))
    }, [itens, hasAccess])

    return (
      <Card className={`border-gray-200 h-full ${!hasAccess ? "opacity-60" : ""}`}>
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex flex-col items-center mb-4">
            <div className={`w-12 h-12 ${getIconeBg} rounded-full flex items-center justify-center mb-3 relative`}>
              {getIcone}
              {!hasAccess && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <h3
              className={`text-lg font-bold text-center leading-tight ${hasAccess ? "text-gray-800" : "text-gray-500"}`}
            >
              {titulo}
            </h3>
          </div>

          <p
            className={`text-center mb-4 text-sm leading-relaxed flex-grow ${hasAccess ? "text-gray-600" : "text-gray-400"}`}
          >
            {descricao}
          </p>

          <div className="space-y-2 mb-4">{itensRenderizados}</div>

          <Button
            className={`w-full py-2 text-sm ${getBotaoClasses} ${!hasAccess ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleButtonClick}
            disabled={!hasAccess}
          >
            {botaoTexto}
          </Button>

          {!hasAccess && (
            <p className="text-xs text-red-500 text-center mt-2">
              {permission ? "Permissão necessária" : `Acesso restrito para ${requiresRole}`}
            </p>
          )}
        </CardContent>
      </Card>
    )
  },
)

RecursoCard.displayName = "RecursoCard"

const RecursosAdicionais = memo(() => {
  // useMemo para otimizar a lista de recursos com permissões
  const recursos = useMemo(
    (): RecursoCardProps[] => [
      {
        titulo: "Suporte Técnico",
        descricao: "Nosso time de suporte está disponível para ajudar com questões técnicas e dúvidas sobre o sistema.",
        icone: "suporte",
        permission: "content.view", // Requer permissão para visualizar conteúdo
        itens: [
          {
            icone: <Clock className="w-4 h-4 text-gray-500" />,
            texto: "Segunda a Sexta, 9h às 18h",
          },
          {
            icone: <Phone className="w-4 h-4 text-gray-500" />,
            texto: (
              <a
                href="https://api.whatsapp.com/message/OEM3ZM56VHVBO1?autoload=1&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline transition-colors"
              >
                (21) 2224-5777
              </a>
            ),
          },
          {
            icone: <Mail className="w-4 h-4 text-gray-500" />,
            texto: "suporte@maino.com.br",
          },
        ],
        botaoTexto: "Falar com atendente",
        botaoCor: "azul",
      },
      {
        titulo: "Consultoria",
        descricao: "Agende sessões de consultoria personalizada para otimizar o uso do sistema para seu negócio.",
        icone: "consultoria",
        requiresRole: "manager", // Requer role de manager ou superior
        itens: [
          {
            icone: <Calendar className="w-4 h-4 text-gray-500" />,
            texto: "Agendamento flexível",
          },
          {
            icone: <Clock className="w-4 h-4 text-gray-500" />,
            texto: "Sessões de 1h ou 2h",
          },
          {
            icone: <Globe className="w-4 h-4 text-gray-500" />,
            texto: "Online",
          },
        ],
        botaoTexto: "Agendar Consultoria",
        botaoCor: "verde",
      },
      {
        titulo: "Central de Ajuda",
        descricao: "Acesse nossa Central de Ajuda com materiais complementares e tutoriais.",
        icone: "ajuda",
        // Sem restrições - todos podem acessar
        itens: [
          {
            icone: <FileText className="w-4 h-4 text-gray-500" />,
            texto: "Base de conhecimento",
          },
          {
            icone: <Video className="w-4 h-4 text-gray-500" />,
            texto: "Vídeos tutoriais",
          },
          {
            icone: <Book className="w-4 h-4 text-gray-500" />,
            texto: "Manuais e guias",
          },
        ],
        botaoTexto: "Acessar Central de Ajuda",
        botaoCor: "azul",
      },
      {
        titulo: "Minhas Assinaturas",
        descricao:
          "Precisando realizar o upgrade no seu plano ou incluir um novo CNPJ ao seu grupo? Fale com seu gerente de contas agora mesmo!",
        icone: "assinaturas",
        permission: "settings.view", // Requer permissão para ver configurações
        itens: [
          {
            icone: <Clock className="w-4 h-4 text-gray-500" />,
            texto: "Segunda a Sexta, 9h às 18h",
          },
          {
            icone: <Phone className="w-4 h-4 text-gray-500" />,
            texto: (
              <a
                href="https://api.whatsapp.com/message/OEM3ZM56VHVBO1?autoload=1&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline transition-colors"
              >
                (21) 2224-5777
              </a>
            ),
          },
          {
            icone: <Mail className="w-4 h-4 text-gray-500" />,
            texto: "cs@maino.com.br",
          },
        ],
        botaoTexto: "Falar com atendente",
        botaoCor: "verde",
      },
    ],
    [],
  )

  // useMemo para otimizar a renderização dos recursos
  const recursosRenderizados = useMemo(() => {
    return recursos.map((recurso, index) => <RecursoCard key={index} {...recurso} />)
  }, [recursos])

  return (
    <PermissionGuard permission="content.view" showFallback={false}>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Recursos Adicionais</h2>
            <p className="text-lg text-gray-600">Ferramentas e recursos para auxiliar sua jornada de implantação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{recursosRenderizados}</div>
        </div>
      </section>
    </PermissionGuard>
  )
})

RecursosAdicionais.displayName = "RecursosAdicionais"

export default RecursosAdicionais
