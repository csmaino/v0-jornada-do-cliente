// Script para migrar dados do localStorage para o Neon
// Execute este script no console do navegador na página /admin

async function migrateLocalStorageToNeon() {
  console.log("🚀 Iniciando migração do localStorage para Neon...")

  try {
    // Verificar se há dados no localStorage
    const savedUsers = localStorage.getItem("admin_users")
    const savedModules = localStorage.getItem("admin_modules")

    if (!savedUsers && !savedModules) {
      console.log("ℹ️ Nenhum dado encontrado no localStorage para migrar")
      return
    }

    // Migrar usuários se existirem
    if (savedUsers) {
      console.log("👥 Migrando usuários...")
      const users = JSON.parse(savedUsers)

      for (const user of users) {
        try {
          const response = await fetch("/api/migrate-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          })

          if (response.ok) {
            console.log(`✅ Usuário ${user.name} migrado com sucesso`)
          } else {
            console.log(`⚠️ Erro ao migrar usuário ${user.name}:`, await response.text())
          }
        } catch (error) {
          console.error(`❌ Erro ao migrar usuário ${user.name}:`, error)
        }
      }
    }

    // Migrar módulos se existirem
    if (savedModules) {
      console.log("📚 Migrando módulos...")
      const modules = JSON.parse(savedModules)

      for (const module of modules) {
        try {
          const response = await fetch("/api/migrate-module", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(module),
          })

          if (response.ok) {
            console.log(`✅ Módulo ${module.name} migrado com sucesso`)
          } else {
            console.log(`⚠️ Erro ao migrar módulo ${module.name}:`, await response.text())
          }
        } catch (error) {
          console.error(`❌ Erro ao migrar módulo ${module.name}:`, error)
        }
      }
    }

    console.log("🎉 Migração concluída!")
    console.log("💡 Você pode agora limpar o localStorage se desejar:")
    console.log("localStorage.removeItem('admin_users')")
    console.log("localStorage.removeItem('admin_modules')")
  } catch (error) {
    console.error("❌ Erro durante a migração:", error)
  }
}

// Função para limpar localStorage após migração bem-sucedida
function clearLocalStorageData() {
  localStorage.removeItem("admin_users")
  localStorage.removeItem("admin_modules")
  localStorage.removeItem("admin_last_update")
  localStorage.removeItem("admin_refresh_trigger")
  console.log("🧹 Dados do localStorage limpos com sucesso!")
}

// Disponibilizar funções globalmente
window.migrateLocalStorageToNeon = migrateLocalStorageToNeon
window.clearLocalStorageData = clearLocalStorageData

console.log("📋 Funções de migração carregadas!")
console.log("Execute: migrateLocalStorageToNeon() para iniciar a migração")
console.log("Execute: clearLocalStorageData() para limpar o localStorage após a migração")
