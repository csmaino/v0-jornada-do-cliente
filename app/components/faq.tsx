"use client"

import { useState, memo, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface PerguntaProps {
  pergunta: string
  resposta: string
  isOpen: boolean
  onToggle: () => void
}

// Memoização do componente PerguntaItem
const PerguntaItem = memo(({ pergunta, resposta, isOpen, onToggle }: PerguntaProps) => {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-800 pr-4">{pergunta}</span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
        </button>
        {isOpen && (
          <div className="px-6 pb-6">
            <p className="text-gray-600 leading-relaxed">{resposta}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

PerguntaItem.displayName = "PerguntaItem"

const FAQ = memo(() => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // useCallback para otimizar a função de toggle
  const handleToggle = useCallback(
    (index: number) => {
      setOpenIndex(openIndex === index ? null : index)
    },
    [openIndex],
  )

  // useMemo para otimizar a lista de perguntas
  const perguntas = useMemo(
    () => [
      {
        pergunta: "Quanto tempo leva para concluir todo o treinamento?",
        resposta:
          "O tempo total estimado para concluir todos os módulos é de aproximadamente 8 horas, distribuídas em um ritmo que pode ser ajustado conforme sua disponibilidade e necessidades específicas. Para prosseguir com as horas de consultorias junto ao seu gerente de implantação, é importante verificar o período disponível de acordo com a implantação contratada.",
      },
      {
        pergunta: "Posso pular algum módulo se já tiver conhecimento prévio?",
        resposta:
          'Embora recomendemos seguir a sequência completa para garantir uma implantação bem-sucedida, você pode revisar rapidamente módulos que já domina. No entanto, o módulo de "Boas-vindas e Visão Geral" é pré-requisito para o acesso aos demais.',
      },
      {
        pergunta: "O que acontece se eu não concluir o treinamento no prazo estipulado?",
        resposta:
          "Não há problema! O treinamento fica disponível por tempo ilimitado. Você pode retomar de onde parou a qualquer momento. Nossa equipe de suporte também está disponível para esclarecer dúvidas sobre o sistema.",
      },
      {
        pergunta: "Como posso obter ajuda adicional durante o processo de implantação?",
        resposta:
          "Oferecemos múltiplos canais de suporte: chat online, e-mail, WhatsApp (21) 2224-5777 - apenas mensagens, sessões de consultoria personalizada e uma central de ajuda completa com tutoriais e artigos detalhados sobre o sistema.",
      },
      {
        pergunta: "O certificado de conclusão tem algum valor oficial?",
        resposta:
          "Sim! O certificado de especialista Mainô é reconhecido oficialmente e comprova sua capacitação no uso do sistema. Pode ser usado para demonstrar competência técnica em processos seletivos e avaliações profissionais.",
      },
    ],
    [],
  )

  // useMemo para otimizar a renderização das perguntas
  const perguntasRenderizadas = useMemo(() => {
    return perguntas.map((item, index) => (
      <PerguntaItem
        key={index}
        pergunta={item.pergunta}
        resposta={item.resposta}
        isOpen={openIndex === index}
        onToggle={() => handleToggle(index)}
      />
    ))
  }, [perguntas, openIndex, handleToggle])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Perguntas Frequentes</h2>
          <p className="text-lg text-gray-600">Respostas para as dúvidas mais comuns sobre o processo de implantação</p>
        </div>

        <div className="space-y-4">{perguntasRenderizadas}</div>
      </div>
    </section>
  )
})

FAQ.displayName = "FAQ"

export default FAQ
