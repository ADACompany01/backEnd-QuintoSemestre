# 🗄️ Passo a Passo - Criar Banco no pgAdmin

## 📋 **Execute EXATAMENTE estes passos:**

---

### **1. Abra o pgAdmin 4**
- Pressione a tecla **Windows**
- Digite: `pgAdmin`
- Abra **pgAdmin 4**
- Aguarde carregar (pode pedir senha master - digite a senha que você configurou)

---

### **2. Localize o Servidor PostgreSQL**

No painel esquerdo você verá:
```
📁 Servers
  └── 🖥️ PostgreSQL 17
```

**Clique** em **PostgreSQL 17** para expandir

---

### **3. Abra o Query Tool**

Com **PostgreSQL 17** selecionado:
- **Menu superior:** Tools → Query Tool
- **OU** pressione: **Alt + Shift + Q**

Uma aba se abrirá com um editor SQL

---

### **4. Cole Este Código SQL**

No editor que abriu, cole **EXATAMENTE** este código:

```sql
-- Criar usuário adacompanysteam
CREATE USER adacompanysteam WITH PASSWORD '2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee';

-- Criar banco de dados
CREATE DATABASE adacompanybd OWNER adacompanysteam;

-- Dar todas as permissões
GRANT ALL PRIVILEGES ON DATABASE adacompanybd TO adacompanysteam;
```

---

### **5. Execute o SQL**

- **Clique no botão ▶ (Play/Execute)** na toolbar
- **OU** pressione **F5**

---

### **6. Verifique o Resultado**

No painel inferior (Messages), você deve ver:

```
CREATE ROLE
Query returned successfully in 52 msec.

CREATE DATABASE
Query returned successfully in 134 msec.

GRANT
Query returned successfully in 23 msec.
```

✅ **Se viu isso = SUCESSO TOTAL!**

---

### **7. Verifique que o Banco Foi Criado**

No painel esquerdo:
1. **Clique com botão direito em "Databases"**
2. **Refresh**
3. **Você deve ver:** `adacompanybd` na lista!

---

## ✅ **Banco Criado! Agora no Terminal:**

### **Passo 8: Rodar Migrations**

```bash
npm run db:migrate
```

**Aguarde ver:**
```
== 20240406000000-create-tables: migrating =======
== 20240406000000-create-tables: migrated (X.XXXs)
```

---

### **Passo 9: Rodar Seeders**

```bash
npm run db:seed
```

**Aguarde ver:**
```
== 20240406000000-demo-data: seeding =======
== 20240406000000-demo-data: seeded (X.XXXs)
```

---

### **Passo 10: Iniciar Backend**

```bash
npm run start:dev
```

**Aguarde ver:**
```
🚀 Aplicação rodando em: http://localhost:3000
📚 Documentação Swagger em: http://localhost:3000/api
```

---

## 🎉 **Pronto!**

Depois desses passos:
- ✅ Banco de dados configurado
- ✅ Tabelas criadas
- ✅ Dados iniciais populados
- ✅ Backend funcionando
- ✅ Pronto para usar!

---

## 🆘 **Se der erro "role already exists":**

Significa que o usuário já existe! **Isso é BOM!**

Execute apenas:
```sql
CREATE DATABASE adacompanybd OWNER adacompanysteam;
GRANT ALL PRIVILEGES ON DATABASE adacompanybd TO adacompanysteam;
```

---

## 🆘 **Se não conseguir abrir pgAdmin:**

**Me avise e eu crio o banco de outra forma!**

Opções alternativas:
- Via SQL Shell (psql)
- Via DBeaver
- Via comandos do terminal

---

**Vá lá executar e me avise como foi! 🚀**

