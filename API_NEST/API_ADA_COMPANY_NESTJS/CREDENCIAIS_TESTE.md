# 🔑 Credenciais de Teste - Backend ADA Company

## 📋 Usuários Criados pelo Seeder

O backend possui um seeder que cria usuários de demonstração automaticamente.

### Como Executar o Seeder

```bash
# No diretório do backend
cd backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS

# Executar o seeder
npm run db:seed
```

---

## 👤 Credenciais de Funcionário

**Para acessar o dashboard de funcionário:**

- **Email:** `joao.silva@adacompany.com`
- **Senha:** `admin123`
- **Nome:** João Silva
- **Telefone:** (11) 98888-8888
- **Tipo:** funcionario

**Funcionalidades disponíveis:**
- ✅ Acessar dashboard de funcionário
- ✅ Listar e gerenciar clientes
- ✅ Listar e gerenciar funcionários
- ✅ Criar e gerenciar orçamentos
- ✅ Criar e gerenciar contratos
- ✅ Acessar logs do sistema

---

## 👥 Credenciais de Cliente

**Para acessar o dashboard de cliente:**

- **Email:** `demo@empresa.com`
- **Senha:** `cliente123`
- **Nome:** Empresa Demo
- **CNPJ:** 12.345.678/0001-90
- **Telefone:** (11) 97777-7777
- **Tipo:** cliente

**Funcionalidades disponíveis:**
- ✅ Acessar dashboard de cliente
- ✅ Visualizar seus próprios dados
- ✅ Solicitar orçamentos
- ✅ Visualizar contratos

---

## ⚠️ Importante

1. **Essas credenciais são criadas apenas quando o seeder é executado**
   - Se o banco foi criado sem executar o seeder, essas credenciais não existirão
   - Execute `npm run db:seed` para criar os usuários de teste

2. **Se o seeder não foi executado, você pode:**
   - Executar o seeder: `npm run db:seed`
   - Ou criar um funcionário manualmente via API (requer autenticação)

3. **Para criar um funcionário via API:**
   ```bash
   # Primeiro, obtenha um token (se tiver outro funcionário)
   # Ou use o endpoint público de cadastro de cliente primeiro
   
   POST /funcionarios
   Authorization: Bearer <token_de_funcionario>
   {
     "nome_completo": "Nome do Funcionário",
     "email": "funcionario@adacompany.com",
     "telefone": "(11) 99999-9999",
     "senha": "senha123"
   }
   ```

4. **Segurança:**
   - Essas credenciais são apenas para desenvolvimento/testes
   - **NUNCA** use essas senhas em produção
   - Em produção, crie usuários com senhas fortes e únicas

---

## 🔄 Resetar Dados de Teste

Se precisar resetar os dados de teste:

```bash
# Desfazer o seeder
npm run db:seed:undo

# Executar novamente
npm run db:seed
```

Ou para resetar tudo:

```bash
# Desfazer todas as seeds
npm run db:seed:undo:all

# Executar todas as seeds novamente
npm run db:seed
```

---

## 📝 Verificar Usuários no Banco

Para verificar se os usuários foram criados:

```sql
-- Via pgAdmin ou psql
SELECT email, tipo_usuario, nome_completo 
FROM usuarios 
WHERE email IN ('joao.silva@adacompany.com', 'demo@empresa.com');
```

---

## 🚀 Uso Rápido

1. **Execute o seeder:**
   ```bash
   npm run db:seed
   ```

2. **Faça login no frontend com:**
   - Email: `joao.silva@adacompany.com`
   - Senha: `admin123`

3. **Acesse o dashboard de funcionário!**

---

**Última atualização:** 24 de Novembro de 2025

