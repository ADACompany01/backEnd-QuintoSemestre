# 🔐 Documentação de Segurança - ADA Company Backend

## Visão Geral

Este documento descreve todas as medidas de segurança implementadas no backend da ADA Company para proteger contra vulnerabilidades comuns como SQL Injection, XSS, ataques de força bruta e acesso não autorizado.

---

## ✅ 1. Proteção contra SQL Injection

### Status: **PROTEGIDO**

### Implementação:
- **ORM Sequelize**: Todas as queries ao banco de dados utilizam o Sequelize ORM
- **Prepared Statements**: Queries parametrizadas automaticamente
- **Nenhuma query raw**: Não há SQL concatenado manualmente no código

### Exemplo de uso seguro:
```typescript
// ❌ ERRADO (vulnerável a SQL injection)
await sequelize.query(`SELECT * FROM usuarios WHERE email = '${email}'`);

// ✅ CORRETO (protegido)
await Usuario.findOne({ where: { email } });
```

### Arquivos relevantes:
- `src/infrastructure/database/repositories/*.repository.ts`

---

## ✅ 2. Proteção contra XSS (Cross-Site Scripting)

### Status: **PROTEGIDO**

### Implementações:

#### 2.1 Helmet
Pacote de segurança que adiciona headers HTTP de proteção:
- `X-DNS-Prefetch-Control`
- `X-Frame-Options` (proteção contra clickjacking)
- `X-Content-Type-Options` (proteção contra MIME sniffing)
- `Content-Security-Policy` (CSP)
- E mais...

**Configuração**: `src/main.ts`
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

#### 2.2 Sanitização de Inputs
Decoradores customizados que removem tags HTML e scripts maliciosos dos inputs do usuário.

**Decoradores disponíveis**:
- `@Sanitize()`: Remove todas as tags HTML e scripts
- `@SanitizeBasic()`: Remove apenas tags perigosas (script, iframe, object, embed)
- `@EscapeHtml()`: Escapa caracteres especiais HTML

**Localização**: `src/interfaces/http/decorators/sanitize.decorator.ts`

**Exemplo de uso**:
```typescript
export class CreateClienteDto {
  @Sanitize()
  @IsString()
  @IsNotEmpty()
  nome_completo: string;
}
```

#### 2.3 Validação de Inputs
Uso do `class-validator` com `ValidationPipe` global:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // Remove propriedades não declaradas
  forbidNonWhitelisted: true, // Rejeita requisições com propriedades extras
  transform: true,            // Transforma tipos automaticamente
}));
```

### Arquivos relevantes:
- `src/main.ts`
- `src/interfaces/http/decorators/sanitize.decorator.ts`
- `src/interfaces/http/dtos/requests/*.dto.ts`

---

## ✅ 3. Autenticação JWT

### Status: **IMPLEMENTADO**

### Características:
- **Algoritmo**: HMAC SHA256 (HS256)
- **Expiração**: 1 hora
- **Secret**: Configurável via variável de ambiente
- **Validação**: Em cada requisição não pública

### Fluxo de autenticação:
1. Usuário faz login com email e senha
2. Senha é comparada com hash bcrypt armazenado
3. Se válido, JWT é gerado com payload contendo `id_usuario`, `email` e `tipo_usuario`
4. Cliente envia JWT no header `Authorization: Bearer <token>`
5. `JwtAuthGuard` valida o token em cada requisição

### Hash de senhas:
- **Algoritmo**: bcrypt
- **Rounds**: 10 (2^10 iterações)
- **Armazenamento**: Apenas o hash é armazenado, nunca a senha em texto plano

### Rotas públicas:
Use o decorador `@Public()` para rotas que não requerem autenticação:
```typescript
@Public()
@Post('login')
async login(@Body() body: { email: string; senha: string }) {
  // ...
}
```

### Arquivos relevantes:
- `src/application/auth/auth.service.ts`
- `src/application/auth/strategies/jwt.strategy.ts`
- `src/interfaces/http/guards/jwt-auth.guard.ts`
- `src/interfaces/http/decorators/public.decorator.ts`

---

## ✅ 4. Controle de Acesso (Authorization)

### Status: **IMPLEMENTADO**

### Guards disponíveis:

#### 4.1 JwtAuthGuard (Global)
- Aplicado automaticamente a todas as rotas
- Verifica se o token JWT é válido
- Extrai informações do usuário do token

#### 4.2 FuncionarioGuard
- Permite acesso **APENAS** para funcionários
- Verifica se `tipo_usuario === 'funcionario'`
- Valida se o funcionário existe no repositório

**Uso**:
```typescript
@UseGuards(FuncionarioGuard)
@Get()
async findAll() {
  // Apenas funcionários podem acessar
}
```

#### 4.3 SelfAccessGuard
- Permite funcionários acessarem qualquer recurso
- Permite clientes acessarem **apenas seus próprios dados**
- Compara `id_usuario` do token com `id_usuario` do recurso

**Uso**:
```typescript
@UseGuards(SelfAccessGuard)
@Put(':id')
async update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
  // Funcionário pode atualizar qualquer cliente
  // Cliente pode atualizar apenas seus próprios dados
}
```

### Matriz de controle de acesso:

| Recurso | Funcionário | Cliente | Público |
|---------|-------------|---------|---------|
| GET /clientes | ✅ | ❌ | ❌ |
| GET /clientes/:id | ✅ | ❌ | ❌ |
| POST /clientes/cadastro | ✅ | ✅ | ✅ |
| PUT /clientes/:id | ✅ | ✅ (próprio) | ❌ |
| DELETE /clientes/:id | ✅ | ❌ | ❌ |
| POST /auth/login | ✅ | ✅ | ✅ |

### Arquivos relevantes:
- `src/interfaces/http/guards/jwt-auth.guard.ts`
- `src/interfaces/http/guards/funcionario.guard.ts`
- `src/interfaces/http/guards/self-access.guard.ts`

---

## ✅ 5. Rate Limiting (Proteção contra Força Bruta)

### Status: **IMPLEMENTADO**

### Configuração:
- **Biblioteca**: `@nestjs/throttler`
- **TTL (Time to Live)**: 60 segundos
- **Limite**: 100 requisições por janela de tempo
- **Aplicação**: Global (todas as rotas)

### Comportamento:
- Usuário pode fazer 100 requisições em 60 segundos
- Após o limite, recebe HTTP 429 (Too Many Requests)
- Após 60 segundos, o contador é resetado

### Configuração customizada por rota:
```typescript
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Post('login')
async login() {
  // Limite mais restritivo para login: 10 requisições/minuto
}
```

### Arquivos relevantes:
- `src/app.module.ts`

---

## ✅ 6. CORS (Cross-Origin Resource Sharing)

### Status: **CONFIGURADO**

### Configuração:
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://newadacompany.vercel.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

### Origens permitidas:
- `http://localhost:3000` (desenvolvimento)
- `https://newadacompany.vercel.app` (produção)

⚠️ **Importante**: Adicione apenas origens confiáveis

### Arquivos relevantes:
- `src/main.ts`

---

## ✅ 7. Validação de Dados

### Status: **IMPLEMENTADO**

### Validações implementadas:

#### CNPJ
- Formato: `XX.XXX.XXX/XXXX-XX`
- Regex: `/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/`
- Mensagem de erro: "CNPJ inválido. Formato esperado: XX.XXX.XXX/XXXX-XX"

#### Email
- Validador do `class-validator`
- Verifica formato RFC 5322

#### Senha
- Mínimo: 6 caracteres
- Recomendado: Implementar requisitos adicionais (maiúsculas, números, símbolos)

#### UUID
- Versão 4
- Validação automática para IDs de recursos

### Arquivos relevantes:
- `src/interfaces/http/dtos/requests/*.dto.ts`

---

## 🔧 Configuração de Variáveis de Ambiente

### JWT_SECRET
⚠️ **CRÍTICO**: Nunca use valores de exemplo em produção!

**Como gerar um secret seguro**:
```bash
# No terminal (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Resultado exemplo:
# 4f8a2b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3
```

### Boas práticas:
1. **Nunca comite** `.env` em repositórios
2. Use **secrets diferentes** para dev, test e prod
3. **Rotacione** secrets regularmente
4. Use **gestores de secrets** em produção (AWS Secrets Manager, Azure Key Vault, etc.)

### Arquivos relevantes:
- `env.example`

---

## 📋 Checklist de Segurança

### Desenvolvimento
- [x] Validar todos os inputs com DTOs
- [x] Usar ORM para queries ao banco
- [x] Hash de senhas com bcrypt
- [x] Sanitizar strings de entrada
- [x] Implementar autenticação JWT
- [x] Configurar CORS adequadamente
- [x] Adicionar rate limiting
- [x] Usar Helmet para headers de segurança

### Deploy em Produção
- [ ] Gerar novo JWT_SECRET forte e aleatório
- [ ] Usar credenciais fortes para o banco de dados
- [ ] Configurar HTTPS (TLS/SSL)
- [ ] Restringir origens CORS apenas para domínios de produção
- [ ] Configurar logging e monitoramento
- [ ] Implementar backup regular do banco
- [ ] Testar todos os endpoints com ferramentas de segurança (OWASP ZAP, Burp Suite)
- [ ] Implementar rotação automática de secrets
- [ ] Configurar firewall e security groups adequadamente
- [ ] Habilitar auditoria de acesso

---

## 🚨 Incidentes de Segurança

Se você descobrir uma vulnerabilidade de segurança, **NÃO** abra uma issue pública.

### Processo de reporte:
1. Envie um email para: [security@adacompany.com] (substitua pelo real)
2. Descreva a vulnerabilidade em detalhes
3. Inclua passos para reproduzir
4. Aguarde resposta em até 48 horas

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/helmet)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Helmet.js](https://helmetjs.github.io/)

---

## 📝 Atualizações

| Data | Versão | Descrição |
|------|--------|-----------|
| 2025-10-21 | 1.0.0 | Implementação inicial de todas as medidas de segurança |

---

**Última atualização**: 21 de outubro de 2025  
**Responsável**: Equipe de Desenvolvimento ADA Company


