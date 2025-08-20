"use client"

import { useState, Suspense, lazy, useEffect } from "react"
import Header from "./components/header"
import Hero from "./components/hero"
import { ProgressProvider } from "./contexts/progress-context"
import { useAdmin } from "./contexts/admin-context"
import PermissionGuard from "./components/permission-guard"
import RealTimeIndicator from "./components/admin/real-time-indicator"

// Code Splitting - Lazy loading dos componentes não críticos
const Modulos = lazy(() => import("./components/modulos"))
const ProgressoModulo = lazy(() => import("./components/progresso-modulo"))
const RecursosAdicionais = lazy(() => import("./components/recursos-adicionais"))
const ProgressoReconhecimento = lazy(() => import("./components/progresso-reconhecimento"))
const FAQ = lazy(() => import("./components/faq"))
const CTAFinal = lazy(() => import("./components/cta-final"))
const Footer = lazy(() => import("./components/footer"))
const RealTimeModuleIndicator = lazy(() => import("./components/admin/real-time-module-indicator"))

// Loading component para Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59B4E3]"></div>
  </div>
)

// Loading component mais específico para seções
const SectionLoader = ({ height = "py-16" }: { height?: string }) => (
  <div className={`flex items-center justify-center ${height} bg-gray-50`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#59B4E3] mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Carregando...</p>
    </div>
  </div>
)

function HomeContent() {
  const [moduloSelecionado, setModuloSelecionado] = useState<number | undefined>(undefined)
  const { currentUser, hasPermission, refreshTrigger } = useAdmin()

  const handleModuloSelect = (moduloId: number) => {
    setModuloSelecionado(moduloId)
  }

  // Escutar mudanças administrativas através do refreshTrigger
  useEffect(() => {
    console.log("🏠 Página inicial detectou mudança administrativa:", refreshTrigger)
  }, [refreshTrigger])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Componentes críticos carregados imediatamente */}
        <Hero />

        {/* Componentes não críticos com lazy loading e controle de permissão */}
        <PermissionGuard permission="content.view">
          <Suspense fallback={<SectionLoader />}>
            <Modulos key={`modulos-${refreshTrigger}`} onModuloSelect={handleModuloSelect} />
          </Suspense>
        </PermissionGuard>

        <PermissionGuard permission="content.view">
          <Suspense fallback={<SectionLoader />}>
            <ProgressoModulo key={`progresso-${refreshTrigger}`} moduloSelecionado={moduloSelecionado} />
          </Suspense>
        </PermissionGuard>

        <Suspense fallback={<SectionLoader />}>
          <RecursosAdicionais />
        </Suspense>

        <PermissionGuard permission="reports.view">
          <Suspense fallback={<SectionLoader />}>
            <ProgressoReconhecimento />
          </Suspense>
        </PermissionGuard>

        <Suspense fallback={<SectionLoader />}>
          <FAQ />
        </Suspense>

        <PermissionGuard permission="content.view">
          <Suspense fallback={<SectionLoader />}>
            <CTAFinal />
          </Suspense>
        </PermissionGuard>
      </main>

      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>

      {/* Indicador em tempo real - apenas para usuários logados */}
      {currentUser && <RealTimeIndicator />}
      {currentUser && (
        <Suspense fallback={null}>
          <RealTimeModuleIndicator />
        </Suspense>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <ProgressProvider>
      <HomeContent />
    </ProgressProvider>
  )
}
