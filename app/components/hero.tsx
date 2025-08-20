"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Trophy, Compass, BookOpen, Rocket, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect, useMemo } from "react"
import { useProgress } from "../contexts/progress-context"
import { calculateModuleTime, formatModuleTime } from "../utils/time-calculator"

export default function Hero() {
  const { progressoGeral, modulosCompletos } = useProgress()
  const [progressoAnimado, setProgressoAnimado] = useState(0)

  // Calculate total course time dynamically
  const allModuleActivities = [
    [
      { numero: 1, titulo: "", descricao: "", tempo: 3, tipo: "video" as const },
      { numero: 2, titulo: "", descricao: "", tempo: 5, tipo: "artigo" as const },
      { numero: 3, titulo: "", descricao: "", tempo: 7, tipo: "multipla" as const, opcoes: [{}, {}] },
      { numero: 4, titulo: "", descricao: "", tempo: 4, tipo: "artigo" as const },
      { numero: 5, titulo: "", descricao: "", tempo: 3, tipo: "artigo" as const },
      { numero: 6, titulo: "", descricao: "", tempo: 3, tipo: "artigo" as const },
      { numero: 7, titulo: "", descricao: "", tempo: 4, tipo: "conteudo" as const },
      { numero: 8, titulo: "", descricao: "", tempo: 5, tipo: "conteudo" as const },
    ],
    [
      { numero: 1, titulo: "", descricao: "", tempo: 20, tipo: "artigo" as const },
      { numero: 2, titulo: "", descricao: "", tempo: 25, tipo: "artigo" as const },
      { numero: 3, titulo: "", descricao: "", tempo: 15, tipo: "artigo" as const },
    ],
    [
      { numero: 1, titulo: "", descricao: "", tempo: 8, tipo: "multipla" as const, opcoes: [{}, {}] },
      { numero: 2, titulo: "", descricao: "", tempo: 5, tipo: "artigo" as const },
      { numero: 3, titulo: "", descricao: "", tempo: 6, tipo: "artigo" as const },
      { numero: 4, titulo: "", descricao: "", tempo: 4, tipo: "conteudo" as const },
      { numero: 5, titulo: "", descricao: "", tempo: 5, tipo: "conteudo" as const },
      { numero: 6, titulo: "", descricao: "", tempo: 4, tipo: "conteudo" as const },
      { numero: 7, titulo: "", descricao: "", tempo: 7, tipo: "multipla" as const, opcoes: [{}, {}, {}] },
    ],
    [
      { numero: 1, titulo: "", descricao: "", tempo: 8, tipo: "multipla" as const, opcoes: [{}, {}] },
      { numero: 2, titulo: "", descricao: "", tempo: 6, tipo: "artigo" as const },
      { numero: 3, titulo: "", descricao: "", tempo: 5, tipo: "artigo" as const },
      { numero: 4, titulo: "", descricao: "", tempo: 7, tipo: "artigo" as const },
      { numero: 5, titulo: "", descricao: "", tempo: 4, tipo: "conteudo" as const },
      { numero: 6, titulo: "", descricao: "", tempo: 4, tipo: "conteudo" as const },
    ],
    [
      { numero: 1, titulo: "", descricao: "", tempo: 7, tipo: "artigo" as const },
      { numero: 2, titulo: "", descricao: "", tempo: 5, tipo: "artigo" as const },
      { numero: 3, titulo: "", descricao: "", tempo: 7, tipo: "multipla" as const, opcoes: [{}, {}] },
      { numero: 4, titulo: "", descricao: "", tempo: 4, tipo: "conteudo" as const },
    ],
    [
      { numero: 1, titulo: "", descricao: "", tempo: 6, tipo: "artigo" as const },
      { numero: 2, titulo: "", descricao: "", tempo: 6, tipo: "artigo" as const },
      { numero: 3, titulo: "", descricao: "", tempo: 7, tipo: "artigo" as const },
      { numero: 4, titulo: "", descricao: "", tempo: 5, tipo: "artigo" as const },
      { numero: 5, titulo: "", descricao: "", tempo: 8, tipo: "artigo" as const },
      { numero: 6, titulo: "", descricao: "", tempo: 8, tipo: "multipla" as const, opcoes: [{}, {}, {}] },
    ],
    [
      { numero: 1, titulo: "", descricao: "", tempo: 5, tipo: "artigo" as const },
      { numero: 2, titulo: "", descricao: "", tempo: 6, tipo: "artigo" as const },
      { numero: 3, titulo: "", descricao: "", tempo: 7, tipo: "artigo" as const },
      { numero: 4, titulo: "", descricao: "", tempo: 5, tipo: "conteudo" as const },
      { numero: 5, titulo: "", descricao: "", tempo: 4, tipo: "conteudo" as const },
      { numero: 6, titulo: "", descricao: "", tempo: 8, tipo: "multipla" as const, opcoes: [{}, {}, {}] },
    ],
    [], // Module 8 has no activities
  ]

  // Calculate total course time using utility functions directly
  const { totalTime, formattedTotalTime } = useMemo(() => {
    const totalTime = allModuleActivities.reduce((total, activities) => {
      return total + calculateModuleTime(activities)
    }, 0)

    return {
      totalTime,
      formattedTotalTime: formatModuleTime(totalTime),
    }
  }, [])

  // Animação de preenchimento da barra de progresso
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressoAnimado(progressoGeral)
    }, 500)
    return () => clearTimeout(timer)
  }, [progressoGeral])

  const handleIniciarImplantacao = () => {
    const modulosSection = document.getElementById("modulos-aprendizado")
    if (modulosSection) {
      modulosSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Badges de progresso com informações detalhadas
  const badges = [
    {
      id: 1,
      titulo: "Explorador Mainô",
      icone: <Compass className="w-5 h-5" />,
      percentual: 25,
      conquistado: progressoGeral >= 25,
    },
    {
      id: 2,
      titulo: "Conhecedor Mainô",
      icone: <BookOpen className="w-5 h-5" />,
      percentual: 50,
      conquistado: progressoGeral >= 50,
    },
    {
      id: 3,
      titulo: "Avançado Mainô",
      icone: <Rocket className="w-5 h-5" />,
      percentual: 75,
      conquistado: progressoGeral >= 75,
    },
    {
      id: 4,
      titulo: "Especialista Mainô",
      icone: <Trophy className="w-5 h-5" />,
      percentual: 100,
      conquistado: progressoGeral >= 100,
    },
  ]

  const BadgeIcon = ({ badge, index }: { badge: any; index: number }) => {
    const isLast = index === badges.length - 1

    return (
      <div key={badge.id} className="flex items-center">
        <div className="flex flex-col items-center relative">
          {/* Badge principal */}
          <div
            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              badge.conquistado ? "bg-[#286A2D] shadow-lg" : "bg-gray-300"
            }`}
          >
            {/* Ícone principal */}
            <div className={badge.conquistado ? "text-white" : "text-gray-500"}>
              {badge.conquistado ? <CheckCircle className="w-6 h-6" /> : badge.icone}
            </div>

            {/* Badge de percentual */}
            <div
              className={`absolute -bottom-1 -right-1 w-8 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white ${
                badge.conquistado ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {badge.percentual}%
            </div>

            {/* Tooltip apenas no último ícone (troféu) */}
            {isLast && (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm cursor-help">
                      <Info className="w-3 h-3 text-gray-500 hover:text-gray-700 transition-colors duration-200" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end" className="max-w-64 p-3 bg-white border shadow-lg">
                    <p className="text-sm text-gray-700 text-center">
                      Estes badges representam suas conquistas conforme você completa os módulos de aprendizado. Cada
                      badge é desbloqueado ao atingir o percentual de progresso correspondente.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Linha conectora */}
        {!isLast && (
          <div
            className={`w-10 h-1 mx-3 rounded-full transition-all duration-500 ${
              badge.conquistado ? "bg-[#286A2D]" : "bg-gray-300"
            }`}
          ></div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight mb-6">
                Bem-vindo à sua jornada de implantação Mainô
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Conheça o sistema e otimize suas operações passo a passo com nossa trilha de aprendizado estruturada
              </p>
              <Button
                onClick={handleIniciarImplantacao}
                className="bg-[#2A7221] hover:bg-[#236219] text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Inicie sua implantação
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20">
            <div className="w-96 h-96 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full opacity-60"></div>
              <div className="absolute top-16 right-16 w-24 h-24 bg-blue-400 rounded-full opacity-40"></div>
              <div className="absolute bottom-0 right-8 w-40 h-40 bg-blue-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu progresso</h2>
              <p className="text-gray-600">Continue de onde parou na sua jornada de aprendizado</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Tempo total estimado</div>
              <div className="text-lg font-semibold text-[#59B4E3]">{formattedTotalTime}</div>
            </div>
          </div>

          <Card className="bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">Progresso total</span>
                <span className="text-sm font-bold text-gray-800">{progressoGeral}%</span>
              </div>

              <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#59B4E3] rounded-full transition-[width] duration-700 ease-in-out"
                  style={{ width: `${progressoAnimado}%` }}
                ></div>
              </div>

              {/* Texto interativo com progresso */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600">
                  Você já completou <span className="font-semibold text-[#59B4E3]">{modulosCompletos}</span> de 8
                  módulos. Continue sua jornada para desbloquear a certificação!
                </p>
              </div>

              <div className="flex items-center justify-between">
                {/* Badges de Progresso */}
                <div className="flex items-center">
                  {badges.map((badge, index) => (
                    <BadgeIcon key={badge.id} badge={badge} index={index} />
                  ))}
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Próxima meta:</span> Completar Módulo 3
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
