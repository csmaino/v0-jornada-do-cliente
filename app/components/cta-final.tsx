"use client"

import { Button } from "@/components/ui/button"

export default function CTAFinal() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Comece agora sua jornada de implantação!</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Estamos aqui para ajudá-lo a implementar o sistema Mainô com sucesso em sua empresa. Aproveite todos os
          recursos disponíveis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            className="bg-[#2A7221] hover:bg-[#236219] text-white px-8 py-3 text-lg font-medium"
            onClick={() => window.open("https://ajuda.maino.com.br/pt-BR/", "_blank")}
          >
            Acesse a Central de Ajuda
          </Button>
          <Button className="bg-[#033860] hover:bg-[#022b4b] text-white px-8 py-3 text-lg font-medium">
            Falar com seu implantador
          </Button>
        </div>
      </div>
    </section>
  )
}
