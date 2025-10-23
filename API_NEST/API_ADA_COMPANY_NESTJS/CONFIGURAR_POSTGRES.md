# 🗄️ Configurar PostgreSQL para o Backend - Guia Completo

## ✅ Backend Completo Detectado!

O backend agora está com **todos os arquivos originais** incluindo:
- ✅ Estrutura completa de Clean Architecture
- ✅ PostgreSQL já configurado
- ✅ Sequelize com migrations e seeders
- ✅ Entities completas (Usuario, Cliente, Funcionario, etc.)
- ✅ Todos os controllers e use-cases

---

## 📋 Configuração do PostgreSQL via pgAdmin (FÁCIL)

### **Passo 1: Abrir pgAdmin 4**

1. Abra o **pgAdmin 4** (Menu Iniciar → pgAdmin 4)
2. Digite a **senha master** quando pedir
3. Expanda "Servers" → "PostgreSQL 17"

### **Passo 2: Criar Usuário `adacompanysteam`**

1. **Clique com botão direito em "Login/Group Roles"**
2. **Create → Login/Group Role**
3. **Aba "General":**
   - Name: `adacompanysteam`
4. **Aba "Definition":**
   - Password: `2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee`
5. **Aba "Privileges":**
   - ✅ Can login? Yes
   - ✅ Superuser? No
   - ✅ Create databases? Yes
6. **Clique em "Save"**

### **Passo 3: Criar Banco de Dados `adacompanybd`**

1. **Clique com botão direito em "Databases"**
2. **Create → Database**
3. **Preencha:**
   - Database: `adacompanybd`
   - Owner: `adacompanysteam`
   - Encoding: `UTF8`
4. **Clique em "Save"**

### **Passo 4: Verificar Arquivo .env**

O arquivo `.env` já está criado com as configurações corretas:

```
backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS/.env
```

Conteúdo:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=adacompanysteam
DB_PASSWORD=2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee
DB_DATABASE=adacompanybd
JWT_SECRET=ada_company_secret_key_2025
PORT=3000
NODE_ENV=development
```

### **Passo 5: Instalar Dependências**

```bash
cd "backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS"
npm install
```

### **Passo 6: Rodar Migrations**

```bash
npm run db:migrate
```

**O que vai acontecer:**
- ✅ Cria todas as tabelas no PostgreSQL
- ✅ Estrutura completa do banco

### **Passo 7: Rodar Seeders (Dados Iniciais)**

```bash
npm run db:seed
```

**O que vai acontecer:**
- ✅ Popula tabelas com dados de exemplo
- ✅ Cria usuários, clientes, funcionários, pacotes, etc.

### **Passo 8: Iniciar Backend**

```bash
npm run start:dev
```

**Resultado esperado:**
```
[Nest] LOG [InstanceLoader] SequelizeModule dependencies initialized
[Nest] LOG [SequelizeModule] Connected to PostgreSQL database
[Nest] LOG [NestApplication] Nest application successfully started
🚀 Aplicação rodando em: http://localhost:3000
📚 Documentação Swagger em: http://localhost:3000/api
```

---

## 🔍 Verificar Estrutura do Banco

### **Via pgAdmin:**

1. **Expanda:** Databases → adacompanybd → Schemas → public → Tables
2. **Você deve ver:**
   - ✅ usuarios
   - ✅ clientes
   - ✅ funcionarios
   - ✅ pacotes
   - ✅ orcamentos
   - ✅ contratos

### **Via Query Tool:**

1. **Clique em adacompanybd**
2. **Tools → Query Tool**
3. **Execute:**
```sql
SELECT * FROM usuarios;
```

**Deve retornar os usuários criados pelos seeders!**

---

## 🔗 Diferenças do Backend Original

O backend completo usa **nomes em português** nos campos:

### **Campos do Usuário:**
| Backend Original | Frontend Atual |
|------------------|----------------|
| `email` | `email` ✅ |
| `senha` | `password` ⚠️ |
| `tipo_usuario` | `type` ⚠️ |
| `nome_completo` | `name` ⚠️ |

### **Valores de tipo_usuario:**
| Backend | Frontend |
|---------|----------|
| `'cliente'` | `'client'` ⚠️ |
| `'funcionario'` | `'employee'` ⚠️ |

---

## 🔧 Ajustes Necessários no Frontend

Preciso atualizar o frontend para usar os campos corretos do backend:

### **1. ApiService - Método de Login**
Mudar de:
```typescript
{ email, password }
```
Para:
```typescript
{ email, senha: password }
```

### **2. ApiService - Método de Registro**
Mapear campos:
```typescript
{
  email,
  senha: password,
  nome_completo: name,
  tipo_usuario: type === 'client' ? 'cliente' : 'funcionario'
}
```

### **3. UserModel - Mapear Resposta**
Ao receber dados do backend:
```typescript
{
  ...userData,
  type: userData.tipo_usuario === 'cliente' ? 'client' : 'employee',
  name: userData.nome_completo,
  password: userData.senha
}
```

---

## 📊 Status Atual:

| Item | Status |
|------|--------|
| Backend completo | ✅ Clonado |
| PostgreSQL | ✅ Instalado |
| Estrutura de banco | ✅ Configurada (migrations) |
| .env criado | ✅ |
| **Banco criado** | ⏳ Fazer via pgAdmin |
| **Usuário criado** | ⏳ Fazer via pgAdmin |
| **Migrations executadas** | ⏳ Após criar banco |
| **Frontend ajustado** | ⏳ Ajustar mapeamento |

---

## 🎯 Próximos Passos:

1. **Você:**
   - Abra pgAdmin
   - Crie usuário `adacompanysteam`
   - Crie banco `adacompanybd`

2. **Eu:**
   - Ajusto frontend para usar campos corretos
   - Testo integração completa

---

## 💡 Alternativa Mais Rápida:

Se você já tem um **usuário PostgreSQL existente** (ex: `postgres`), posso configurar o backend para usar ele!

Basta me dizer:
- Usuário: ?
- Senha: ?
- E eu ajusto o .env

**O que prefere?** 🤔


