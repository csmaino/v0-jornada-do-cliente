"use client"

import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-[#033860] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1">
            <div className="mb-4">
              <Image src="/logo-maino-branco.png" alt="Mainô" width={120} height={40} className="h-8 w-auto" />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">Sistema especializado em importação é Mainô.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Produtos - NOMES ATUALIZADOS */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Produtos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Mainô Flex
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Mainô Xpert
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Mainô ERP
                </a>
              </li>
            </ul>
          </div>

          {/* Suporte - FAQ REMOVIDO */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Suporte</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => window.open("https://ajuda.maino.com.br/pt-BR/", "_blank")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Central de ajuda
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Suporte técnico
                </a>
              </li>
              <li>
                <button
                  onClick={() => window.open("https://changelog.maino.com.br/", "_blank")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Atualizações
                </button>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Av. Oscar Niemeyer, 2000, BLC 1 SAL 401 - Coworking Aqwa - Santo Cristo, Rio de Janeiro - RJ
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a
                  href="https://api.whatsapp.com/message/OEM3ZM56VHVBO1?autoload=1&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  (21) 2224-5777
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">cs@maino.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Seg-Sex: 9h às 18h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Mainô Sistemas. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos de uso
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de privacidade
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
