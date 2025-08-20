-- Inserir módulos iniciais
INSERT INTO modules (id, name, description, icon, is_active, plans) VALUES
('1', 'Boas-vindas e Visão Geral', 'Introdução ao sistema Mainô', 'BookOpen', true, ARRAY['Mainô Xpert', 'Mainô Flex', 'Mainô ERP']),
('2', 'Configurações do sistema', 'Utilize as configurações do sistema ao seu favor', 'Settings', true, ARRAY['Mainô Xpert', 'Mainô ERP']),
('3', 'Gestão de estoque', 'Gestão de estoque, entrada de produtos e processos de compra', 'Package', true, ARRAY['Mainô ERP']),
('4', 'COMEX', 'Gestão de processos e emissão de NF-e de importação e exportação', 'Globe', true, ARRAY['Mainô ERP']),
('5', 'Negócios e Vendas', 'Fluxo de venda e emissão de NF-e de saída', 'ShoppingCart', true, ARRAY['Mainô Xpert', 'Mainô ERP']),
('6', 'Gestão financeira', 'Gestão financeira, contas a pagar e receber, fluxo de caixa', 'DollarSign', true, ARRAY['Mainô Xpert', 'Mainô ERP']),
('7', 'Gestão fiscal', 'Parametrizações e cadastros fiscais essenciais', 'FileText', true, ARRAY['Mainô ERP'])
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    is_active = EXCLUDED.is_active,
    plans = EXCLUDED.plans;

-- Inserir conteúdos do módulo 1 (Boas-vindas)
INSERT INTO module_contents (id, module_id, title, description, link, type, duration, is_active, plans, order_index) VALUES
('1-1', '1', 'Conheça o Mainô ERP', 'Visão geral do sistema e suas funcionalidades principais', 'https://youtu.be/_sHY9Y74pe4?feature=shared', 'video', 3, true, ARRAY['Mainô Xpert', 'Mainô Flex', 'Mainô ERP'], 1),
('1-2', '1', 'Finalize o cadastro da empresa', 'Como finalizar o cadastro da sua empresa no sistema', 'https://ajuda.maino.com.br/pt-BR/articles/3609075-completando-o-cadastro-da-sua-empresa', 'document', 5, true, ARRAY['Mainô Xpert', 'Mainô Flex', 'Mainô ERP'], 2),
('1-3', '1', 'Cadastre o certificado digital A1 ou A3', 'Configuração do certificado digital para emissão de notas', 'https://ajuda.maino.com.br/pt-BR/articles/3156936-como-cadastrar-ou-atualizar-o-certificado-digital-a1', 'interactive', 7, true, ARRAY['Mainô Xpert', 'Mainô ERP'], 3),
('1-4', '1', 'Cadastre o seu certificado e-CPF', 'Configuração do e-CPF para operações fiscais', 'https://ajuda.maino.com.br/pt-BR/articles/9708009-como-cadastrar-o-certificado-digital-e-cpf', 'document', 4, true, ARRAY['Mainô ERP'], 4),
('1-5', '1', 'Cadastre o seu despachante', 'Como cadastrar despachante para operações de comércio exterior', 'https://ajuda.maino.com.br/pt-BR/articles/11030391-como-cadastrar-um-despachante-aduaneiro', 'document', 3, true, ARRAY['Mainô ERP'], 5),
('1-6', '1', 'Cadastre o seu contador', 'Como cadastrar contador responsável pela empresa', 'https://ajuda.maino.com.br/pt-BR/articles/3156941-como-cadastrar-meu-contador-no-sistema', 'document', 3, true, ARRAY['Mainô Xpert', 'Mainô ERP'], 6),
('1-7', '1', 'Aprenda como cadastrar um representante de vendas', 'Como cadastrar representantes de vendas no sistema', 'https://ajuda.maino.com.br/pt-BR/articles/3850038-como-cadastrar-um-usuario-com-a-funcao-representante', 'document', 4, true, ARRAY['Mainô Xpert', 'Mainô ERP'], 7),
('1-8', '1', 'Cadastre novos usuários', 'Gerenciamento de usuários e permissões do sistema', 'https://ajuda.maino.com.br/pt-BR/articles/3156868-como-criar-um-novo-usuario', 'document', 5, true, ARRAY['Mainô Flex', 'Mainô Xpert', 'Mainô ERP'], 8)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    link = EXCLUDED.link,
    type = EXCLUDED.type,
    duration = EXCLUDED.duration,
    is_active = EXCLUDED.is_active,
    plans = EXCLUDED.plans,
    order_index = EXCLUDED.order_index;

-- Inserir usuários iniciais
INSERT INTO users (id, name, email, role, status, department, stakeholders, empresa, grupo, cnpj, cargo, plan) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Rafael Moreira', 'rafael@maino.com.br', 'admin', 'active', ARRAY['Financeiro', 'Controle'], ARRAY['Responsável legal', 'Decisor técnico'], 'Mainô Tecnologia Ltda', 'Grupo Mainô', '12.345.678/0001-90', 'Diretor', 'Mainô ERP'),
('550e8400-e29b-41d4-a716-446655440002', 'Ana Silva', 'ana.silva@maino.com.br', 'manager', 'active', ARRAY['Comercial'], ARRAY['Decisor econômico'], 'Mainô Tecnologia Ltda', 'Grupo Mainô', '12.345.678/0001-90', 'Gerente ou Coordenador', 'Mainô Xpert'),
('550e8400-e29b-41d4-a716-446655440003', 'João Santos', 'joao.santos@maino.com.br', 'user', 'active', ARRAY['Estoque', 'Compras'], ARRAY['Operador'], 'Empresa Cliente ABC', 'Grupo ABC', '98.765.432/0001-10', 'Analista', 'Mainô Flex')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    department = EXCLUDED.department,
    stakeholders = EXCLUDED.stakeholders,
    empresa = EXCLUDED.empresa,
    grupo = EXCLUDED.grupo,
    cnpj = EXCLUDED.cnpj,
    cargo = EXCLUDED.cargo,
    plan = EXCLUDED.plan;

-- Inserir permissões para o usuário admin
INSERT INTO user_permissions (user_id, permission_id) 
SELECT '550e8400-e29b-41d4-a716-446655440001', id FROM permissions
ON CONFLICT (user_id, permission_id) DO NOTHING;

-- Inserir permissões para o usuário manager (todas exceto system)
INSERT INTO user_permissions (user_id, permission_id) 
SELECT '550e8400-e29b-41d4-a716-446655440002', id FROM permissions WHERE category != 'system'
ON CONFLICT (user_id, permission_id) DO NOTHING;

-- Inserir permissões para o usuário comum (apenas content e reports)
INSERT INTO user_permissions (user_id, permission_id) 
SELECT '550e8400-e29b-41d4-a716-446655440003', id FROM permissions WHERE category IN ('content', 'reports')
ON CONFLICT (user_id, permission_id) DO NOTHING;
