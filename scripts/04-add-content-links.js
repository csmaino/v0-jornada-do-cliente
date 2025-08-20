import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não configurada")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function addContentLinks() {
  try {
    console.log("🔗 Adicionando links adicionais aos conteúdos...")

    // Links para o conteúdo 1-3 (Certificado digital)
    await sql`
      INSERT INTO content_links (content_id, title, url, description, order_index) VALUES
      ('1-3', 'Certificado A1', 'https://ajuda.maino.com.br/pt-BR/articles/3156936-como-cadastrar-ou-atualizar-o-certificado-digital-a1', 'Como cadastrar certificado digital A1', 1),
      ('1-3', 'Certificado A3', 'https://ajuda.maino.com.br/pt-BR/articles/3156937-como-cadastrar-meu-certificado-a3-na-maino', 'Como cadastrar certificado digital A3', 2)
      ON CONFLICT DO NOTHING
    `

    // Adicionar mais conteúdos aos módulos existentes
    await sql`
      INSERT INTO module_contents (id, module_id, title, description, link, type, duration, is_active, plans, order_index) VALUES
      ('3-1', '3', 'Cadastre seus produtos no estoque', 'Você pode realizar o cadastro manualmente ou de forma automática com uma NF-e de entrada (importação ou de terceiros)', 'https://ajuda.maino.com.br/pt-BR/articles/3156831-como-cadastrar-um-produto-manualmente-no-estoque', 'interactive', 8, true, ARRAY['Mainô ERP'], 1),
      ('3-2', '3', 'Defina Categorias e Subcategorias para seus produtos', 'Organização eficiente de produtos por categorias', 'https://ajuda.maino.com.br/pt-BR/articles/3156887-como-definir-categorias-e-subcategorias-no-sistema', 'document', 5, true, ARRAY['Mainô ERP'], 2),
      ('4-1', '4', 'Emita sua primeira NF-e de importação através da DI ou DUIMP', 'Processo completo de emissão de NF-e de importação', 'https://ajuda.maino.com.br/pt-BR/articles/3156881-como-emitir-uma-nf-e-de-entrada-de-importacao-a-partir-do-xml-di', 'interactive', 8, true, ARRAY['Mainô ERP'], 1),
      ('5-1', '5', 'Emita sua primeira NF-e de venda no Mainô', 'Processo completo de emissão de NF-e de venda', 'https://ajuda.maino.com.br/pt-BR/articles/3609157-como-fazer-uma-venda', 'document', 7, true, ARRAY['Mainô Xpert', 'Mainô ERP'], 1),
      ('6-1', '6', 'Cadastre sua primeira conta a receber', 'Gerenciamento completo de contas a receber', 'https://ajuda.maino.com.br/pt-BR/articles/3156956-conhecendo-a-tela-de-recebimentos', 'document', 6, true, ARRAY['Mainô Xpert', 'Mainô ERP'], 1),
      ('7-1', '7', 'Cadastre seus benefícios fiscais', 'Configuração de benefícios fiscais disponíveis', 'https://ajuda.maino.com.br/pt-BR/articles/3156837-o-que-e-beneficio-fiscal-e-como-informar-na-nf-e', 'document', 5, true, ARRAY['Mainô ERP'], 1)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        link = EXCLUDED.link,
        type = EXCLUDED.type,
        duration = EXCLUDED.duration,
        is_active = EXCLUDED.is_active,
        plans = EXCLUDED.plans,
        order_index = EXCLUDED.order_index
    `

    // Links para conteúdo 3-1 (Produtos no estoque)
    await sql`
      INSERT INTO content_links (content_id, title, url, description, order_index) VALUES
      ('3-1', 'Cadastro de produto manual', 'https://ajuda.maino.com.br/pt-BR/articles/3156831-como-cadastrar-um-produto-manualmente-no-estoque', 'Como cadastrar produtos manualmente', 1),
      ('3-1', 'Cadastro de produto por NF-e de terceiros', 'https://ajuda.maino.com.br/pt-BR/articles/3156834-como-cadastrar-produtos-no-meu-estoque-atraves-de-uma-nf-e-de-terceiros-fornecedor', 'Como cadastrar produtos através de NF-e de terceiros', 2)
      ON CONFLICT DO NOTHING
    `

    // Links para conteúdo 4-1 (NF-e de importação)
    await sql`
      INSERT INTO content_links (content_id, title, url, description, order_index) VALUES
      ('4-1', 'Por DI', 'https://ajuda.maino.com.br/pt-BR/articles/3156881-como-emitir-uma-nf-e-de-entrada-de-importacao-a-partir-do-xml-di', 'Como emitir NF-e através da DI', 1),
      ('4-1', 'Por DUIMP', 'https://ajuda.maino.com.br/pt-BR/articles/9922907-como-utilizar-a-duimp-pelo-maino', 'Como utilizar a DUIMP pelo Mainô', 2)
      ON CONFLICT DO NOTHING
    `

    console.log("✅ Links adicionais inseridos com sucesso!")

    // Verificar resultados
    const contentCount = await sql`SELECT COUNT(*) as total FROM module_contents`
    const linkCount = await sql`SELECT COUNT(*) as total FROM content_links`

    console.log(`📊 Total de conteúdos: ${contentCount[0].total}`)
    console.log(`🔗 Total de links: ${linkCount[0].total}`)
  } catch (error) {
    console.error("❌ Erro ao adicionar links:", error)
    process.exit(1)
  }
}

addContentLinks()
