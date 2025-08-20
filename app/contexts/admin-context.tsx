"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { sql, isDatabaseAvailable } from "../lib/database"
import type { DatabaseModule, DatabasePermission } from "../lib/database"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user" | "viewer"
  status: "active" | "inactive" | "pending"
  lastLogin?: Date
  createdAt: Date
  permissions: Permission[]
  department: string[]
  stakeholders: string[]
  empresa: string
  grupo: string
  cnpj: string
  cargo: string
  plan?: string
  avatar?: string
}

export interface Permission {
  id: string
  name: string
  description: string
  category: "system" | "content" | "users" | "reports" | "settings"
}

export interface ContentLink {
  id: string
  title: string
  url: string
  description?: string
}

export interface ModuleContent {
  id: string
  title: string
  description: string
  link: string
  links?: ContentLink[]
  type: "video" | "document" | "quiz" | "interactive"
  duration: number
  isActive: boolean
  plans: string[]
}

export interface Module {
  id: string
  name: string
  description: string
  icon: string
  isActive: boolean
  contents: ModuleContent[]
  plans: string[]
}

interface AdminContextType {
  currentUser: User | null
  users: User[]
  permissions: Permission[]
  modules: Module[]
  availableCargos: string[]
  availableDepartments: string[]
  availableStakeholders: string[]
  availablePlans: string[]
  isAdmin: boolean
  isManager: boolean
  hasPermission: (permissionId: string) => boolean
  addUser: (user: Omit<User, "id" | "createdAt">) => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  updateUserPermissions: (userId: string, permissions: Permission[]) => Promise<void>
  addCargo: (cargo: string) => void
  updateModule: (moduleId: string, updates: Partial<Module>) => Promise<void>
  addModuleContent: (moduleId: string, content: Omit<ModuleContent, "id">) => Promise<void>
  updateModuleContent: (moduleId: string, contentId: string, updates: Partial<ModuleContent>) => Promise<void>
  deleteModuleContent: (moduleId: string, contentId: string) => Promise<void>
  exportUsersToExcel: () => void
  exportModulesToExcel: () => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshUserData: () => Promise<void>
  lastUpdate: Date
  isOnline: boolean
  forceRefresh: () => void
  refreshTrigger: number
  isLoading: boolean
  error: string | null
  isDatabaseMode: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

// Permissões disponíveis no sistema
const availablePermissions: Permission[] = [
  {
    id: "users.view",
    name: "Visualizar Usuários",
    description: "Pode visualizar lista de usuários",
    category: "users",
  },
  {
    id: "users.create",
    name: "Criar Usuários",
    description: "Pode criar novos usuários",
    category: "users",
  },
  {
    id: "users.edit",
    name: "Editar Usuários",
    description: "Pode editar informações de usuários",
    category: "users",
  },
  {
    id: "users.delete",
    name: "Excluir Usuários",
    description: "Pode excluir usuários do sistema",
    category: "users",
  },
  {
    id: "content.view",
    name: "Visualizar Conteúdo",
    description: "Pode visualizar todo o conteúdo",
    category: "content",
  },
  {
    id: "content.edit",
    name: "Editar Conteúdo",
    description: "Pode editar conteúdo do sistema",
    category: "content",
  },
  {
    id: "reports.view",
    name: "Visualizar Relatórios",
    description: "Pode acessar relatórios do sistema",
    category: "reports",
  },
  {
    id: "reports.export",
    name: "Exportar Relatórios",
    description: "Pode exportar relatórios",
    category: "reports",
  },
  {
    id: "settings.view",
    name: "Visualizar Configurações",
    description: "Pode visualizar configurações do sistema",
    category: "settings",
  },
  {
    id: "settings.edit",
    name: "Editar Configurações",
    description: "Pode modificar configurações do sistema",
    category: "settings",
  },
  {
    id: "system.admin",
    name: "Administração Total",
    description: "Acesso completo ao sistema",
    category: "system",
  },
]

// Dados iniciais
const initialCargos = [
  "Administrador",
  "Estagiário",
  "Assistente",
  "Analista",
  "Gerente ou Coordenador",
  "Diretor",
  "Sócio ou Proprietário",
  "Supervisor",
  "Outros",
]

const initialDepartments = ["Financeiro", "Fiscal", "Compras", "Comercial", "Estoque", "Contábil", "Controle", "Outros"]

const initialStakeholders = [
  "Responsável legal",
  "Sócio",
  "Influenciador/Parceiro",
  "Decisor econômico",
  "Decisor técnico",
  "Operador",
  "Representante financeiro",
  "Responsável pela implantação",
]

const initialPlans = ["Mainô Flex", "Mainô Xpert", "Mainô ERP"]

// MÓDULOS COM MÚLTIPLOS LINKS IMPLEMENTADOS (fallback para modo offline)
const initialModules: Module[] = [
  {
    id: "1",
    name: "Boas-vindas e Visão Geral",
    description: "Introdução ao sistema Mainô",
    icon: "BookOpen",
    isActive: true,
    plans: ["Mainô Xpert", "Mainô Flex", "Mainô ERP"],
    contents: [
      {
        id: "1-1",
        title: "Conheça o Mainô ERP",
        description: "Visão geral do sistema e suas funcionalidades principais",
        link: "https://youtu.be/_sHY9Y74pe4?feature=shared",
        type: "video",
        duration: 3,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô Flex", "Mainô ERP"],
      },
      {
        id: "1-2",
        title: "Finalize o cadastro da empresa",
        description: "Como finalizar o cadastro da sua empresa no sistema",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3609075-completando-o-cadastro-da-sua-empresa",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô Flex", "Mainô ERP"],
      },
      {
        id: "1-3",
        title: "Cadastre o certificado digital A1 ou A3",
        description: "Configuração do certificado digital para emissão de notas",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156936-como-cadastrar-ou-atualizar-o-certificado-digital-a1",
        links: [
          {
            id: "1-3-1",
            title: "Certificado A1",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3156936-como-cadastrar-ou-atualizar-o-certificado-digital-a1",
            description: "Como cadastrar certificado digital A1",
          },
          {
            id: "1-3-2",
            title: "Certificado A3",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3156937-como-cadastrar-meu-certificado-a3-na-maino",
            description: "Como cadastrar certificado digital A3",
          },
        ],
        type: "interactive",
        duration: 7,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "1-4",
        title: "Cadastre o seu certificado e-CPF",
        description: "Configuração do e-CPF para operações fiscais",
        link: "https://ajuda.maino.com.br/pt-BR/articles/9708009-como-cadastrar-o-certificado-digital-e-cpf",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "1-5",
        title: "Cadastre o seu despachante",
        description: "Como cadastrar despachante para operações de comércio exterior",
        link: "https://ajuda.maino.com.br/pt-BR/articles/11030391-como-cadastrar-um-despachante-aduaneiro",
        type: "document",
        duration: 3,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "1-6",
        title: "Cadastre o seu contador",
        description: "Como cadastrar contador responsável pela empresa",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156941-como-cadastrar-meu-contador-no-sistema",
        type: "document",
        duration: 3,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "1-7",
        title: "Aprenda como cadastrar um representante de vendas",
        description: "Como cadastrar representantes de vendas no sistema",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3850038-como-cadastrar-um-usuario-com-a-funcao-representante",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "1-8",
        title: "Cadastre novos usuários",
        description: "Gerenciamento de usuários e permissões do sistema",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156868-como-criar-um-novo-usuario",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô Flex", "Mainô Xpert", "Mainô ERP"],
      },
    ],
  },
  {
    id: "2",
    name: "Configurações do sistema",
    description: "Utilize as configurações do sistema ao seu favor",
    icon: "Settings",
    isActive: true,
    plans: ["Mainô Xpert", "Mainô ERP"],
    contents: [],
  },
  {
    id: "3",
    name: "Gestão de estoque",
    description: "Gestão de estoque, entrada de produtos e processos de compra",
    icon: "Package",
    isActive: true,
    plans: ["Mainô ERP"],
    contents: [
      {
        id: "3-1",
        title: "Cadastre seus produtos no estoque",
        description:
          "Você pode realizar o cadastro manualmente ou de forma automática com uma NF-e de entrada (importação ou de terceiros)",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156831-como-cadastrar-um-produto-manualmente-no-estoque",
        links: [
          {
            id: "3-1-1",
            title: "Cadastro de produto manual",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3156831-como-cadastrar-um-produto-manualmente-no-estoque",
            description: "Como cadastrar produtos manualmente",
          },
          {
            id: "3-1-2",
            title: "Cadastro de produto por NF-e de terceiros",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3156834-como-cadastrar-produtos-no-meu-estoque-atraves-de-uma-nf-e-de-terceiros-fornecedor",
            description: "Como cadastrar produtos através de NF-e de terceiros",
          },
        ],
        type: "interactive",
        duration: 8,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "3-2",
        title: "Defina Categorias e Subcategorias para seus produtos",
        description: "Organização eficiente de produtos por categorias",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156887-como-definir-categorias-e-subcategorias-no-sistema",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "3-3",
        title: "Realize cotações no fluxo de compra",
        description: "Processo completo de cotações e compras",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156816-fluxo-de-compra-o-que-e-e-como-utilizar",
        type: "document",
        duration: 6,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "3-4",
        title: "Aprenda como calcular o pré-custo para sua importação",
        description: "Cálculo preciso de custos de importação",
        link: "https://ajuda.maino.com.br/pt-BR/articles/11125570-como-utilizar-a-calculadora-de-pre-custo",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "3-5",
        title: "Aprenda como atualizar o preço de venda em massa",
        description: "Atualização em lote de preços de venda",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156962-como-definir-os-precos-de-venda-dos-meus-produtos-no-estoque",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "3-6",
        title: "Aprenda a retornar produtos armazenados para o estoque",
        description: "Processo de devolução e retorno de produtos",
        link: "https://ajuda.maino.com.br/pt-BR/articles/8456419-como-retornar-os-produtos-para-o-estoque-por-meio-da-nf-e-emitida-pelo-armazem",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "3-7",
        title: "Relatórios - Produtos armazenados",
        description: "Como verificar seus produtos armazenados",
        link: "https://ajuda.maino.com.br/pt-BR/articles/9596340-como-verificar-meus-produtos-armazenados",
        type: "document",
        duration: 3,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "3-8",
        title: "Relatórios - Inventário",
        description: "Como extrair um relatório de inventário de estoque",
        link: "https://ajuda.maino.com.br/pt-BR/articles/5481662-como-extrair-um-relatorio-de-inventario-de-estoque",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "3-9",
        title: "Relatórios - Movimentações de produtos",
        description: "Como gerar um relatório de movimentações de estoque",
        link: "https://ajuda.maino.com.br/pt-BR/articles/5353995-como-gerar-um-relatorio-de-movimentacoes-de-estoque",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô ERP"],
      },
    ],
  },
  {
    id: "4",
    name: "COMEX",
    description: "Gestão de processos e emissão de NF-e de importação e exportação",
    icon: "Globe",
    isActive: true,
    plans: ["Mainô ERP"],
    contents: [
      {
        id: "4-1",
        title: "Emita sua primeira NF-e de importação através da DI ou DUIMP",
        description: "Processo completo de emissão de NF-e de importação",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156881-como-emitir-uma-nf-e-de-entrada-de-importacao-a-partir-do-xml-di",
        links: [
          {
            id: "4-1-1",
            title: "Por DI",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3156881-como-emitir-uma-nf-e-de-entrada-de-importacao-a-partir-do-xml-di",
            description: "Como emitir NF-e através da DI",
          },
          {
            id: "4-1-2",
            title: "Por DUIMP",
            url: "https://ajuda.maino.com.br/pt-BR/articles/9922907-como-utilizar-a-duimp-pelo-maino",
            description: "Como utilizar a DUIMP pelo Mainô",
          },
        ],
        type: "interactive",
        duration: 8,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "4-2",
        title: "Cadastre seu primeiro processo de importação",
        description: "Como cadastrar e gerenciar processos de importação",
        link: "https://ajuda.maino.com.br/pt-BR/articles/4343266-como-cadastrar-um-processo",
        type: "document",
        duration: 6,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "4-3",
        title: "Realize um envio de produto a partir do Catálogo de produtos",
        description: "Utilização do catálogo para envios internacionais",
        link: "https://ajuda.maino.com.br/pt-BR/articles/9903512-catalogo-de-produtos-como-utilizar",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "4-4",
        title: "Finalize sua primeira NFe de exportação",
        description: "Processo completo de exportação e emissão de NF-e",
        link: "https://ajuda.maino.com.br/pt-BR/articles/4730179-fluxo-de-exportacao-como-emitir-uma-nf-e-de-exportacao",
        type: "document",
        duration: 7,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "4-5",
        title: "Exportação - Cadastre a unidade tritutável de exportação",
        description: "Configuração de unidades tributáveis para operações",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156897-como-cadastrar-a-unidade-tributavel-de-exportacao-no-produto",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "4-6",
        title: "Acompanhe sua operação através no Monitoramento de Cargas",
        description: "Como monitorar cargas e acompanhar entregas",
        link: "https://ajuda.maino.com.br/pt-BR/articles/7042816-como-funciona-o-monitoramento-de-cargas",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô ERP"],
      },
    ],
  },
  {
    id: "5",
    name: "Negócios e Vendas",
    description: "Fluxo de venda e emissão de NF-e de saída",
    icon: "ShoppingCart",
    isActive: true,
    plans: ["Mainô Xpert", "Mainô ERP"],
    contents: [
      {
        id: "5-1",
        title: "Emita sua primeira NF-e de venda no Mainô",
        description: "Processo completo de emissão de NF-e de venda",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3609157-como-fazer-uma-venda",
        type: "document",
        duration: 7,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "5-2",
        title: "Cadastre uma condição de pagamento para sua venda",
        description: "Configuração de formas e condições de pagamento",
        link: "https://ajuda.maino.com.br/pt-BR/articles/4754810-condicao-de-pagamento",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "5-3",
        title: "Crie uma tabela de vendas",
        description: "Criação e gerenciamento de tabelas de preço",
        link: "https://ajuda.maino.com.br/pt-BR/articles/4830789-como-cadastrar-uma-tabela-de-vendas",
        links: [
          {
            id: "5-3-1",
            title: "Tabela variável",
            url: "https://ajuda.maino.com.br/pt-BR/articles/4830789-como-cadastrar-uma-tabela-de-vendas",
            description: "Como cadastrar uma tabela de vendas variável",
          },
          {
            id: "5-3-2",
            title: "Tabela fixa",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3156830-como-cadastrar-uma-tabela-fixa-de-vendas",
            description: "Como cadastrar uma tabela fixa de vendas",
          },
        ],
        type: "interactive",
        duration: 7,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "5-4",
        title: "Relatório de vendas",
        description: "Relatórios essenciais para análise de vendas",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156851-como-gerar-um-relatorio-de-clientes-e-produtos-mais-vendidos",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
    ],
  },
  {
    id: "6",
    name: "Gestão financeira",
    description: "Gestão financeira, contas a pagar e receber, fluxo de caixa",
    icon: "DollarSign",
    isActive: true,
    plans: ["Mainô Xpert", "Mainô ERP"],
    contents: [
      {
        id: "6-1",
        title: "Cadastre sua primeira conta a receber",
        description: "Gerenciamento completo de contas a receber",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156956-conhecendo-a-tela-de-recebimentos",
        type: "document",
        duration: 6,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "6-2",
        title: "Cadastre sua primeira conta a pagar",
        description: "Gerenciamento completo de contas a pagar",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156957-conhecendo-a-tela-de-pagamentos",
        type: "document",
        duration: 6,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "6-3",
        title: "Realize sua primeira conciliação bancária no Mainô",
        description: "Processo completo de conciliação bancária",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156877-conciliacao-bancaria-o-que-e-e-como-utilizar",
        type: "document",
        duration: 7,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "6-4",
        title: "Configure sua Régua de Cobrança",
        description: "Configuração de cobrança automática e réguas",
        link: "https://ajuda.maino.com.br/pt-BR/articles/5315235-regua-de-cobranca-como-configurar-e-utilizar",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "6-5",
        title: "Habilite sua conta para emissão de boletos",
        description: "Aprenda como gerar arquivo Remessa e importar o arquivo Retorno para baixar seus recebimentos",
        link: "https://ajuda.maino.com.br/pt-BR/articles/5325271-remessa-e-retorno-o-que-e-e-como-utilizar",
        type: "document",
        duration: 8,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "6-6",
        title: "Relatórios - Fluxo de caixa",
        description: "Como emitir relatório de fluxo de caixa",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156849-como-emitir-relatorio-de-fluxo-de-caixa",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "6-7",
        title: "Relatórios - Relatório financeiro",
        description: "Conhecendo o relatório financeiro",
        link: "https://ajuda.maino.com.br/pt-BR/articles/5386127-conhecendo-o-relatorio-financeiro",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô Xpert", "Mainô ERP"],
      },
      {
        id: "6-8",
        title: "Relatórios - DRE",
        description: "DRE - o que é e como configurar",
        link: "https://ajuda.maino.com.br/pt-BR/articles/5415437-dre-o-que-e-e-como-configurar",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô ERP"],
      },
    ],
  },
  {
    id: "7",
    name: "Gestão fiscal",
    description: "Parametrizações e cadastros fiscais essenciais",
    icon: "FileText",
    isActive: true,
    plans: ["Mainô ERP"],
    contents: [
      {
        id: "7-1",
        title: "Cadastre seus benefícios fiscais",
        description: "Configuração de benefícios fiscais disponíveis",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156837-o-que-e-beneficio-fiscal-e-como-informar-na-nf-e",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "7-2",
        title: "Parametrize suas operações especiais",
        description: "Configuração de operações fiscais especiais",
        link: "https://ajuda.maino.com.br/pt-BR/articles/4273387-como-criar-parametrizacoes-por-operacao",
        type: "document",
        duration: 6,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "7-3",
        title: "Parametrize seu primeiro NCM para operações de venda",
        description: "Configuração de NCM para operações de venda",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156870-como-parametrizar-os-tributos-por-ncm-manualmente",
        type: "document",
        duration: 7,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "7-4",
        title: "Aprenda a gerar seu arquivo SPED",
        description: "Geração e configuração de arquivos SPED",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156879-como-gerar-um-arquivo-sped",
        type: "document",
        duration: 5,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "7-5",
        title: "Aprenda a escriturar seus CT-e",
        description: "Escrituração de Conhecimento de Transporte Eletrônico",
        link: "https://ajuda.maino.com.br/pt-BR/articles/6604196-como-fazer-a-escrituracao-de-ct-e",
        type: "document",
        duration: 4,
        isActive: true,
        plans: ["Mainô ERP"],
      },
      {
        id: "7-6",
        title: "Aprenda a gerar NF-e de devolução, armazenagem ou simples remessa",
        description: "Emissão de NF-e para operações especiais",
        link: "https://ajuda.maino.com.br/pt-BR/articles/3156840-como-fazer-uma-nf-e-de-devolucao",
        links: [
          {
            id: "7-6-1",
            title: "NF-e de devolução",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3156840-como-fazer-uma-nf-e-de-devolucao",
            description: "Como fazer uma NF-e de devolução",
          },
          {
            id: "7-6-2",
            title: "NF-e de armazenagem",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3157012-como-criar-uma-nf-e-de-armazenagem",
            description: "Como criar uma NF-e de armazenagem",
          },
          {
            id: "7-6-3",
            title: "NF-e de simples remessa",
            url: "https://ajuda.maino.com.br/pt-BR/articles/3156908-como-fazer-uma-nf-e-de-simples-remessa",
            description: "Como fazer uma NF-e de simples remessa",
          },
        ],
        type: "interactive",
        duration: 8,
        isActive: true,
        plans: ["Mainô ERP"],
      },
    ],
  },
]

// Usuários mock atualizados
const mockUsers: User[] = [
  {
    id: "1",
    name: "Rafael Moreira",
    email: "rafael@maino.com.br",
    role: "admin",
    status: "active",
    lastLogin: new Date(),
    createdAt: new Date("2024-01-15"),
    department: ["Financeiro", "Controle"],
    permissions: availablePermissions,
    avatar: "RM",
    stakeholders: ["Responsável legal", "Decisor técnico"],
    empresa: "Mainô Tecnologia Ltda",
    grupo: "Grupo Mainô",
    cnpj: "12.345.678/0001-90",
    cargo: "Diretor",
    plan: "Mainô ERP",
  },
  {
    id: "2",
    name: "Ana Silva",
    email: "ana.silva@maino.com.br",
    role: "manager",
    status: "active",
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date("2024-02-01"),
    department: ["Comercial"],
    permissions: availablePermissions.filter((p) => p.category !== "system"),
    stakeholders: ["Decisor econômico"],
    empresa: "Mainô Tecnologia Ltda",
    grupo: "Grupo Mainô",
    cnpj: "12.345.678/0001-90",
    cargo: "Gerente ou Coordenador",
    plan: "Mainô Xpert",
  },
  {
    id: "3",
    name: "João Santos",
    email: "joao.santos@maino.com.br",
    role: "user",
    status: "active",
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-02-10"),
    department: ["Estoque", "Compras"],
    permissions: availablePermissions.filter((p) => p.category === "content" || p.category === "reports"),
    stakeholders: ["Operador"],
    empresa: "Empresa Cliente ABC",
    grupo: "Grupo ABC",
    cnpj: "98.765.432/0001-10",
    cargo: "Analista",
    plan: "Mainô Flex",
  },
]

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<Permission[]>(availablePermissions)
  const [modules, setModules] = useState<Module[]>([])
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDatabaseMode, setIsDatabaseMode] = useState(false)

  const isAdmin = currentUser?.role === "admin"
  const isManager = currentUser?.role === "manager" || isAdmin

  // Verificar se o banco está disponível na inicialização
  useEffect(() => {
    const checkDatabaseMode = async () => {
      const dbAvailable = isDatabaseAvailable()
      setIsDatabaseMode(dbAvailable)

      if (dbAvailable) {
        console.log("🗄️ Modo banco de dados ativado")
        await loadAllData()
      } else {
        console.log("💾 Modo offline ativado - usando dados locais")
        await loadOfflineData()
      }
    }

    checkDatabaseMode()
  }, [])

  // Função para carregar dados offline (localStorage/mock)
  const loadOfflineData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Carregar dados do localStorage se existirem
      if (typeof window !== "undefined") {
        const savedUsers = localStorage.getItem("admin_users")
        const savedModules = localStorage.getItem("admin_modules")

        if (savedUsers) {
          try {
            const parsedUsers = JSON.parse(savedUsers).map((user: any) => ({
              ...user,
              lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
              createdAt: new Date(user.createdAt),
            }))
            setUsers(parsedUsers)
          } catch (error) {
            console.error("Erro ao carregar usuários salvos:", error)
            setUsers(mockUsers)
          }
        } else {
          setUsers(mockUsers)
        }

        if (savedModules) {
          try {
            const parsedModules = JSON.parse(savedModules)
            setModules(parsedModules)
          } catch (error) {
            console.error("Erro ao carregar módulos salvos:", error)
            setModules(initialModules)
          }
        } else {
          setModules(initialModules)
        }
      } else {
        setUsers(mockUsers)
        setModules(initialModules)
      }

      setCurrentUser(mockUsers[0]) // Definir usuário padrão
      console.log("✅ Dados offline carregados com sucesso")
    } catch (error) {
      console.error("❌ Erro ao carregar dados offline:", error)
      setError("Erro ao carregar dados offline")
      setUsers(mockUsers)
      setModules(initialModules)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para forçar refresh
  const forceRefresh = useCallback(() => {
    const newTrigger = Date.now()
    setRefreshTrigger(newTrigger)
    setLastUpdate(new Date())

    // Salvar no localStorage se estiver em modo offline
    if (!isDatabaseMode && typeof window !== "undefined") {
      localStorage.setItem("admin_modules", JSON.stringify(modules))
      localStorage.setItem("admin_users", JSON.stringify(users))
      localStorage.setItem("admin_refresh_trigger", newTrigger.toString())
    }

    console.log("🔄 Forçando refresh global dos componentes:", newTrigger)
  }, [modules, users, isDatabaseMode])

  // Funções do banco de dados (só executam se isDatabaseMode for true)
  const loadPermissions = useCallback(async () => {
    if (!isDatabaseMode || !sql) {
      setPermissions(availablePermissions)
      return
    }

    try {
      const result = await sql`
        SELECT id, name, description, category
        FROM permissions
        ORDER BY category, name
      `

      const permissionsData: Permission[] = result.map((row: DatabasePermission) => ({
        id: row.id,
        name: row.name,
        description: row.description || "",
        category: row.category,
      }))

      setPermissions(permissionsData)
      console.log("✅ Permissões carregadas do banco:", permissionsData.length)
    } catch (error) {
      console.error("❌ Erro ao carregar permissões:", error)
      setError("Erro ao carregar permissões")
      setPermissions(availablePermissions) // Fallback
    }
  }, [isDatabaseMode])

  const loadUsers = useCallback(async () => {
    if (!isDatabaseMode || !sql) {
      return // Dados já carregados em loadOfflineData
    }

    try {
      const result = await sql`
        SELECT 
          u.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', p.id,
                'name', p.name,
                'description', p.description,
                'category', p.category
              )
            ) FILTER (WHERE p.id IS NOT NULL),
            '[]'::json
          ) as permissions
        FROM users u
        LEFT JOIN user_permissions up ON u.id = up.user_id
        LEFT JOIN permissions p ON up.permission_id = p.id
        GROUP BY u.id
        ORDER BY u.created_at DESC
      `

      const usersData: User[] = result.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        status: row.status,
        lastLogin: row.last_login ? new Date(row.last_login) : undefined,
        createdAt: new Date(row.created_at),
        permissions: Array.isArray(row.permissions) ? row.permissions : [],
        department: row.department || [],
        stakeholders: row.stakeholders || [],
        empresa: row.empresa || "",
        grupo: row.grupo || "",
        cnpj: row.cnpj || "",
        cargo: row.cargo || "",
        plan: row.plan || "",
        avatar: row.avatar || "",
      }))

      setUsers(usersData)
      if (usersData.length > 0) {
        setCurrentUser(usersData[0]) // Definir primeiro usuário como atual
      }
      console.log("✅ Usuários carregados do banco:", usersData.length)
    } catch (error) {
      console.error("❌ Erro ao carregar usuários:", error)
      setError("Erro ao carregar usuários")
    }
  }, [isDatabaseMode])

  const loadModules = useCallback(async () => {
    if (!isDatabaseMode || !sql) {
      return // Dados já carregados em loadOfflineData
    }

    try {
      // Carregar módulos
      const modulesResult = await sql`
        SELECT * FROM modules
        ORDER BY id
      `

      // Carregar conteúdos com links
      const contentsResult = await sql`
        SELECT 
          mc.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', cl.id,
                'title', cl.title,
                'url', cl.url,
                'description', cl.description
              ) ORDER BY cl.order_index
            ) FILTER (WHERE cl.id IS NOT NULL),
            '[]'::json
          ) as links
        FROM module_contents mc
        LEFT JOIN content_links cl ON mc.id = cl.content_id
        GROUP BY mc.id
        ORDER BY mc.module_id, mc.order_index
      `

      // Organizar dados
      const modulesData: Module[] = modulesResult.map((moduleRow: DatabaseModule) => {
        const moduleContents = contentsResult
          .filter((content: any) => content.module_id === moduleRow.id)
          .map((content: any) => ({
            id: content.id,
            title: content.title,
            description: content.description || "",
            link: content.link || "",
            links: Array.isArray(content.links) ? content.links.filter((link: any) => link.id) : [],
            type: content.type,
            duration: content.duration,
            isActive: content.is_active,
            plans: content.plans || [],
          }))

        return {
          id: moduleRow.id,
          name: moduleRow.name,
          description: moduleRow.description || "",
          icon: moduleRow.icon || "BookOpen",
          isActive: moduleRow.is_active,
          contents: moduleContents,
          plans: moduleRow.plans || [],
        }
      })

      setModules(modulesData)
      console.log("✅ Módulos carregados do banco:", modulesData.length)
    } catch (error) {
      console.error("❌ Erro ao carregar módulos:", error)
      setError("Erro ao carregar módulos")
    }
  }, [isDatabaseMode])

  // Função para carregar todos os dados
  const loadAllData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (isDatabaseMode) {
        await Promise.all([loadPermissions(), loadUsers(), loadModules()])
      } else {
        await loadOfflineData()
      }
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error)
      setError("Erro ao carregar dados do sistema")
    } finally {
      setIsLoading(false)
    }
  }, [isDatabaseMode, loadPermissions, loadUsers, loadModules, loadOfflineData])

  // Implementar funções CRUD que funcionam tanto online quanto offline
  const addUser = useCallback(
    async (userData: Omit<User, "id" | "createdAt">) => {
      try {
        if (isDatabaseMode && sql) {
          // Modo banco de dados
          const result = await sql`
            INSERT INTO users (name, email, role, status, department, stakeholders, empresa, grupo, cnpj, cargo, plan, avatar)
            VALUES (${userData.name}, ${userData.email}, ${userData.role}, ${userData.status}, ${userData.department}, ${userData.stakeholders}, ${userData.empresa}, ${userData.grupo}, ${userData.cnpj}, ${userData.cargo}, ${userData.plan || ""}, ${userData.avatar || ""})
            RETURNING id
          `

          const userId = result[0].id

          // Adicionar permissões
          if (userData.permissions && userData.permissions.length > 0) {
            for (const permission of userData.permissions) {
              await sql`
                INSERT INTO user_permissions (user_id, permission_id)
                VALUES (${userId}, ${permission.id})
              `
            }
          }

          await loadUsers()
        } else {
          // Modo offline
          const newUser: User = {
            ...userData,
            id: Date.now().toString(),
            createdAt: new Date(),
          }
          setUsers((prev) => [...prev, newUser])
        }

        forceRefresh()
        console.log(`✅ Usuário ${userData.name} criado com sucesso!`)
      } catch (error) {
        console.error("❌ Erro ao criar usuário:", error)
        setError("Erro ao criar usuário")
      }
    },
    [isDatabaseMode, loadUsers, forceRefresh],
  )

  const updateUser = useCallback(
    async (id: string, updates: Partial<User>) => {
      try {
        if (isDatabaseMode && sql) {
          // Modo banco de dados
          await sql`
            UPDATE users SET
              name = COALESCE(${updates.name}, name),
              email = COALESCE(${updates.email}, email),
              role = COALESCE(${updates.role}, role),
              status = COALESCE(${updates.status}, status),
              last_login = COALESCE(${updates.lastLogin || null}, last_login),
              department = COALESCE(${updates.department}, department),
              stakeholders = COALESCE(${updates.stakeholders}, stakeholders),
              empresa = COALESCE(${updates.empresa}, empresa),
              grupo = COALESCE(${updates.grupo}, grupo),
              cnpj = COALESCE(${updates.cnpj}, cnpj),
              cargo = COALESCE(${updates.cargo}, cargo),
              plan = COALESCE(${updates.plan}, plan),
              avatar = COALESCE(${updates.avatar}, avatar),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
          `

          await loadUsers()
        } else {
          // Modo offline
          setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...updates } : user)))
        }

        if (currentUser?.id === id) {
          setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null))
        }

        forceRefresh()
        console.log(`✅ Usuário atualizado com sucesso!`)
      } catch (error) {
        console.error("❌ Erro ao atualizar usuário:", error)
        setError("Erro ao atualizar usuário")
      }
    },
    [isDatabaseMode, loadUsers, forceRefresh, currentUser],
  )

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        if (isDatabaseMode && sql) {
          // Modo banco de dados
          await sql`DELETE FROM users WHERE id = ${id}`
          await loadUsers()
        } else {
          // Modo offline
          setUsers((prev) => prev.filter((user) => user.id !== id))
        }

        forceRefresh()
        console.log(`🗑️ Usuário removido com sucesso!`)
      } catch (error) {
        console.error("❌ Erro ao deletar usuário:", error)
        setError("Erro ao deletar usuário")
      }
    },
    [isDatabaseMode, loadUsers, forceRefresh],
  )

  const updateUserPermissions = useCallback(
    async (userId: string, newPermissions: Permission[]) => {
      try {
        if (isDatabaseMode && sql) {
          // Modo banco de dados
          await sql`DELETE FROM user_permissions WHERE user_id = ${userId}`

          for (const permission of newPermissions) {
            await sql`
              INSERT INTO user_permissions (user_id, permission_id)
              VALUES (${userId}, ${permission.id})
            `
          }

          await loadUsers()
        } else {
          // Modo offline
          setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, permissions: newPermissions } : user)))
        }

        if (currentUser?.id === userId) {
          setCurrentUser((prev) => (prev ? { ...prev, permissions: newPermissions } : null))
        }

        forceRefresh()
        console.log(`🔐 Permissões atualizadas em tempo real!`)
      } catch (error) {
        console.error("❌ Erro ao atualizar permissões:", error)
        setError("Erro ao atualizar permissões")
      }
    },
    [isDatabaseMode, loadUsers, forceRefresh, currentUser],
  )

  const updateModule = useCallback(
    async (moduleId: string, updates: Partial<Module>) => {
      try {
        if (isDatabaseMode && sql) {
          // Modo banco de dados
          await sql`
            UPDATE modules SET
              name = COALESCE(${updates.name}, name),
              description = COALESCE(${updates.description}, description),
              is_active = COALESCE(${updates.isActive}, is_active),
              plans = COALESCE(${updates.plans}, plans),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ${moduleId}
          `

          await loadModules()
        } else {
          // Modo offline
          setModules((prev) => prev.map((module) => (module.id === moduleId ? { ...module, ...updates } : module)))
        }

        forceRefresh()
        console.log(`📚 Módulo ${moduleId} atualizado!`)
      } catch (error) {
        console.error("❌ Erro ao atualizar módulo:", error)
        setError("Erro ao atualizar módulo")
      }
    },
    [isDatabaseMode, loadModules, forceRefresh],
  )

  const addModuleContent = useCallback(
    async (moduleId: string, content: Omit<ModuleContent, "id">) => {
      try {
        if (isDatabaseMode && sql) {
          // Modo banco de dados
          const result = await sql`
            INSERT INTO module_contents (module_id, title, description, link, type, duration, is_active, plans, order_index)
            VALUES (${moduleId}, ${content.title}, ${content.description}, ${content.link}, ${content.type}, ${content.duration}, ${content.isActive}, ${content.plans}, 
              (SELECT COALESCE(MAX(order_index), 0) + 1 FROM module_contents WHERE module_id = ${moduleId}))
            RETURNING id
          `

          const contentId = result[0].id

          // Adicionar links adicionais se existirem
          if (content.links && content.links.length > 0) {
            for (const [index, link] of content.links.entries()) {
              await sql`
                INSERT INTO content_links (content_id, title, url, description, order_index)
                VALUES (${contentId}, ${link.title}, ${link.url}, ${link.description || ""}, ${index + 1})
              `
            }
          }

          await loadModules()
        } else {
          // Modo offline
          const newContent: ModuleContent = {
            ...content,
            id: `${moduleId}-${Date.now()}`,
          }

          setModules((prev) =>
            prev.map((module) =>
              module.id === moduleId ? { ...module, contents: [...module.contents, newContent] } : module,
            ),
          )
        }

        forceRefresh()
        console.log(`✅ Conteúdo adicionado ao módulo ${moduleId}!`)
      } catch (error) {
        console.error("❌ Erro ao adicionar conteúdo:", error)
        setError("Erro ao adicionar conteúdo")
      }
    },
    [isDatabaseMode, loadModules, forceRefresh],
  )

  const updateModuleContent = useCallback(
    async (moduleId: string, contentId: string, updates: Partial<ModuleContent>) => {
      try {
        if (isDatabaseMode && sql) {
          // Modo banco de dados
          await sql`
            UPDATE module_contents SET
              title = COALESCE(${updates.title}, title),
              description = COALESCE(${updates.description}, description),
              link = COALESCE(${updates.link}, link),
              type = COALESCE(${updates.type}, type),
              duration = COALESCE(${updates.duration}, duration),
              is_active = COALESCE(${updates.isActive}, is_active),
              plans = COALESCE(${updates.plans}, plans),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ${contentId}
          `

          // Atualizar links se fornecidos
          if (updates.links !== undefined) {
            await sql`DELETE FROM content_links WHERE content_id = ${contentId}`

            if (updates.links.length > 0) {
              for (const [index, link] of updates.links.entries()) {
                await sql`
                  INSERT INTO content_links (content_id, title, url, description, order_index)
                  VALUES (${contentId}, ${link.title}, ${link.url}, ${link.description || ""}, ${index + 1})
                `
              }
            }
          }

          await loadModules()
        } else {
          // Modo offline
          setModules((prev) =>
            prev.map((module) =>
              module.id === moduleId
                ? {
                    ...module,
                    contents: module.contents.map((content) =>
                      content.id === contentId ? { ...content, ...updates } : content,
                    ),
                  }
                : module,
            ),
          )
        }

        forceRefresh()
        console.log(`✅ Conteúdo ${contentId} atualizado!`)
      } catch (error) {
        console.error("❌ Erro ao atualizar conteúdo:", error)
        setError("Erro ao atualizar conteúdo")
      }
    },
    [isDatabaseMode, loadModules, forceRefresh],
  )

  const deleteModuleContent = useCallback(
    async (moduleId: string, contentId: string) => {
      try {
        if (isDatabaseMode && sql) {
          // Modo banco de dados
          await sql`DELETE FROM module_contents WHERE id = ${contentId}`
          await loadModules()
        } else {
          // Modo offline
          setModules((prev) =>
            prev.map((module) =>
              module.id === moduleId
                ? {
                    ...module,
                    contents: module.contents.filter((content) => content.id !== contentId),
                  }
                : module,
            ),
          )
        }

        forceRefresh()
        console.log(`🗑️ Conteúdo ${contentId} removido!`)
      } catch (error) {
        console.error("❌ Erro ao deletar conteúdo:", error)
        setError("Erro ao deletar conteúdo")
      }
    },
    [isDatabaseMode, loadModules, forceRefresh],
  )

  // Outras funções mantidas como estavam
  const exportUsersToExcel = () => {
    try {
      if (typeof window === "undefined" || !window.XLSX) {
        alert("Biblioteca de exportação não disponível. Recarregue a página e tente novamente.")
        return
      }

      const userData = users.map((user) => ({
        Nome: user.name,
        Email: user.email,
        Cargo: user.cargo,
        Departamentos: user.department.join(", "),
        Stakeholders: user.stakeholders.join(", "),
        Empresa: user.empresa,
        Grupo: user.grupo,
        CNPJ: user.cnpj,
        Plano: user.plan || "Não definido",
        Status: user.status,
        "Último Login": user.lastLogin?.toLocaleDateString("pt-BR") || "Nunca",
        "Data Criação": user.createdAt.toLocaleDateString("pt-BR"),
      }))

      const ws = window.XLSX.utils.json_to_sheet(userData)
      const wb = window.XLSX.utils.book_new()
      window.XLSX.utils.book_append_sheet(wb, ws, "Usuários")
      window.XLSX.writeFile(wb, `usuarios_${new Date().toISOString().split("T")[0]}.xlsx`)

      console.log("✅ Relatório de usuários exportado com sucesso!")
    } catch (error) {
      console.error("❌ Erro ao exportar usuários:", error)
      alert("Erro ao exportar relatório. Tente novamente.")
    }
  }

  const exportModulesToExcel = () => {
    try {
      if (typeof window === "undefined" || !window.XLSX) {
        alert("Biblioteca de exportação não disponível. Recarregue a página e tente novamente.")
        return
      }

      const moduleData = modules.flatMap((module) =>
        module.contents.map((content) => ({
          Módulo: module.name,
          "Status Módulo": module.isActive ? "Ativo" : "Inativo",
          Conteúdo: content.title,
          Descrição: content.description,
          Tipo: content.type,
          "Duração (min)": content.duration,
          "Status Conteúdo": content.isActive ? "Ativo" : "Inativo",
          Planos: content.plans.join(", "),
          Link: content.link,
          "Links Adicionais": content.links ? content.links.map((l) => `${l.title}: ${l.url}`).join(" | ") : "",
        })),
      )

      const ws = window.XLSX.utils.json_to_sheet(moduleData)
      const wb = window.XLSX.utils.book_new()
      window.XLSX.utils.book_append_sheet(wb, ws, "Módulos e Conteúdos")
      window.XLSX.writeFile(wb, `modulos_${new Date().toISOString().split("T")[0]}.xlsx`)

      console.log("✅ Relatório de módulos exportado com sucesso!")
    } catch (error) {
      console.error("❌ Erro ao exportar módulos:", error)
      alert("Erro ao exportar relatório. Tente novamente.")
    }
  }

  const hasPermission = (permissionId: string): boolean => {
    if (!currentUser) return false
    if (currentUser.role === "admin") return true
    return currentUser.permissions.some((p) => p.id === permissionId)
  }

  const addCargo = (cargo: string) => {
    console.log(`✅ Novo cargo "${cargo}" adicionado!`)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = users.find((u) => u.email === email)
      if (user && password === "123456") {
        const updatedUser = { ...user, lastLogin: new Date() }
        setCurrentUser(updatedUser)
        await updateUser(user.id, { lastLogin: new Date() })
        return true
      }
      return false
    } catch (error) {
      console.error("❌ Erro no login:", error)
      return false
    }
  }

  const logout = () => {
    setCurrentUser(null)
    console.log("👋 Usuário desconectado")
  }

  const refreshUserData = async () => {
    await loadAllData()
    forceRefresh()
    console.log("🔄 Dados atualizados")
  }

  // Effects para monitorar conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Salvar dados no localStorage quando em modo offline
  useEffect(() => {
    if (!isDatabaseMode && typeof window !== "undefined") {
      localStorage.setItem("admin_users", JSON.stringify(users))
      localStorage.setItem("admin_modules", JSON.stringify(modules))
      localStorage.setItem("admin_last_update", lastUpdate.toISOString())
      localStorage.setItem("admin_refresh_trigger", refreshTrigger.toString())
    }
  }, [users, modules, lastUpdate, refreshTrigger, isDatabaseMode])

  const value: AdminContextType = {
    currentUser,
    users,
    permissions,
    modules,
    availableCargos: initialCargos,
    availableDepartments: initialDepartments,
    availableStakeholders: initialStakeholders,
    availablePlans: initialPlans,
    isAdmin,
    isManager,
    hasPermission,
    addUser,
    updateUser,
    deleteUser,
    updateUserPermissions,
    addCargo,
    updateModule,
    addModuleContent,
    updateModuleContent,
    deleteModuleContent,
    exportUsersToExcel,
    exportModulesToExcel,
    login,
    logout,
    refreshUserData,
    lastUpdate,
    isOnline,
    forceRefresh,
    refreshTrigger,
    isLoading,
    error,
    isDatabaseMode,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
