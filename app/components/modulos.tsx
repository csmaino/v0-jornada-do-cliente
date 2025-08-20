"use client"

import type React from "react"

import { useState, memo, useCallback, useMemo, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Clock, CheckCircle, Info, Award, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useProgress } from "../contexts/progress-context"
import { useAdmin } from "../contexts/admin-context"

interface ModuloProps {
  titulo: string
  descricao: string
  tempo: number
  status: "Revisar" | "Continuar" | "Iniciar" | "Bloqueado" | "Acessar"
  numero?: number
  completo?: boolean
  ativo?: boolean
  isPreRequisito?: boolean
  isDesbloqueado: boolean
  progresso: number
  isOverLimit?: boolean
  timeCategory?: "short" | "medium" | "long" | "very-long"
  onModuloClick?: () => void
}

// Memoização do componente Modulo para evitar re-renders desnecessários
const Modulo = memo(
  ({
    titulo,
    descricao,
    tempo,
    status,
    numero,
    completo,
    ativo,
    isPreRequisito,
    isDesbloqueado,
    progresso,
    isOverLimit,
    timeCategory,
    onModuloClick,
  }: ModuloProps) => {
    // useCallback para otimizar as funções de clique
    const handleModuloClick = useCallback(() => {
      if (onModuloClick && isDesbloqueado) {
        onModuloClick()
      }
    }, [onModuloClick, isDesbloqueado])

    const handleActionClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onModuloClick && isDesbloqueado) {
          onModuloClick()
        }
      },
      [onModuloClick, isDesbloqueado],
    )

    // useMemo para otimizar cálculos de classes CSS
    const cardClasses = useMemo(() => {
      return `p-6 h-full flex flex-col justify-between overflow-visible transition-all duration-300 hover:shadow-md ${
        ativo
          ? "border-[#59B4E3] border-2"
          : isDesbloqueado
            ? "border-gray-200 hover:border-[#59B4E3] cursor-pointer"
            : "border-gray-200 opacity-75"
      }`
    }, [ativo, isDesbloqueado])

    const titleClasses = useMemo(() => {
      return `text-lg font-semibold ${
        isDesbloqueado ? "text-gray-800 hover:text-[#59B4E3]" : "text-gray-600"
      } transition-colors duration-300 cursor-pointer`
    }, [isDesbloqueado])

    const descriptionClasses = useMemo(() => {
      return `text-sm mb-4 ${
        isDesbloqueado ? "text-gray-600 hover:text-gray-800" : "text-gray-500"
      } transition-colors duration-300 cursor-pointer`
    }, [isDesbloqueado])

    const indicatorClasses = useMemo(() => {
      return progresso === 100
        ? "bg-[#286A2D] transition-[width] duration-700 ease-in-out"
        : ativo
          ? "bg-[#59B4E3] transition-[width] duration-700 ease-in-out"
          : "bg-gray-300 transition-[width] duration-700 ease-in-out"
    }, [progresso, ativo])

    // Get time display styling based on category
    const getTimeClasses = useMemo(() => {
      const baseClasses = "flex items-center text-sm"

      switch (timeCategory) {
        case "short":
          return `${baseClasses} text-green-600`
        case "medium":
          return `${baseClasses} text-blue-600`
        case "long":
          return `${baseClasses} text-orange-600`
        case "very-long":
          return `${baseClasses} text-red-600`
        default:
          return `${baseClasses} text-gray-500`
      }
    }, [timeCategory])

    return (
      <Card className={cardClasses} onClick={handleModuloClick}>
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className={titleClasses}>{titulo}</h3>
            {completo ? (
              <div className="w-7 h-7 bg-[#286A2D] rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div
                className={`w-7 h-7 ${ativo ? "bg-[#59B4E3]" : "bg-gray-300"} rounded-full flex items-center justify-center`}
              >
                <span className="text-white font-medium text-sm">{numero}</span>
              </div>
            )}
          </div>
          <p className={descriptionClasses}>{descricao}</p>
        </div>

        <div>
          {numero !== 8 && (
            <>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600">Progresso</span>
                <span className="font-medium">{progresso}%</span>
              </div>
              <Progress value={progresso} className="h-2 mb-4" indicatorClassName={indicatorClasses} />
            </>
          )}

          {numero === 8 && (
            <div className="mb-4">
              <div className="flex items-center justify-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Award className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">Certificado</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center overflow-visible">
            {tempo > 0 && (
              <div className={getTimeClasses}>
                <Clock className="w-4 h-4 mr-1" />
                <span>{tempo} min</span>
                {isOverLimit && (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="w-3 h-3 ml-1 text-orange-500" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-48 text-xs">
                        <p>Este módulo é mais longo. Considere fazer pausas durante o aprendizado.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
            {tempo === 0 && <div></div>} {/* Espaçador quando não há tempo */}
            <div className="flex items-center relative overflow-visible">
              {status === "Revisar" ? (
                <button
                  onClick={handleActionClick}
                  className="text-[#59B4E3] font-medium text-sm hover:text-[#4A9BD1] transition-colors duration-300 hover:scale-105"
                >
                  Revisar
                </button>
              ) : status === "Continuar" && isDesbloqueado ? (
                <button
                  onClick={handleActionClick}
                  className="bg-[#59B4E3] text-white px-4 py-1 rounded-md text-sm hover:bg-[#4A9BD1] transition-all duration-300 hover:scale-105"
                >
                  Continuar
                </button>
              ) : status === "Iniciar" && isDesbloqueado ? (
                <button
                  onClick={handleActionClick}
                  className="bg-[#286A2D] text-white px-4 py-1 rounded-md text-sm hover:bg-[#236219] transition-all duration-300 hover:scale-105"
                >
                  Iniciar
                </button>
              ) : status === "Acessar" && isDesbloqueado ? (
                <button
                  onClick={handleActionClick}
                  className="bg-yellow-600 text-white px-4 py-1 rounded-md text-sm hover:bg-yellow-700 transition-all duration-300 hover:scale-105"
                >
                  Acessar
                </button>
              ) : (
                <span className="text-gray-400 text-sm">Bloqueado</span>
              )}

              {isPreRequisito && (
                <div className="relative ml-2">
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 opacity-60 hover:opacity-100 transition-opacity">
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-48 text-xs z-50">
                        <p>
                          Este módulo precisa ser concluído por pelo menos um usuário para desbloquear os demais
                          módulos.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  },
)

// Definir displayName para debugging
Modulo.displayName = "Modulo"

interface ModulosProps {
  onModuloSelect?: (moduloId: number) => void
}

const Modulos = memo(({ onModuloSelect }: ModulosProps) => {
  const { calcularProgressoModulo, certificadoGerado } = useProgress()
  const { modules: adminModules, currentUser, refreshTrigger } = useAdmin()
  const [modulo1Concluido] = useState(true)

  // useCallback para otimizar a função de clique
  const handleModuloClick = useCallback(
    (moduloId: number) => {
      if (onModuloSelect) {
        onModuloSelect(moduloId)
      }

      // Scroll suave para a seção de progresso
      const progressoSection = document.getElementById("progresso-modulo")
      if (progressoSection) {
        progressoSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    },
    [onModuloSelect],
  )

  // Escutar mudanças do admin context através do refreshTrigger
  useEffect(() => {
    console.log("🔄 Módulos detectaram mudança administrativa:", refreshTrigger)
  }, [refreshTrigger])

  // useMemo para otimizar a criação da lista de módulos
  const modulos = useMemo(() => {
    const getModuloStatus = (moduloId: number, progresso: number) => {
      if (moduloId === 8) {
        return "Acessar"
      }

      if (moduloId === 1) {
        return progresso === 100 ? "Revisar" : "Continuar"
      }

      if (!modulo1Concluido) {
        return "Bloqueado"
      }

      if (progresso === 100) {
        return "Revisar"
      } else if (progresso > 0) {
        return "Continuar"
      } else {
        return "Iniciar"
      }
    }

    // Verificação de segurança para adminModules
    if (!adminModules || !Array.isArray(adminModules)) {
      console.warn("⚠️ adminModules não está disponível ou não é um array")
      return []
    }

    // Debug: Log dos módulos do admin
    console.log("📚 Admin Modules:", adminModules)
    console.log("👤 Current User Plan:", currentUser?.plan)

    // Melhorar o filtro de módulos ativos:
    const modulosFromAdmin = adminModules
      .filter((adminModule) => {
        // Verificação de segurança
        if (!adminModule || typeof adminModule !== "object") {
          console.warn("⚠️ Módulo inválido encontrado:", adminModule)
          return false
        }

        console.log(`Verificando módulo ${adminModule.name}:`, {
          id: adminModule.id,
          isActive: adminModule.isActive,
          contentsCount: adminModule.contents?.length || 0,
        })
        return adminModule.isActive // Usar apenas módulos ativos
      })
      .map((adminModule) => {
        const moduloId = Number.parseInt(adminModule.id)

        // Verificação de segurança para contents
        const contents = adminModule.contents || []

        // Filtrar apenas conteúdos ativos
        const activeContents = contents.filter((content) => {
          if (!content || typeof content !== "object") {
            console.warn("⚠️ Conteúdo inválido encontrado:", content)
            return false
          }

          console.log(`Conteúdo ${content.title}:`, {
            isActive: content.isActive,
            plans: content.plans,
          })
          return content.isActive
        })

        const totalContents = activeContents.length
        const progresso = calcularProgressoModulo(moduloId, totalContents)
        const tempoTotal = activeContents.reduce((total, content) => {
          const duration = content.duration || 0
          return total + duration
        }, 0)

        console.log(`Módulo ${moduloId} processado:`, {
          totalContents,
          progresso,
          tempoTotal,
        })

        return {
          id: moduloId,
          titulo: adminModule.name || `Módulo ${moduloId}`,
          descricao: adminModule.description || "Descrição não disponível",
          progresso,
          tempo: tempoTotal,
          status: getModuloStatus(moduloId, progresso),
          completo: progresso === 100,
          numero: moduloId,
          ativo: modulo1Concluido && progresso > 0 && progresso < 100,
          isDesbloqueado: adminModule.isActive && (moduloId === 1 || modulo1Concluido),
          isPreRequisito: moduloId === 1,
          isOverLimit: tempoTotal > 60,
          timeCategory:
            tempoTotal <= 20 ? "short" : tempoTotal <= 40 ? "medium" : tempoTotal <= 60 ? "long" : "very-long",
        }
      })

    // Adicionar módulo de certificação se não existir
    const hasCertificateModule = modulosFromAdmin.some((m) => m.id === 8)
    if (!hasCertificateModule) {
      modulosFromAdmin.push({
        id: 8,
        titulo: "Encerramento e Certificação",
        descricao: "Certificação de conclusão do treinamento",
        progresso: certificadoGerado ? 100 : 0,
        tempo: 0,
        status: "Acessar" as const,
        numero: 8,
        completo: certificadoGerado,
        isDesbloqueado: modulo1Concluido,
        isOverLimit: false,
        timeCategory: "short" as const,
      })
    }

    // Ordenar por ID
    const sortedModules = modulosFromAdmin.sort((a, b) => a.id - b.id)
    console.log("📋 Final modules to render:", sortedModules)

    return sortedModules
  }, [adminModules, modulo1Concluido, calcularProgressoModulo, certificadoGerado, currentUser, refreshTrigger])

  // useMemo para otimizar a renderização dos módulos
  const modulosRenderizados = useMemo(() => {
    return modulos.map((modulo) => (
      <Modulo key={`${modulo.id}-${refreshTrigger}`} {...modulo} onModuloClick={() => handleModuloClick(modulo.id)} />
    ))
  }, [modulos, handleModuloClick, refreshTrigger])

  return (
    <section id="modulos-aprendizado" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossos Módulos de Aprendizado</h2>
          <p className="text-lg text-gray-600">Navegue pelos módulos essenciais para dominar o sistema Mainô</p>
          {currentUser?.plan && (
            <p className="text-sm text-blue-600 mt-2">
              Plano atual: <span className="font-semibold">{currentUser.plan}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-visible">
          {modulosRenderizados}
        </div>
      </div>
    </section>
  )
})

Modulos.displayName = "Modulos"

export default Modulos
