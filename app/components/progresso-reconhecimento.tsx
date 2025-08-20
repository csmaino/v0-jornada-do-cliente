"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Award, Trophy, Compass, BookOpen, Rocket, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect, memo, useMemo } from "react"
import { useProgress } from "../contexts/progress-context"

interface BadgeProps {
  titulo: string
  descricao: string
  icone: React.ReactNode
  porcentagem: number
  conquistado: boolean
}

// Memoização do componente Badge
const Badge = memo(({ titulo, descricao, icone, porcentagem, conquistado }: BadgeProps) => {
  // useMemo para otimizar classes CSS
  const containerClasses = useMemo(() => {
    return `flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-md cursor-help ${
      conquistado ? "border-gray-200 bg-white shadow-sm" : "border-gray-100 bg-gray-50 opacity-40"
    }`
  }, [conquistado])

  const iconContainerClasses = useMemo(() => {
    return `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
      conquistado ? "bg-amber-100" : "bg-gray-100"
    }`
  }, [conquistado])

  const iconClasses = useMemo(() => {
    return conquistado ? "text-amber-600" : "text-gray-400"
  }, [conquistado])

  const titleClasses = useMemo(() => {
    return `font-medium ${conquistado ? "text-gray-800" : "text-gray-500"}`
  }, [conquistado])

  const badgeClasses = useMemo(() => {
    return `text-xs font-bold rounded-full px-2 py-0.5 ${
      conquistado ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"
    }`
  }, [conquistado])

  const descriptionClasses = useMemo(() => {
    return `text-xs ${conquistado ? "text-gray-600" : "text-gray-400"}`
  }, [conquistado])

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className={containerClasses}>
            <div className={iconContainerClasses}>
              <div className={iconClasses}>{icone}</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={titleClasses}>{titulo}</h4>
                <span className={badgeClasses}>{porcentagem}%</span>
              </div>
              <p className={descriptionClasses}>{descricao}</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-60 p-3">
          <p className="text-sm">
            <span className="font-bold">{titulo}</span>: {descricao}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {conquistado
              ? "Parabéns! Você conquistou este badge."
              : `Complete ${porcentagem}% dos módulos para desbloquear.`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

Badge.displayName = "Badge"

// Memoização do componente principal
const ProgressoReconhecimento = memo(() => {
  const { progressoGeral } = useProgress()
  const [progressoAnimado, setProgressoAnimado] = useState(0)

  // Animação de preenchimento da barra de progresso
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressoAnimado(progressoGeral)
    }, 300)
    return () => clearTimeout(timer)
  }, [progressoGeral])

  // useMemo para otimizar dados do ranking com posicionamento dinâmico
  const rankingUsuarios = useMemo(() => {
    const usuarios = [
      { nome: "Maria Silva", progresso: 85 },
      { nome: "João Santos", progresso: 78 },
      { nome: "Você", progresso: progressoGeral },
    ]

    // Ordenar por progresso (maior para menor)
    return usuarios.sort((a, b) => b.progresso - a.progresso)
  }, [progressoGeral])

  // Função para obter a posição do usuário
  const getPosicaoUsuario = useMemo(() => {
    const posicao = rankingUsuarios.findIndex((usuario) => usuario.nome === "Você") + 1
    return posicao
  }, [rankingUsuarios])

  // Função para obter o texto da posição
  const getTextoRanking = useMemo(() => {
    const posicao = getPosicaoUsuario
    switch (posicao) {
      case 1:
        return { numero: "1º", texto: "lugar no ranking", cor: "text-yellow-500" }
      case 2:
        return { numero: "2º", texto: "lugar no ranking", cor: "text-gray-400" }
      case 3:
        return { numero: "3º", texto: "lugar no ranking", cor: "text-amber-600" }
      default:
        return { numero: `${posicao}º`, texto: "lugar no ranking", cor: "text-[#59B4E3]" }
    }
  }, [getPosicaoUsuario])

  // useMemo para otimizar badges
  const badges = useMemo(
    (): BadgeProps[] => [
      {
        titulo: "Explorador Mainô",
        descricao: "Iniciou a jornada e completou os primeiros módulos.",
        icone: <Compass className="w-5 h-5" />,
        porcentagem: 25,
        conquistado: progressoGeral >= 25,
      },
      {
        titulo: "Conhecedor Mainô",
        descricao: "Avançando bem! Metade da trilha concluída.",
        icone: <BookOpen className="w-5 h-5" />,
        porcentagem: 50,
        conquistado: progressoGeral >= 50,
      },
      {
        titulo: "Avançado Mainô",
        descricao: "Já domina boa parte do sistema!",
        icone: <Rocket className="w-5 h-5" />,
        porcentagem: 75,
        conquistado: progressoGeral >= 75,
      },
      {
        titulo: "Especialista Mainô",
        descricao: "Concluiu toda a jornada de implantação!",
        icone: <Trophy className="w-5 h-5" />,
        porcentagem: 100,
        conquistado: progressoGeral >= 100,
      },
    ],
    [progressoGeral],
  )

  // useMemo para otimizar renderização dos badges
  const badgesRenderizados = useMemo(() => {
    return badges.map((badge, index) => <Badge key={index} {...badge} />)
  }, [badges])

  // useMemo para otimizar renderização do ranking
  const rankingRenderizado = useMemo(() => {
    return rankingUsuarios.map((usuario, index) => (
      <div key={index} className="flex justify-between items-center">
        <span className={`font-medium ${usuario.nome === "Você" ? "text-[#59B4E3] font-bold" : "text-gray-700"}`}>
          {usuario.nome}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">{usuario.progresso}%</span>
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                usuario.nome === "Você" ? "bg-[#59B4E3]" : "bg-gray-400"
              } transition-[width] duration-700 ease-in-out`}
              style={{ width: `${usuario.progresso}%` }}
            ></div>
          </div>
        </div>
      </div>
    ))
  }, [rankingUsuarios])

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Progresso e reconhecimento</h2>
          <p className="text-lg text-gray-600">Acompanhe seu progresso e conquistas durante a jornada de implantação</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Certificação */}
          <Card className="border-gray-200 h-full flex flex-col transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-[#286A2D]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Certificação</h3>
              </div>

              <div className="mb-6 flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Progresso total</span>
                  <span className="text-sm font-bold text-gray-800">{progressoGeral}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#286A2D] transition-[width] duration-700 ease-in-out"
                    style={{ width: `${progressoAnimado}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Complete todos os módulos para receber seu certificado de especialista Mainô
              </p>

              <div className="flex items-center justify-between text-gray-500 mt-auto">
                <div className="flex items-center space-x-1">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">Previsão de conclusão: 15 dias</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Em andamento</span>
              </div>
            </CardContent>
          </Card>

          {/* Ranking */}
          <Card className="border-gray-200 h-full flex flex-col transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-[#59B4E3]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ranking</h3>
              </div>

              <div className="text-center mb-6 flex-grow">
                <div className={`text-4xl font-bold ${getTextoRanking.cor} mb-1`}>{getTextoRanking.numero}</div>
                <div className="text-sm text-gray-600">{getTextoRanking.texto}</div>
                {getPosicaoUsuario === 1 && (
                  <div className="mt-2">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                      🏆 Líder!
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mt-auto">{rankingRenderizado}</div>
            </CardContent>
          </Card>

          {/* Conquistas */}
          <Card className="border-gray-200 h-full flex flex-col max-h-80 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-6 flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Conquistas</h3>
              </div>

              <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
                <div className="space-y-3">{badgesRenderizados}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
})

ProgressoReconhecimento.displayName = "ProgressoReconhecimento"

export default ProgressoReconhecimento
