# 🚀 Guia Rápido - Setup do Backend Completo

## ✅ Situação Atual:

- ✅ Backend completo clonado (todos os arquivos)
- ✅ PostgreSQL instalado e rodando
- ✅ Arquivo `.env` criado
- ⏳ Precisa criar banco de dados

---

## 📝 OPÇÃO 1: Via pgAdmin (RECOMENDADO - MAIS FÁCIL)

### **Passo 1: Abra o pgAdmin 4**
Menu Iniciar → pgAdmin 4

### **Passo 2: Abra o Query Tool**
1. Clique em "PostgreSQL 17" (servidor)
2. Vá em: **Tools → Query Tool**

### **Passo 3: Execute o Script SQL**
Cole este código e clique em "▶ Execute":

```sql
-- Criar usuário
CREATE USER adacompanysteam WITH PASSWORD '2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee';

-- Criar banco
CREATE DATABASE adacompanybd OWNER adacompanysteam;

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE adacompanybd TO adacompanysteam;
```

**Resultado esperado:**
```
CREATE ROLE
CREATE DATABASE  
GRANT
```

✅ **Pronto! Banco criado!**

### **Passo 4: No Terminal - Rodar Migrations**

```bash
cd "backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS"
npm run db:migrate
```

**Resultado:**
```
== 20240406000000-create-tables: migrating =======
== 20240406000000-create-tables: migrated (0.123s)
```

✅ **Tabelas criadas!**

### **Passo 5: Rodar Seeders (Dados Iniciais)**

```bash
npm run db:seed
```

**Resultado:**
```
== 20240406000000-demo-data: seeding =======
== 20240406000000-demo-data: seeded (0.050s)
```

✅ **Dados iniciais populados!**

### **Passo 6: Iniciar Backend**

```bash
npm run start:dev
```

**Resultado esperado:**
```
[Nest] LOG [SequelizeModule] Connected to database: adacompanybd
[Nest] LOG [NestApplication] Nest application successfully started
🚀 Aplicação rodando em: http://localhost:3000
📚 Documentação Swagger em: http://localhost:3000/api
```

---

## 📝 OPÇÃO 2: Via Interface Gráfica do pgAdmin

### **Passo 1: Criar Usuário**
1. **Servers → PostgreSQL 17**
2. **Botão direito em "Login/Group Roles"**
3. **Create → Login/Group Role...**
4. **Aba General:**
   - Name: `adacompanysteam`
5. **Aba Definition:**
   - Password: `2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee`
6. **Aba Privileges:**
   - ✅ Can login
   - ✅ Create databases
7. **Save**

### **Passo 2: Criar Banco**
1. **Botão direito em "Databases"**
2. **Create → Database...**
3. **Aba General:**
   - Database: `adacompanybd`
   - Owner: `adacompanysteam`
4. **Save**

### **Passo 3: Continuar do Passo 4 da Opção 1**

---

## ⚠️ Se der erro "Senha inválida para postgres"

Isso significa que você precisa saber a senha do usuário `postgres` (superuser) para criar o novo usuário.

### **Soluções:**

#### **A) Lembrar/Encontrar a Senha**
- Veja anotações da instalação
- Tente: `postgres`, `admin`, `root`, `password`

#### **B) Usar pgAdmin**
- Se você consegue abrir o pgAdmin
- Ele já está conectado!
- Siga a OPÇÃO 2 acima

#### **C) Usar Usuário Postgres Existente**
Em vez de criar `adacompanysteam`, use o usuário `postgres`:

**Atualize o `.env`:**
```env
DB_USERNAME=postgres
DB_PASSWORD=SUA_SENHA_DO_POSTGRES
DB_DATABASE=adacompanybd
```

---

## 🧪 Testar Conexão

Depois de configurar, teste:

```bash
cd "backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS"
npm run start:dev
```

**Se conectar:** ✅ Sucesso!
**Se der erro:** Verifique credenciais no `.env`

---

## 📊 Estrutura do Banco Original:

O backend cria estas tabelas:

```
adacompanybd/
├── usuarios          (usuários do sistema)
├── clientes          (dados de clientes)
├── funcionarios      (dados de funcionários)
├── pacotes           (pacotes de acessibilidade)
├── orcamentos        (orçamentos)
└── contratos         (contratos)
```

---

## ✅ Checklist:

- [ ] pgAdmin aberto
- [ ] Usuário `adacompanysteam` criado (ou usando `postgres`)
- [ ] Banco `adacompanybd` criado
- [ ] `.env` com credenciais corretas
- [ ] `npm install` executado
- [ ] `npm run db:migrate` executado
- [ ] `npm run db:seed` executado  
- [ ] `npm run start:dev` funcionando
- [ ] http://localhost:3000/health funcionando

---

## 🆘 Precisa de Ajuda?

**Me diga:**
1. Consegue abrir o pgAdmin?
2. Consegue ver o servidor PostgreSQL 17?
3. Consegue criar banco via interface?

**Ou:**
- Me passe o usuário e senha do PostgreSQL que você tem
- Eu configuro o .env para usar

---

**Arquivo SQL pronto:** `SETUP_DATABASE.sql`

Execute no Query Tool do pgAdmin! 🚀


