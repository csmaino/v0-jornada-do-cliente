"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ProgressContextType {
  atividadesConcluidas: { [moduloId: number]: number[] }
  toggleAtividade: (moduloId: number, aulaNumero: number) => void
  calcularProgressoModulo: (moduloId: number, totalAulas: number) => number
  calcularProgressoGeral: () => { progressoMedio: number; modulosCompletos: number }
  progressoGeral: number
  modulosCompletos: number
  pesquisaSatisfacao: number | null
  setPesquisaSatisfacao: (nota: number) => void
  certificadoGerado: boolean
  setCertificadoGerado: (gerado: boolean) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}

interface ProgressProviderProps {
  children: ReactNode
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  // Estado inicial com módulos 1 e 2 completos
  const [atividadesConcluidas, setAtividadesConcluidas] = useState<{ [moduloId: number]: number[] }>({
    1: [1, 2, 3, 4, 5, 6, 7, 8], // Módulo 1 completo
    2: [1, 2, 3], // Módulo 2 completo
    3: [], // Módulo 3 vazio para teste
    4: [], // Módulo 4 vazio
    5: [], // Módulo 5 vazio
    6: [], // Módulo 6 vazio
    7: [], // Módulo 7 vazio
    8: [], // Módulo 8 vazio
  })

  const [progressoGeral, setProgressoGeral] = useState(25)
  const [modulosCompletos, setModulosCompletos] = useState(2)
  const [pesquisaSatisfacao, setPesquisaSatisfacao] = useState<number | null>(null)
  const [certificadoGerado, setCertificadoGerado] = useState(false)

  // Dados dos módulos para cálculos
  const modulosData = [
    { id: 1, totalAulas: 8 },
    { id: 2, totalAulas: 3 },
    { id: 3, totalAulas: 7 },
    { id: 4, totalAulas: 6 },
    { id: 5, totalAulas: 4 },
    { id: 6, totalAulas: 6 },
    { id: 7, totalAulas: 6 },
    { id: 8, totalAulas: 0 },
  ]

  // Função para calcular progresso de um módulo
  const calcularProgressoModulo = (moduloId: number, totalAulas: number) => {
    const aulasCompletas = atividadesConcluidas[moduloId]?.length || 0
    return totalAulas > 0 ? Math.round((aulasCompletas / totalAulas) * 100) : 0
  }

  // Função para calcular progresso geral
  const calcularProgressoGeral = () => {
    const totalModulos = 8
    let modulosCompletosCount = 0
    let progressoTotal = 0

    // Contar módulos completos e somar progresso
    for (let i = 1; i <= totalModulos; i++) {
      const moduloInfo = modulosData.find((m) => m.id === i)
      if (moduloInfo) {
        if (i === 8) {
          // Módulo 8 é considerado completo apenas se certificado foi gerado
          const progresso = certificadoGerado ? 100 : 0
          progressoTotal += progresso
          if (progresso === 100) {
            modulosCompletosCount++
          }
        } else {
          const progresso = calcularProgressoModulo(i, moduloInfo.totalAulas)
          progressoTotal += progresso
          if (progresso === 100) {
            modulosCompletosCount++
          }
        }
      }
    }

    const progressoMedio = Math.round(progressoTotal / totalModulos)
    return { progressoMedio, modulosCompletos: modulosCompletosCount }
  }

  // Função para alternar status de atividade
  const toggleAtividade = (moduloId: number, aulaNumero: number) => {
    setAtividadesConcluidas((prev) => {
      const moduloAtividades = prev[moduloId] || []
      const jaCompleta = moduloAtividades.includes(aulaNumero)

      const novoEstado = {
        ...prev,
        [moduloId]: jaCompleta
          ? moduloAtividades.filter((num) => num !== aulaNumero)
          : [...moduloAtividades, aulaNumero],
      }

      return novoEstado
    })
  }

  // Atualizar progresso geral quando atividades mudarem
  useEffect(() => {
    const { progressoMedio, modulosCompletos: novosModulosCompletos } = calcularProgressoGeral()
    setProgressoGeral(progressoMedio)
    setModulosCompletos(novosModulosCompletos)
  }, [atividadesConcluidas, certificadoGerado])

  const value: ProgressContextType = {
    atividadesConcluidas,
    toggleAtividade,
    calcularProgressoModulo,
    calcularProgressoGeral,
    progressoGeral,
    modulosCompletos,
    pesquisaSatisfacao,
    setPesquisaSatisfacao,
    certificadoGerado,
    setCertificadoGerado,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
