import { neon } from "@neondatabase/serverless"

// Função para obter a conexão SQL de forma segura
export function getSQL() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL não configurada, usando modo offline")
    return null
  }
  return neon(process.env.DATABASE_URL)
}

// Exportar sql de forma condicional
export const sql = getSQL()

// Tipos para o banco de dados
export interface DatabaseUser {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user" | "viewer"
  status: "active" | "inactive" | "pending"
  last_login?: Date
  created_at: Date
  updated_at: Date
  department: string[]
  stakeholders: string[]
  empresa?: string
  grupo?: string
  cnpj?: string
  cargo?: string
  plan?: string
  avatar?: string
}

export interface DatabaseModule {
  id: string
  name: string
  description?: string
  icon?: string
  is_active: boolean
  plans: string[]
  category?: string
  level?: string
  tags?: string[]
  created_at: Date
  updated_at: Date
}

export interface DatabaseModuleContent {
  id: string
  module_id: string
  title: string
  description?: string
  link?: string
  type: "video" | "document" | "quiz" | "interactive"
  duration: number
  is_active: boolean
  plans: string[]
  order_index: number
  created_at: Date
  updated_at: Date
}

export interface DatabaseContentLink {
  id: string
  content_id: string
  title: string
  url: string
  description?: string
  order_index: number
  created_at: Date
}

export interface DatabasePermission {
  id: string
  name: string
  description?: string
  category: "system" | "content" | "users" | "reports" | "settings"
}

// Funções utilitárias para o banco
export async function testConnection() {
  try {
    if (!sql) {
      console.log("⚠️ Banco de dados não configurado - usando modo offline")
      return false
    }

    const result = await sql`SELECT NOW() as current_time`
    console.log("✅ Conexão com Neon estabelecida:", result[0].current_time)
    return true
  } catch (error) {
    console.error("❌ Erro ao conectar com Neon:", error)
    return false
  }
}

export async function getTableInfo(tableName: string) {
  try {
    if (!sql) {
      console.log("⚠️ Banco de dados não configurado")
      return []
    }

    const result = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      ORDER BY ordinal_position
    `
    return result
  } catch (error) {
    console.error(`❌ Erro ao obter informações da tabela ${tableName}:`, error)
    return []
  }
}

// Verificar se o banco está disponível
export function isDatabaseAvailable(): boolean {
  return sql !== null && process.env.DATABASE_URL !== undefined
}
