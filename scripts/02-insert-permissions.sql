-- Inserir permissões do sistema
INSERT INTO permissions (id, name, description, category) VALUES
('users.view', 'Visualizar Usuários', 'Pode visualizar lista de usuários', 'users'),
('users.create', 'Criar Usuários', 'Pode criar novos usuários', 'users'),
('users.edit', 'Editar Usuários', 'Pode editar informações de usuários', 'users'),
('users.delete', 'Excluir Usuários', 'Pode excluir usuários do sistema', 'users'),
('content.view', 'Visualizar Conteúdo', 'Pode visualizar todo o conteúdo', 'content'),
('content.edit', 'Editar Conteúdo', 'Pode editar conteúdo do sistema', 'content'),
('reports.view', 'Visualizar Relatórios', 'Pode acessar relatórios do sistema', 'reports'),
('reports.export', 'Exportar Relatórios', 'Pode exportar relatórios', 'reports'),
('settings.view', 'Visualizar Configurações', 'Pode visualizar configurações do sistema', 'settings'),
('settings.edit', 'Editar Configurações', 'Pode modificar configurações do sistema', 'settings'),
('system.admin', 'Administração Total', 'Acesso completo ao sistema', 'system')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category;
