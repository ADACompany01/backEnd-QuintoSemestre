-- Script para limpar usuários órfãos
-- Usuários que estão na tabela usuarios mas não têm registro em clientes ou funcionarios

-- 1. Listar usuários órfãos (para verificar antes de deletar)
SELECT u.id_usuario, u.nome_completo, u.email, u.tipo_usuario, u.created_at
FROM usuarios u
LEFT JOIN clientes c ON u.id_usuario = c.id_usuario
LEFT JOIN funcionarios f ON u.id_usuario = f.id_usuario
WHERE c.id_cliente IS NULL AND f.id_funcionario IS NULL;

-- 2. Deletar usuários órfãos do tipo 'cliente' que não têm registro em clientes
-- ATENÇÃO: Descomente a linha abaixo SOMENTE se tiver certeza que quer deletar
-- DELETE FROM usuarios
-- WHERE tipo_usuario = 'cliente'
-- AND id_usuario NOT IN (SELECT id_usuario FROM clientes WHERE id_usuario IS NOT NULL);

-- 3. Deletar usuários órfãos do tipo 'funcionario' que não têm registro em funcionarios
-- ATENÇÃO: Descomente a linha abaixo SOMENTE se tiver certeza que quer deletar
-- DELETE FROM usuarios
-- WHERE tipo_usuario = 'funcionario'
-- AND id_usuario NOT IN (SELECT id_usuario FROM funcionarios WHERE id_usuario IS NOT NULL);

-- 4. Contar quantos usuários órfãos existem
SELECT 
    tipo_usuario,
    COUNT(*) as quantidade_orfaos
FROM usuarios u
LEFT JOIN clientes c ON u.id_usuario = c.id_usuario
LEFT JOIN funcionarios f ON u.id_usuario = f.id_usuario
WHERE c.id_cliente IS NULL AND f.id_funcionario IS NULL
GROUP BY tipo_usuario;


