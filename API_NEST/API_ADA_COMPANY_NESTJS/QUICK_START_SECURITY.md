# 🚀 Guia Rápido - Aplicar Melhorias de Segurança

## Instalação das Dependências

### Opção 1: Instalação via npm (Recomendado)

```bash
cd backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS

# Instalar todas as dependências (incluindo as novas de segurança)
npm install
```

### Opção 2: Instalação manual das novas dependências

```bash
cd backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS

# Instalar apenas as novas dependências de segurança
npm install helmet @nestjs/throttler class-sanitizer
```

---

## Configuração do JWT_SECRET

### 1. Gerar um secret seguro:

#### No Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### No PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Resultado esperado:
```
4f8a2b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3
```

### 2. Criar arquivo .env:

```bash
# Copiar o exemplo
cp env.example .env

# Editar o .env e substituir os valores
```

### 3. Atualizar o .env com o secret gerado:

```env
# .env
JWT_SECRET=4f8a2b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3
DB_PASSWORD=sua_senha_forte_aqui
```

---

## Verificação da Instalação

### 1. Verificar se as dependências foram instaladas:

```bash
npm list helmet @nestjs/throttler class-sanitizer
```

**Resultado esperado:**
```
api-ada-company-nestjs@1.0.0
├── @nestjs/throttler@6.2.1
├── class-sanitizer@1.0.1
└── helmet@8.0.0
```

### 2. Compilar o projeto:

```bash
npm run build
```

**Resultado esperado:** Compilação sem erros

### 3. Iniciar o servidor de desenvolvimento:

```bash
npm run start:dev
```

**Resultado esperado:**
```
[Nest] 12345  - 21/10/2025 14:30:00     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 21/10/2025 14:30:00     LOG [InstanceLoader] AppModule dependencies initialized
...
Aplicação rodando na porta 3000
Documentação Swagger disponível em: http://localhost:3000/api
```

---

## Testes Rápidos

### 1. Testar Helmet (Headers de Segurança):

```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api -Method GET | Select-Object -ExpandProperty Headers

# Linux/Mac
curl -I http://localhost:3000/api
```

**Procure por headers de segurança:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy: ...`

### 2. Testar Rate Limiting:

```bash
# Fazer múltiplas requisições rapidamente
# Windows PowerShell
1..105 | ForEach-Object { Invoke-WebRequest -Uri http://localhost:3000/api -Method GET -UseBasicParsing }

# Linux/Mac
for i in {1..105}; do curl http://localhost:3000/api; done
```

**Resultado esperado:** Após 100 requisições, você deve receber:
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

### 3. Testar Sanitização de XSS:

```bash
# Tentar cadastrar um cliente com script no nome
curl -X POST http://localhost:3000/clientes/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "<script>alert(\"XSS\")</script>João Silva",
    "cnpj": "12.345.678/0001-90",
    "email": "joao@email.com",
    "telefone": "(11) 98765-4321",
    "senha": "senha123"
  }'
```

**Resultado esperado:** Nome sanitizado sem o script

### 4. Testar Validação de CNPJ:

```bash
# CNPJ inválido
curl -X POST http://localhost:3000/clientes/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "cnpj": "123456789",
    "email": "joao@email.com",
    "telefone": "(11) 98765-4321",
    "senha": "senha123"
  }'
```

**Resultado esperado:**
```json
{
  "statusCode": 400,
  "message": ["CNPJ inválido. Formato esperado: XX.XXX.XXX/XXXX-XX"],
  "error": "Bad Request"
}
```

### 5. Testar Controle de Acesso:

```bash
# 1. Login como cliente
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "cliente@email.com", "senha": "senha123"}' \
  | jq -r '.token')

# 2. Tentar acessar endpoint restrito a funcionários
curl -X GET http://localhost:3000/clientes \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "statusCode": 401,
  "message": "Acesso negado. Apenas funcionários podem acessar este recurso"
}
```

---

## Troubleshooting

### Problema: Erro ao compilar TypeScript

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problema: Helmet causa erro no Swagger

**Solução:** Já está configurado corretamente no `src/main.ts`:
```typescript
crossOriginEmbedderPolicy: false,
```

### Problema: Rate limiting muito restritivo

**Solução:** Ajustar limites em `src/app.module.ts`:
```typescript
ThrottlerModule.forRoot([{
  ttl: 60000,    // Aumentar janela de tempo
  limit: 200,    // Aumentar limite de requisições
}]),
```

### Problema: Sanitização remove dados válidos

**Solução:** Usar `@SanitizeBasic()` ao invés de `@Sanitize()`:
```typescript
@SanitizeBasic()  // Remove apenas tags perigosas
@IsString()
descricao: string;
```

---

## Rollback (se necessário)

### Reverter para versão anterior:

```bash
# 1. Desinstalar novas dependências
npm uninstall helmet @nestjs/throttler class-sanitizer

# 2. Reverter arquivos via Git
git checkout HEAD -- src/main.ts src/app.module.ts

# 3. Reinstalar dependências
npm install
```

---

## Próximos Passos

Após a instalação e testes:

1. ✅ Ler `docs/SECURITY.md` para entender todas as proteções
2. ✅ Revisar `CHANGELOG_SECURITY.md` para ver o que mudou
3. ✅ Seguir checklist de produção em `SECURITY_IMPROVEMENTS_SUMMARY.md`
4. ✅ Configurar HTTPS/TLS antes do deploy
5. ✅ Gerar JWT_SECRET único para produção

---

## Suporte

- **Documentação**: `docs/SECURITY.md`
- **Changelog**: `CHANGELOG_SECURITY.md`
- **Resumo**: `SECURITY_IMPROVEMENTS_SUMMARY.md`
- **Issues**: Abrir issue no repositório (exceto vulnerabilidades de segurança)

Para reportar vulnerabilidades: enviar email para [security@adacompany.com]

---

**✅ Pronto! Seu backend está protegido contra as principais vulnerabilidades.**

🔐 **Happy Coding!**


