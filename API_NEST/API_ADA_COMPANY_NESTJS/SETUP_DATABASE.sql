-- =====================================================
-- Script de Configuração do Banco de Dados
-- ADA Company Backend
-- =====================================================

-- 1. Criar usuário (execute como postgres ou superuser)
CREATE USER adacompanysteam WITH PASSWORD '2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee';

-- 2. Criar banco de dados
CREATE DATABASE adacompanybd OWNER adacompanysteam;

-- 3. Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE adacompanybd TO adacompanysteam;

-- 4. Conectar ao banco adacompanybd e dar permissões no schema
\c adacompanybd
GRANT ALL ON SCHEMA public TO adacompanysteam;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO adacompanysteam;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO adacompanysteam;

-- =====================================================
-- Pronto! Agora você pode:
-- 1. Voltar ao terminal
-- 2. cd "backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS"
-- 3. npm run db:migrate
-- 4. npm run db:seed
-- 5. npm run start:dev
-- =====================================================



