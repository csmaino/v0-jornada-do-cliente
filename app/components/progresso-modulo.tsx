"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Clock,
  FileText,
  Download,
  Play,
  ChevronLeft,
  ChevronRight,
  Award,
  Loader2,
  ExternalLink,
  Video,
  BookOpen,
  X,
  RotateCcw,
  Headphones,
  HelpCircle,
  Star,
  Heart,
  Smile,
  Meh,
  Frown,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useProgress } from "../contexts/progress-context"
import { useAdmin, type ContentLink } from "../contexts/admin-context"

interface AulaProps {
  numero: number
  titulo: string
  descricao: string
  tempo: number
  tipo?: "video" | "artigo" | "conteudo" | "multipla" | "interactive"
  url?: string
  links?: ContentLink[]
  opcoes?: {
    titulo: string
    descricao: string
    url: string
  }[]
  moduloId: number
}

interface RecursoProps {
  titulo: string
  tipo: string
  tamanho: string
  icone: "pdf" | "xlsx" | "video"
}

interface ModuloData {
  id: number
  titulo: string
  descricao: string
  aulas: Omit<AulaProps, "moduloId">[]
  recursos: RecursoProps[]
  isDesbloqueado: boolean
}

interface ProgressoModuloProps {
  moduloSelecionado?: number
}

// Hook para pré-carregar jsPDF
const useJsPDFPreloader = () => {
  const [jsPDFModule, setJsPDFModule] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const preloadJsPDF = async () => {
      try {
        setIsLoading(true)
        console.log("🔄 Pré-carregando jsPDF em background...")

        const module = await import("jspdf")
        setJsPDFModule(module)
        setIsLoaded(true)
        setError(null)

        console.log("✅ jsPDF pré-carregado com sucesso!")
      } catch (err) {
        console.error("❌ Erro ao pré-carregar jsPDF:", err)
        setError("Erro ao carregar biblioteca PDF")
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(preloadJsPDF, 2000)
    return () => clearTimeout(timer)
  }, [])

  return { jsPDFModule, isLoading, isLoaded, error }
}

// Função para extrair ID do vídeo do YouTube
const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Componente do Player de Vídeo
const VideoPlayer = ({ videoId, onClose }: { videoId: string; onClose: () => void }) => {
  return (
    <div className="mt-4 border rounded-lg overflow-hidden bg-gray-50">
      <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
        <span className="text-sm font-medium text-gray-700">Vídeo do módulo</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="relative" style={{ paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="Vídeo do módulo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  )
}

// Componente para múltiplos links
const MultipleLinks = ({
  links,
  isCompleted,
  onToggleComplete,
}: {
  links: ContentLink[]
  isCompleted: boolean
  onToggleComplete: () => void
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAccessLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
    if (!isCompleted) {
      setTimeout(() => {
        onToggleComplete()
      }, 1000)
    }
  }

  return (
    <div className="mt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-2 h-auto text-left"
      >
        <span className="text-sm font-medium text-gray-700">{links.length} opções de conteúdo disponíveis</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {isExpanded && (
        <div className="mt-2 space-y-2 border-t pt-2">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h5 className="font-medium text-gray-800 text-sm">{link.title}</h5>
                {link.description && <p className="text-xs text-gray-600">{link.description}</p>}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAccessLink(link.url)}
                className="text-xs hover:bg-blue-50 hover:border-blue-300"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Acessar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AulaMultipla = ({
  opcoes,
  isCompleted,
  onToggleComplete,
}: {
  opcoes: any[]
  isCompleted: boolean
  onToggleComplete: () => void
}) => {
  const handleAccessLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
    if (!isCompleted) {
      setTimeout(() => {
        onToggleComplete()
      }, 1000)
    }
  }

  return (
    <div className="mt-3 space-y-2">
      {opcoes.map((opcao, index) => (
        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
          <div className="flex-1">
            <h5 className="font-medium text-gray-800 text-sm">{opcao.titulo}</h5>
            <p className="text-xs text-gray-600">{opcao.descricao}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAccessLink(opcao.url)}
            className="text-xs hover:bg-blue-50 hover:border-blue-300"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Acessar
          </Button>
        </div>
      ))}
    </div>
  )
}

// Componente de Pesquisa de Satisfação
const PesquisaSatisfacao = ({
  onSubmit,
  isSubmitted,
}: {
  onSubmit: (nota: number) => void
  isSubmitted: boolean
}) => {
  const [notaSelecionada, setNotaSelecionada] = useState<number | null>(null)

  const opcoesSatisfacao = [
    { nota: 0, emoji: <ThumbsDown className="w-8 h-8" />, label: "Muito insatisfeito", cor: "text-red-500" },
    { nota: 1, emoji: <Frown className="w-8 h-8" />, label: "Insatisfeito", cor: "text-red-400" },
    { nota: 2, emoji: <Meh className="w-8 h-8" />, label: "Neutro", cor: "text-yellow-500" },
    { nota: 3, emoji: <Smile className="w-8 h-8" />, label: "Satisfeito", cor: "text-green-400" },
    { nota: 4, emoji: <Heart className="w-8 h-8" />, label: "Muito satisfeito", cor: "text-green-500" },
    { nota: 5, emoji: <Star className="w-8 h-8" />, label: "Excelente", cor: "text-yellow-400" },
  ]

  const handleSubmit = () => {
    if (notaSelecionada !== null) {
      onSubmit(notaSelecionada)
    }
  }

  if (isSubmitted) {
    return (
      <div className="p-6 rounded-lg border border-green-200 bg-green-50">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-green-800 mb-2">Obrigado pelo seu feedback!</h4>
          <p className="text-green-700">Sua avaliação é muito importante para nós.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg border border-blue-200 bg-blue-50">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Avalie sua experiência</h4>
        <p className="text-gray-600">De 0 a 5, quão satisfeito você está com a trilha de implantação?</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {opcoesSatisfacao.map((opcao) => (
          <button
            key={opcao.nota}
            onClick={() => setNotaSelecionada(opcao.nota)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              notaSelecionada === opcao.nota
                ? "border-blue-500 bg-blue-100 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`${opcao.cor} flex flex-col items-center space-y-1`}>
              {opcao.emoji}
              <span className="text-xs font-medium text-gray-700">{opcao.nota}</span>
            </div>
          </button>
        ))}
      </div>

      {notaSelecionada !== null && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Você selecionou: <span className="font-semibold">{opcoesSatisfacao[notaSelecionada].label}</span>
          </p>
        </div>
      )}

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={notaSelecionada === null}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          Enviar avaliação
        </Button>
      </div>
    </div>
  )
}

export default function ProgressoModulo({ moduloSelecionado }: ProgressoModuloProps) {
  const [moduloAtual, setModuloAtual] = useState(3)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Adicionar esta linha
  const { modules: adminModules, user, refreshTrigger } = useAdmin()
  const userPlan = user?.plan

  const {
    atividadesConcluidas,
    toggleAtividade,
    calcularProgressoModulo,
    pesquisaSatisfacao,
    setPesquisaSatisfacao,
    certificadoGerado,
    setCertificadoGerado,
  } = useProgress()

  // Pré-carregar jsPDF em background
  const { jsPDFModule, isLoading, isLoaded, error } = useJsPDFPreloader()

  // Atualiza o módulo atual quando um módulo é selecionado
  useEffect(() => {
    if (moduloSelecionado && moduloSelecionado !== moduloAtual) {
      handleModuloChange(moduloSelecionado)
    }
  }, [moduloSelecionado])

  // Escutar mudanças do admin context através do refreshTrigger
  useEffect(() => {
    console.log("🔄 ProgressoModulo detectou mudança administrativa:", refreshTrigger)
  }, [refreshTrigger])

  // Função para mudança suave de módulo
  const handleModuloChange = (novoModulo: number) => {
    if (isTransitioning || novoModulo === moduloAtual) return

    setIsTransitioning(true)

    // Scroll suave para o novo módulo
    if (containerRef.current) {
      const moduleWidth = containerRef.current.scrollWidth / 8 // 8 módulos
      const targetScroll = (novoModulo - 1) * moduleWidth

      containerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }

    // Delay para sincronizar com a animação
    setTimeout(() => {
      setModuloAtual(novoModulo)
      setIsTransitioning(false)

      // Pequeno delay adicional para garantir que o DOM foi atualizado
      setTimeout(() => {
        // Scroll suave para o topo da seção ProgressoModulo
        const progressoSection = document.getElementById("progresso-modulo")
        if (progressoSection) {
          progressoSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }, 100)
    }, 300)
  }

  const Aula = ({ numero, titulo, descricao, tempo, tipo = "video", url, links, opcoes, moduloId }: AulaProps) => {
    const [isVideoExpanded, setIsVideoExpanded] = useState(false)
    const [videoId, setVideoId] = useState<string | null>(null)

    const isCompleted = atividadesConcluidas[moduloId]?.includes(numero) || false
    const isActive = !isCompleted && atividadesConcluidas[moduloId]?.length === numero - 1

    useEffect(() => {
      if (tipo === "video" && url) {
        const id = extractYouTubeId(url)
        setVideoId(id)
      }
    }, [tipo, url])

    const getStatusIcon = () => {
      if (isCompleted) {
        return <CheckCircle className="w-6 h-6 text-green-600" />
      }
      return (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
            isActive ? "bg-blue-400 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          {numero}
        </div>
      )
    }

    const getTipoIcon = () => {
      switch (tipo) {
        case "video":
          return <Video className="w-4 h-4 text-red-600" />
        case "artigo":
          return <BookOpen className="w-4 h-4 text-blue-600" />
        case "conteudo":
          return <FileText className="w-4 h-4 text-green-600" />
        case "multipla":
          return <FileText className="w-4 h-4 text-purple-600" />
        case "interactive":
          return <FileText className="w-4 h-4 text-purple-600" />
        default:
          return <Play className="w-4 h-4 text-gray-600" />
      }
    }

    const handleToggleComplete = () => {
      toggleAtividade(moduloId, numero)
    }

    const handleAccessLink = () => {
      if (tipo === "video" && videoId) {
        setIsVideoExpanded(true)
      } else if (url) {
        window.open(url, "_blank", "noopener,noreferrer")
        if (!isCompleted) {
          setTimeout(() => {
            handleToggleComplete()
          }, 1000)
        }
      }
    }

    const handleCloseVideo = () => {
      setIsVideoExpanded(false)
      if (!isCompleted) {
        setTimeout(() => {
          handleToggleComplete()
        }, 500)
      }
    }

    // Verificar se tem múltiplos links
    const hasMultipleLinks = links && links.length > 0

    return (
      <div className={`p-4 rounded-lg border ${isActive ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}>
        <div className="flex items-start space-x-3">
          {getStatusIcon()}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {getTipoIcon()}
              <h4 className="font-medium text-gray-800">{titulo}</h4>
              {hasMultipleLinks && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{links.length} opções</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{descricao}</p>

            {/* Renderizar múltiplos links se existirem */}
            {hasMultipleLinks ? (
              <MultipleLinks links={links} isCompleted={isCompleted} onToggleComplete={handleToggleComplete} />
            ) : tipo === "multipla" || tipo === "interactive" ? (
              <AulaMultipla opcoes={opcoes || []} isCompleted={isCompleted} onToggleComplete={handleToggleComplete} />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{tempo} min</span>
                  </div>
                  <span className={`font-medium ${isCompleted ? "text-green-600" : "text-gray-500"}`}>
                    {isCompleted ? "Concluído" : "Pendente"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAccessLink}
                      className="text-xs hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Acessar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleToggleComplete}
                    className={`text-xs ${
                      isCompleted
                        ? "bg-gray-500 hover:bg-gray-600 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Desmarcar
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Marcar como concluído
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Player de Vídeo Expandido */}
        {isVideoExpanded && videoId && <VideoPlayer videoId={videoId} onClose={handleCloseVideo} />}
      </div>
    )
  }

  const CertificadoDigital = ({
    jsPDFModule,
    isLoaded,
    isLoading,
    error,
  }: {
    jsPDFModule: any
    isLoaded: boolean
    isLoading: boolean
    error: string | null
  }) => {
    const [isGenerating, setIsGenerating] = useState(false)

    const gerarCertificadoPDF = async () => {
      if (!isLoaded || !jsPDFModule) {
        if (error) {
          alert("Erro: Biblioteca PDF não disponível. Tente recarregar a página.")
          return
        }
        alert("Aguarde, carregando biblioteca PDF...")
        return
      }

      try {
        setIsGenerating(true)
        console.log("📄 Gerando certificado PDF...")

        const { jsPDF } = jsPDFModule
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        })

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const nomeUsuario = user?.name || "Usuário Desconhecido"
        const dataAtual = new Date().toLocaleDateString("pt-BR")

        // Fundo do certificado
        doc.setFillColor(248, 250, 252)
        doc.rect(0, 0, pageWidth, pageHeight, "F")

        // Borda decorativa
        doc.setDrawColor(3, 56, 96)
        doc.setLineWidth(2)
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

        // Borda interna
        doc.setDrawColor(42, 114, 33)
        doc.setLineWidth(1)
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

        // Título principal
        doc.setFont("helvetica", "bold")
        doc.setFontSize(28)
        doc.setTextColor(3, 56, 96)
        const tituloText = "CERTIFICADO DE CONCLUSÃO"
        const tituloWidth = doc.getTextWidth(tituloText)
        doc.text(tituloText, (pageWidth - tituloWidth) / 2, 40)

        // Linha decorativa
        doc.setDrawColor(42, 114, 33)
        doc.setLineWidth(1)
        doc.line(50, 50, pageWidth - 50, 50)

        // Texto "Conferido a"
        doc.setFont("helvetica", "normal")
        doc.setFontSize(16)
        doc.setTextColor(75, 85, 99)
        const conferidoText = "Conferido a"
        const conferidoWidth = doc.getTextWidth(conferidoText)
        doc.text(conferidoText, (pageWidth - conferidoWidth) / 2, 70)

        // Nome do usuário
        doc.setFont("helvetica", "bold")
        doc.setFontSize(24)
        doc.setTextColor(3, 56, 96)
        const nomeWidth = doc.getTextWidth(nomeUsuario)
        doc.text(nomeUsuario, (pageWidth - nomeWidth) / 2, 85)

        // Linha sob o nome
        doc.setDrawColor(3, 56, 96)
        doc.setLineWidth(0.5)
        doc.line((pageWidth - nomeWidth) / 2, 88, (pageWidth + nomeWidth) / 2, 88)

        // Texto descritivo
        doc.setFont("helvetica", "normal")
        doc.setFontSize(14)
        doc.setTextColor(75, 85, 99)
        const textoDescritivo = [
          "Por demonstrar empenho e dedicação na Jornada do Cliente,",
          "concluindo com êxito o conteúdo da plataforma e se qualificando como:",
        ]

        textoDescritivo.forEach((linha, index) => {
          const linhaWidth = doc.getTextWidth(linha)
          doc.text(linha, (pageWidth - linhaWidth) / 2, 105 + index * 8)
        })

        // Título "Especialista Mainô"
        doc.setFont("helvetica", "bold")
        doc.setFontSize(20)
        doc.setTextColor(42, 114, 33)
        const especialistaText = "Especialista Mainô"
        const especialistaWidth = doc.getTextWidth(especialistaText)
        doc.text(especialistaText, (pageWidth - especialistaWidth) / 2, 130)

        // Data de emissão
        doc.setFont("helvetica", "normal")
        doc.setFontSize(12)
        doc.setTextColor(75, 85, 99)
        const dataText = `Emitido em ${dataAtual}`
        const dataWidth = doc.getTextWidth(dataText)
        doc.text(dataText, (pageWidth - dataWidth) / 2, 150)

        // Assinatura
        doc.setFont("helvetica", "italic")
        doc.setFontSize(14)
        doc.setTextColor(3, 56, 96)
        const assinaturaText = "Assinatura"
        doc.text(assinaturaText, 50, 175)

        // Linha para assinatura
        doc.setDrawColor(3, 56, 96)
        doc.setLineWidth(0.5)
        doc.line(50, 180, 120, 180)

        // Logo/texto Mainô (lado direito)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(16)
        doc.setTextColor(3, 56, 96)
        doc.text("Mainô", pageWidth - 60, 175)

        // Copyright
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(107, 114, 128)
        const copyrightText = "Mainô © 2025 - Todos os direitos reservados"
        const copyrightWidth = doc.getTextWidth(copyrightText)
        doc.text(copyrightText, (pageWidth - copyrightWidth) / 2, pageHeight - 20)

        // Salvar o PDF
        doc.save(`Certificado_Especialista_Maino_${nomeUsuario.replace(" ", "_")}.pdf`)

        // Marcar certificado como gerado
        setCertificadoGerado(true)

        console.log("✅ Certificado gerado com sucesso!")
      } catch (error) {
        console.error("❌ Erro ao gerar certificado:", error)
        alert("Erro ao gerar certificado. Tente novamente.")
      } finally {
        setIsGenerating(false)
      }
    }

    const getButtonContent = () => {
      if (isGenerating) {
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Gerando PDF...
          </>
        )
      }

      if (isLoading) {
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Preparando...
          </>
        )
      }

      if (error) {
        return (
          <>
            <Download className="w-4 h-4 mr-2" />
            Tentar novamente
          </>
        )
      }

      return (
        <>
          <Download className="w-4 h-4 mr-2" />
          Gerar certificado PDF
        </>
      )
    }

    const getButtonClass = () => {
      if (error) {
        return "bg-red-600 hover:bg-red-700 text-white"
      }
      return "bg-yellow-600 hover:bg-yellow-700 text-white"
    }

    const podeGerarCertificado = pesquisaSatisfacao !== null

    return (
      <div className="space-y-6">
        {/* Pesquisa de Satisfação */}
        <PesquisaSatisfacao onSubmit={setPesquisaSatisfacao} isSubmitted={pesquisaSatisfacao !== null} />

        {/* Certificado Digital */}
        <div
          className={`p-6 rounded-lg border transition-all duration-200 ${
            podeGerarCertificado
              ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 cursor-pointer hover:border-yellow-300"
              : "border-gray-200 bg-gray-50 opacity-60"
          }`}
          onClick={podeGerarCertificado ? gerarCertificadoPDF : undefined}
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-2 text-lg">Certificado digital</h4>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {podeGerarCertificado
                  ? "Chegou a hora de finalizar sua jornada de implantação com chave de ouro! Gere seu certificado digital e torne-se um especialista Mainô"
                  : "Complete a pesquisa de satisfação acima para liberar o download do seu certificado."}
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  className={getButtonClass()}
                  disabled={!podeGerarCertificado || isGenerating || (isLoading && !isLoaded)}
                >
                  {getButtonContent()}
                </Button>
                {isLoaded && podeGerarCertificado && (
                  <span className="text-xs text-green-600 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Pronto
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Recurso = ({ titulo, tipo, tamanho, icone }: RecursoProps) => {
    const getIcon = () => {
      switch (icone) {
        case "pdf":
          return <FileText className="w-6 h-6 text-blue-600" />
        case "xlsx":
          return <Download className="w-6 h-6 text-green-600" />
        case "video":
          return <Play className="w-6 h-6 text-red-600" />
        default:
          return <FileText className="w-6 h-6 text-gray-600" />
      }
    }

    const getBgColor = () => {
      switch (icone) {
        case "pdf":
          return "bg-blue-100"
        case "xlsx":
          return "bg-green-100"
        case "video":
          return "bg-red-100"
        default:
          return "bg-gray-100"
      }
    }

    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
        <div className={`w-10 h-10 rounded-lg ${getBgColor()} flex items-center justify-center`}>{getIcon()}</div>
        <div>
          <h5 className="font-medium text-gray-800">{titulo}</h5>
          <p className="text-sm text-gray-500">
            {tipo} - {tamanho}
          </p>
        </div>
      </div>
    )
  }

  // Função para renderizar atividades organizadas por tipo
  const renderizarTodasAtividades = (aulas: Omit<AulaProps, "moduloId">[], moduloId: number) => {
    if (aulas.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Nenhuma atividade disponível neste módulo</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {aulas.map((aula, index) => (
          <Aula key={`aula-${index}`} {...aula} moduloId={moduloId} />
        ))}
      </div>
    )
  }

  const modulosData: ModuloData[] = useMemo(() => {
    if (!adminModules) {
      return []
    }

    return adminModules
      .filter((adminModule) => adminModule.isActive) // Apenas módulos ativos do admin
      .map((adminModule) => ({
        id: Number.parseInt(adminModule.id),
        titulo: adminModule.name,
        descricao: adminModule.description,
        isDesbloqueado: adminModule.isActive, // Controle direto do admin
        aulas: adminModule.contents.map((content, index) => ({
          numero: index + 1,
          titulo: content.title,
          descricao: content.description,
          tempo: content.duration,
          tipo: content.type as "video" | "artigo" | "conteudo" | "multipla" | "interactive",
          url: content.link,
          links: content.links, // Adicionar múltiplos links
          opcoes:
            content.type === "interactive"
              ? [{ titulo: content.title, descricao: content.description, url: content.link }]
              : undefined,
        })),
        recursos: [],
      }))
      .concat([
        {
          id: 8,
          titulo: "Encerramento e certificação",
          descricao: "Certificação de conclusão do treinamento",
          isDesbloqueado: true,
          aulas: [],
          recursos: [],
        },
      ])
  }, [adminModules, refreshTrigger])

  const moduloAtualData = useMemo(() => {
    const modulo = modulosData.find((m) => m.id === moduloAtual)
    return (
      modulo || {
        id: 0,
        titulo: "Módulo não encontrado",
        descricao: "Módulo não encontrado",
        isDesbloqueado: false,
        aulas: [],
        recursos: [],
      }
    )
  }, [moduloAtual, modulosData])

  const podeIrAnterior = moduloAtual > 1
  const podeIrProximo = moduloAtual < modulosData.length

  const handleModuloAnterior = () => {
    if (podeIrAnterior) {
      handleModuloChange(moduloAtual - 1)
    }
  }

  const handleProximoModulo = () => {
    if (podeIrProximo) {
      handleModuloChange(moduloAtual + 1)
    }
  }

  const getActionButton = () => {
    if (moduloAtual === 8) {
      return null
    }

    if (podeIrProximo) {
      return (
        <Button
          className="bg-blue-400 hover:bg-blue-500 flex items-center space-x-2"
          onClick={handleProximoModulo}
          disabled={isTransitioning}
        >
          <span>Próximo módulo</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )
    }

    return null
  }

  const progressoAtual = calcularProgressoModulo(moduloAtual)

  // Verifica se o módulo está desbloqueado com base no plano do usuário
  const isModuleUnlocked = useMemo(() => {
    if (moduloAtualData.id === 8) return true // Módulo de certificação sempre desbloqueado
    return moduloAtualData.isDesbloqueado // Usar apenas o controle do admin
  }, [moduloAtualData])

  // Layout especial para o módulo de certificação
  if (moduloAtual === 8) {
    return (
      <section id="progresso-modulo" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Módulo {moduloAtualData.id}: {moduloAtualData.titulo}
              </h2>
              <p className="text-lg text-gray-600">{moduloAtualData.descricao}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conquistas e Reconhecimento */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Conquistas e reconhecimento</h3>
                  <CertificadoDigital
                    jsPDFModule={jsPDFModule}
                    isLoaded={isLoaded}
                    isLoading={isLoading}
                    error={error}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Apenas Precisa de Ajuda */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Precisa de ajuda?</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Headphones className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-gray-700">Falar com suporte</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-gray-700">FAQ do módulo</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent"
              onClick={handleModuloAnterior}
              disabled={!podeIrAnterior}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Módulo anterior</span>
            </Button>

            {certificadoGerado && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Jornada finalizada!</span>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Layout padrão para outros módulos
  return (
    <section id="progresso-modulo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Módulo {moduloAtualData.id}: {moduloAtualData.titulo}
            </h2>
            <p className="text-lg text-gray-600">{moduloAtualData.descricao}</p>
          </div>
        </div>

        {/* Mensagem de módulo bloqueado */}
        {!isModuleUnlocked && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <HelpCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Módulo bloqueado</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Este módulo está bloqueado. Desbloqueie acessando um plano superior.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo do Módulo */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Conteúdo do módulo</h3>
                {isModuleUnlocked ? (
                  renderizarTodasAtividades(moduloAtualData.aulas, moduloAtual)
                ) : (
                  <p className="text-gray-500">Adquira um plano superior para desbloquear o conteúdo deste módulo.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Precisa de Ajuda */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Precisa de ajuda?</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-gray-700">Falar com suporte</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <HelpCircle className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-gray-700">FAQ do módulo</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent"
            onClick={handleModuloAnterior}
            disabled={!podeIrAnterior}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Módulo anterior</span>
          </Button>

          {getActionButton()}
        </div>
      </div>
    </section>
  )
}
