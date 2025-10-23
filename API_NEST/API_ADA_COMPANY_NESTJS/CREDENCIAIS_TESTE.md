# 🔑 Credenciais de Teste - Usuários Seedados

## 👥 **USUÁRIOS CRIADOS PELO SEED:**

---

### **1. FUNCIONÁRIO** 👨‍💼

```
Nome: João Silva
Email: joao.silva@adacompany.com
Senha: admin123
Tipo: funcionario
Telefone: (11) 98888-8888
```

**Para fazer login:**
```json
{
  "email": "joao.silva@adacompany.com",
  "senha": "admin123"
}
```

---

### **2. CLIENTE** 👤

```
Nome: Empresa Demo
Email: demo@empresa.com
Senha: cliente123
Tipo: cliente
CNPJ: 12.345.678/0001-90
Telefone: (11) 97777-7777
```

**Para fazer login:**
```json
{
  "email": "demo@empresa.com",
  "senha": "cliente123"
}
```

---

## 🧪 **Como Testar:**

### **Opção 1: No Swagger**

1. **Abra:** http://localhost:3000/api
2. **Vá em:** `POST /auth/login`
3. **Clique:** "Try it out"
4. **Cole:**

**Para FUNCIONÁRIO:**
```json
{
  "email": "joao.silva@adacompany.com",
  "senha": "admin123"
}
```

**OU para CLIENTE:**
```json
{
  "email": "demo@empresa.com",
  "senha": "cliente123"
}
```

5. **Execute**
6. **✅ Você receberá:**
   - Token JWT
   - Dados do usuário

---

### **Opção 2: No App Android**

1. **Abra o app** (pressione `r` no Expo para recarregar)
2. **Na tela de login, digite:**

**FUNCIONÁRIO:**
- Email: `joao.silva@adacompany.com`
- Senha: `admin123`

**OU CLIENTE:**
- Email: `demo@empresa.com`
- Senha: `cliente123`

3. **Clique em "Entrar"**
4. **✅ Você será logado!**

---

## 📊 **Ver Todos os Usuários no Banco:**

### **Via pgAdmin:**

1. **Abra pgAdmin 4**
2. **Expanda:** Servers → PostgreSQL 17 → Databases → adacompanybd → Schemas → public → Tables
3. **Clique com botão direito em `usuarios`**
4. **View/Edit Data → All Rows**

**Você verá:**
```
id_usuario | nome_completo | email | tipo_usuario | senha (hash bcrypt)
-----------|---------------|-------|--------------|--------------------
uuid...001 | João Silva | joao.silva@... | funcionario | $2b$10$...
uuid...004 | Empresa Demo | demo@empresa... | cliente | $2b$10$...
```

---

### **Via Swagger (se houver endpoint):**

Verifique se existe um endpoint para listar usuários no Swagger.

---

### **Via Query SQL no pgAdmin:**

1. **pgAdmin → adacompanybd**
2. **Tools → Query Tool**
3. **Execute:**

```sql
-- Ver todos os usuários
SELECT 
  id_usuario, 
  nome_completo, 
  email, 
  tipo_usuario, 
  telefone 
FROM usuarios;

-- Ver todos os funcionários
SELECT * FROM funcionarios;

-- Ver todos os clientes
SELECT * FROM clientes;

-- Ver todos os pacotes
SELECT * FROM pacotes;
```

---

## 🔐 **Senhas (Hashadas com Bcrypt):**

**IMPORTANTE:** As senhas no banco estão **hashadas** (criptografadas):
```
admin123 → $2b$10$xK7Qr3nP2...  (hash bcrypt)
cliente123 → $2b$10$yL8Rs4oQ3...  (hash bcrypt)
```

**Você só usa a senha original** (`admin123` ou `cliente123`) **para fazer login**.

O backend compara automaticamente usando bcrypt! ✅

---

## 📝 **Resumo das Credenciais:**

| Tipo | Email | Senha | Nome |
|------|-------|-------|------|
| **Funcionário** | joao.silva@adacompany.com | admin123 | João Silva |
| **Cliente** | demo@empresa.com | cliente123 | Empresa Demo |

---

## 🎯 **Teste AGORA:**

### **1. No Swagger:**
```
http://localhost:3000/api
POST /auth/login
```

### **2. No App:**
Recarregue (`r` no Expo) e faça login!

---

## 💡 **Criar Novos Usuários:**

**Pelo App:**
1. Clique em "✨ Criar Nova Conta"
2. Preencha os dados
3. ✅ Será salvo no PostgreSQL!

**Pelo Swagger:**
Se houver endpoint de cadastro (verifique em `/clientes/cadastro`)

---

**Use as credenciais acima para testar! 🚀**

**Email:** `joao.silva@adacompany.com` ou `demo@empresa.com`  
**Senha:** `admin123` ou `cliente123`

