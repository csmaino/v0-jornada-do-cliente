import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

const benefits = [
  "Mais de 5 anos de experiência no mercado",
  "Equipe especializada em tecnologias modernas",
  "Suporte técnico 24/7 para todos os clientes",
  "Garantia de qualidade em todos os projetos",
  "Metodologia ágil para entregas rápidas",
  "Preços competitivos e transparentes",
]

export default function About() {
  return (
    <section id="sobre" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Nossa equipe trabalhando"
              width={600}
              height={500}
              className="w-full h-auto rounded-2xl shadow-xl"
            />
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5+</div>
                <div className="text-sm text-gray-600">Anos de experiência</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Sobre nossa empresa</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Somos uma empresa especializada em desenvolvimento web e soluções digitais. Nossa missão é transformar
              ideias em produtos digitais excepcionais que geram resultados reais para nossos clientes.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="text-lg px-8 py-3">
              Conheça Nossa História
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
