import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Zap, Shield, Users, Code, Palette } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Design Responsivo",
    description: "Sites que funcionam perfeitamente em todos os dispositivos, desde smartphones até desktops.",
  },
  {
    icon: Zap,
    title: "Performance Otimizada",
    description: "Carregamento rápido e experiência fluida para manter seus usuários engajados.",
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Proteção robusta contra ameaças digitais e conformidade com padrões de segurança.",
  },
  {
    icon: Users,
    title: "UX/UI Intuitiva",
    description: "Interfaces pensadas para proporcionar a melhor experiência ao usuário.",
  },
  {
    icon: Code,
    title: "Código Limpo",
    description: "Desenvolvimento com as melhores práticas e tecnologias mais modernas do mercado.",
  },
  {
    icon: Palette,
    title: "Design Personalizado",
    description: "Criação visual única que reflete a identidade e os valores da sua marca.",
  },
]

export default function Features() {
  return (
    <section id="recursos" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Por que nos escolher?</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos soluções completas e personalizadas para atender às necessidades específicas do seu negócio.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
