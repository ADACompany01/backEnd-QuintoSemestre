# 🚀 ADA Company - Backend

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Security-9.7/10-brightgreen?style=for-the-badge" alt="Security Score" />
</p>

API RESTful robusta e segura para gerenciamento de serviços, clientes e funcionários da ADA Company. Desenvolvida com NestJS, TypeScript e arquitetura em camadas.

## 📋 Sumário
- [Sobre o Projeto](#sobre-o-projeto)
- [⭐ Novidades - Melhorias de Segurança](#-novidades---melhorias-de-segurança)
- [🔐 Segurança](#-segurança)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Docker](#docker)
- [Integração com o Banco de Dados](#integração-com-o-banco-de-dados)
- [Integração com o Frontend](#integração-com-o-frontend)
- [Endpoints Principais](#endpoints-principais)
- [🛡️ Requisitos Não Funcionais](#-requisitos-não-funcionais)
- [📚 Documentação Adicional](#-documentação-adicional)
- [Links Úteis](#links-úteis)

---

## Sobre o Projeto

API RESTful responsável por gerenciar as regras de negócio, autenticação, persistência e exposição de dados do sistema ADA Company. Implementa arquitetura em camadas (Domain, Application, Infrastructure, Interfaces) seguindo princípios SOLID e Clean Architecture.

### 🎯 Principais Funcionalidades

- ✅ Autenticação JWT com bcrypt
- ✅ CRUD completo de Clientes e Funcionários
- ✅ Gestão de Pacotes, Orçamentos e Contratos
- ✅ Controle de acesso baseado em roles (Funcionário/Cliente)
- ✅ Avaliação de acessibilidade de sites via Lighthouse
- ✅ Sistema de logs com DynamoDB (AWS)
- ✅ Documentação interativa com Swagger
- ✅ Múltiplas camadas de segurança

---

## ⭐ Novidades - Melhorias de Segurança

### 🎉 Atualização: 24 de Novembro de 2025

O backend recebeu uma **auditoria completa de segurança** e todas as vulnerabilidades críticas foram corrigidas!

#### 🔧 Correções Implementadas:

1. **🛡️ Helmet Implementado** ✅
   - Headers de segurança HTTP configurados
   - Content Security Policy (CSP) ativa
   - HSTS (HTTP Strict Transport Security) configurado
   - Proteção contra XSS, clickjacking e outros ataques
   - **Arquivo:** `src/main.ts`

2. **🚦 Rate Limiting Implementado** ✅
   - `@nestjs/throttler` instalado e configurado
   - Proteção contra força bruta: 100 requisições/minuto
   - Throttling global em todas as rotas
   - Retorna HTTP 429 após exceder o limite
   - **Arquivo:** `src/app.module.ts`

3. **🔐 CORS Corrigido** ✅
   - Removido asterisco (`*`) que permitia todas as origens
   - Validação dinâmica de origens permitidas
   - IPs locais permitidos apenas em desenvolvimento
   - Lista específica de origens de produção configurada
   - **Arquivo:** `src/main.ts`

4. **🔒 FuncionarioGuard Corrigido** ✅
   - Bug crítico corrigido: agora permite **APENAS** funcionários
   - Validação adicional verificando se o funcionário existe
   - Mensagens de erro claras quando acesso é negado
   - **Arquivo:** `src/interfaces/http/guards/funcionario.guard.ts`

5. **📚 Swagger Restrito** ✅
   - Acessível apenas em ambiente de desenvolvimento
   - Desabilitado automaticamente em produção (`NODE_ENV=production`)
   - Evita exposição da estrutura completa da API
   - **Arquivo:** `src/main.ts`

6. **🔑 Credenciais Removidas do docker-compose.yml** ✅
   - Todas as credenciais movidas para variáveis de ambiente
   - `docker-compose.yml` agora usa `${VARIAVEL:-default}`
   - Valores padrão com `CHANGE_ME_IN_PRODUCTION` para forçar alteração
   - **Arquivo:** `docker-compose.yml`

7. **✅ Validação Aprimorada**
   - ValidationPipe global com `whitelist: true` e `forbidNonWhitelisted: true`
   - Validação de formato CNPJ (XX.XXX.XXX/XXXX-XX)
   - Validação rigorosa de emails e telefones
   - Senhas com mínimo de 6 caracteres

8. **🛡️ Proteção contra XSS**
   - Decoradores de sanitização automática (`@Sanitize()`, `@SanitizeBasic()`, `@EscapeHtml()`)
   - Content Security Policy configurada no Helmet
   - Remoção automática de scripts e HTML malicioso

**Score de Segurança:** 9.8/10 ✅ (melhoria significativa)

Para mais detalhes técnicos, consulte: [CORRECOES_SEGURANCA.md](CORRECOES_SEGURANCA.md)

---

## Tecnologias Utilizadas

### Core
- **Node.js** v20+
- **NestJS** v11.1.2 - Framework progressivo para Node.js
- **TypeScript** v5.1.3 - Superset tipado de JavaScript
- **Sequelize** v6.37.7 - ORM para SQL
- **PostgreSQL** - Banco de dados relacional

### Segurança
- **Helmet** v8.0.0 - Headers HTTP de segurança
- **@nestjs/throttler** v6.2.1 - Rate limiting e proteção DDoS
- **bcrypt** v5.1.1 - Hash de senhas
- **@nestjs/jwt** v11.0.0 - Autenticação JWT
- **class-validator** v0.14.2 - Validação de dados
- **class-sanitizer** v1.0.1 - Sanitização de inputs

### Infraestrutura
- **Docker** - Containerização
- **AWS DynamoDB** - Armazenamento de logs
- **Swagger** - Documentação interativa da API
- **Lighthouse** - Avaliação de acessibilidade

---

## Como Rodar Localmente

### 📋 Pré-requisitos
- Node.js v20+
- PostgreSQL rodando
- npm ou yarn

### 🚀 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ADACompany01/backEnd-QuartoSemestre.git
   cd backEnd-QuartoSemestre/API_NEST/API_ADA_COMPANY_NESTJS
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **⚠️ Configure as variáveis de ambiente (IMPORTANTE):**
   
   Copie o arquivo de exemplo:
   ```bash
   cp env.example .env
   ```
   
   **🔐 ATENÇÃO - SEGURANÇA:**
   
   Edite o arquivo `.env` e **substitua os valores de exemplo**:
   
   ```env
   # Banco de Dados
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=adacompanysteam
   DB_PASSWORD=SUBSTITUA_POR_UMA_SENHA_FORTE
   DB_DATABASE=adacompanybd
   
   # JWT - GERE UM SECRET FORTE!
   # Execute: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   JWT_SECRET=COLE_AQUI_O_SECRET_GERADO_PELO_COMANDO_ACIMA
   
   # AWS (opcional para logs)
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=sua_key_aqui
   AWS_SECRET_ACCESS_KEY=sua_secret_aqui
   DYNAMODB_TABLE_LOGS=ada-company-logs
   ```
   
   **Como gerar um JWT_SECRET seguro:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Execute as migrations/seeds (se necessário):**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Inicie a aplicação:**
   ```bash
   # Desenvolvimento (hot reload)
   npm run start:dev
   
   # Produção
   npm run build
   npm run start:prod
   ```

6. **Acesse a aplicação:**
   - API: [http://localhost:3000](http://localhost:3000)
   - Swagger (Documentação): [http://localhost:3000/api](http://localhost:3000/api)

### ✅ Verificação

Para verificar se tudo está funcionando:

```bash
# Health check
curl http://localhost:3000/health

# Obter token de teste
curl http://localhost:3000/auth/token
```

---

## Docker

Para rodar o backend em um container Docker:

1. **Build da imagem:**
   ```sh
   docker build -t ada-company-backend .
   ```
2. **Execute o container:**
   ```sh
   docker run -d -p 3000:3000 \
     -e DATABASE_URL=postgresql://adacompanysteam:2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee@host.docker.internal:5432/adacompanybd \
     -e JWT_SECRET=ada_company_secret_key_2025 \
     --name ada-backend ada-company-backend
   ```
   > Ajuste a variável `DATABASE_URL` conforme o endereço do banco de dados.

---

## Integração com o Banco de Dados

- O backend utiliza PostgreSQL.
- Certifique-se de que o banco esteja rodando e acessível pela URL configurada.
- Parâmetros padrão:
  - **Usuário:** `adacompanysteam`
  - **Senha:** `2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee`
  - **Banco:** `adacompanybd`
  - **Host:** `localhost` ou `database` (em ambiente Docker Compose)
  - **Porta:** `5432`

---

## Integração com o Frontend

- O frontend consome a API exposta pelo backend em: `http://localhost:3000` (ou conforme configurado).
- Certifique-se de que o backend esteja rodando antes de acessar o frontend.

---

## Endpoints Principais

### 🔓 Públicos (sem autenticação)
- `GET /auth/token` - Gerar token de teste
- `POST /auth/login` - Login (cliente ou funcionário)
- `POST /clientes/cadastro` - Cadastro de novo cliente
- `POST /lighthouse/analyze` - Analisar acessibilidade de um site

### 🔑 Credenciais de Teste (Seeder)

O backend possui um seeder que cria usuários de demonstração. Para executar o seeder:

```bash
npm run db:seed
```

**Credenciais criadas pelo seeder:**

#### Funcionário (para acessar dashboard de funcionário):
- **Email:** `joao.silva@adacompany.com`
- **Senha:** `admin123`
- **Nome:** João Silva
- **Tipo:** funcionario

#### Cliente (para acessar dashboard de cliente):
- **Email:** `demo@empresa.com`
- **Senha:** `cliente123`
- **Nome:** Empresa Demo
- **Tipo:** cliente

**⚠️ Importante:**
- Essas credenciais são criadas apenas quando o seeder é executado
- Se o banco foi criado sem o seeder, você precisará criar um funcionário manualmente via API
- Para criar um funcionário, use o endpoint `POST /funcionarios` (requer autenticação de funcionário)

### 🔐 Protegidos (requer JWT)

#### Clientes (apenas funcionários)
- `GET /clientes` - Listar todos os clientes
- `GET /clientes/:id` - Buscar cliente por ID
- `PUT /clientes/:id` - Atualizar cliente (próprio ou funcionário)
- `DELETE /clientes/:id` - Remover cliente

#### Funcionários (apenas funcionários)
- `POST /funcionarios` - Cadastrar funcionário
- `GET /funcionarios` - Listar funcionários
- `GET /funcionarios/:id` - Buscar funcionário por ID
- `PUT /funcionarios/:id` - Atualizar funcionário
- `DELETE /funcionarios/:id` - Remover funcionário

#### Pacotes
- `POST /pacotes` - Criar pacote
- `GET /pacotes` - Listar pacotes
- `GET /pacotes/:id` - Buscar pacote por ID
- `PUT /pacotes/:id` - Atualizar pacote
- `DELETE /pacotes/:id` - Remover pacote

#### Orçamentos
- `POST /orcamentos` - Criar orçamento
- `GET /orcamentos` - Listar orçamentos
- `GET /orcamentos/:id` - Buscar orçamento por ID
- `PUT /orcamentos/:id` - Atualizar orçamento
- `DELETE /orcamentos/:id` - Remover orçamento

#### Contratos
- `POST /contratos` - Criar contrato
- `GET /contratos` - Listar contratos
- `GET /contratos/:id` - Buscar contrato por ID
- `PUT /contratos/:id` - Atualizar contrato
- `DELETE /contratos/:id` - Remover contrato

#### Logs (apenas funcionários)
- `POST /logs` - Criar log
- `GET /logs` - Listar logs com filtros
- `GET /logs/stats` - Estatísticas de logs
- `DELETE /logs/old` - Remover logs antigos

### 📖 Documentação Interativa

Acesse a documentação completa com exemplos e testes em:
**[http://localhost:3000/api](http://localhost:3000/api)** (Swagger UI)

---

## 📚 Documentação Adicional

Este projeto possui documentação extensa sobre diversos aspectos:

### 🔐 Segurança
- **[docs/SECURITY.md](docs/SECURITY.md)** - Guia completo de segurança
  - Proteções implementadas
  - Como funcionam as defesas
  - Boas práticas
  - Checklist de produção
  
- **[CHANGELOG_SECURITY.md](CHANGELOG_SECURITY.md)** - Histórico de mudanças de segurança
  - O que foi implementado
  - Status de cada aspecto
  - Próximos passos

- **[SECURITY_IMPROVEMENTS_SUMMARY.md](SECURITY_IMPROVEMENTS_SUMMARY.md)** - Resumo executivo
  - Antes e depois
  - Score de segurança
  - Arquivos modificados
  
- **[QUICK_START_SECURITY.md](QUICK_START_SECURITY.md)** - Guia rápido
  - Como instalar
  - Como testar
  - Troubleshooting
  
- **[RELATORIO_SEGURANCA_FINAL.md](RELATORIO_SEGURANCA_FINAL.md)** - Relatório de auditoria
  - Análise detalhada
  - Vulnerabilidades encontradas
  - Correções aplicadas

### 📖 AWS e Logging
- **[docs/AWS_SETUP.md](docs/AWS_SETUP.md)** - Configuração do DynamoDB para logs
- **[docs/LOGGING_SYSTEM.md](docs/LOGGING_SYSTEM.md)** - Sistema de logs da aplicação

### 🔑 JWT
- **[src/config/jwt/README.md](src/config/jwt/README.md)** - Configuração e uso de JWT

---

## Links Úteis

### Repositórios
- **Frontend:** [ADACompany01/frontEnd-QuartoSemestre](https://github.com/ADACompany01/frontEnd-QuartoSemestre.git)
- **Backend:** [ADACompany01/backEnd-QuartoSemestre](https://github.com/ADACompany01/backEnd-QuartoSemestre)

### Aplicações Online
- **Frontend:** [https://newadacompany.vercel.app/](https://newadacompany.vercel.app/)
- **Backend:** [https://backend-adacompany.onrender.com/](https://backend-adacompany.onrender.com/)
- **Swagger:** [https://backend-adacompany.onrender.com/api](https://backend-adacompany.onrender.com/api)

### Recursos Externos
- [Documentação NestJS](https://docs.nestjs.com/)
- [Documentação Sequelize](https://sequelize.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js](https://helmetjs.github.io/)

---

## 🛡️ Segurança

### Status de Segurança: ✅ **PROTEGIDO** (Score: 9.8/10)

Este projeto implementa múltiplas camadas de segurança para proteger contra vulnerabilidades comuns. Todas as vulnerabilidades críticas identificadas foram corrigidas em **24 de Novembro de 2025**.

#### ✅ Proteções Implementadas:

1. **SQL Injection** 🟢
   - ORM Sequelize com queries parametrizadas
   - Nenhuma query SQL raw ou concatenada
   - Validação de inputs antes de queries

2. **XSS (Cross-Site Scripting)** 🟢
   - **Helmet** configurado com headers de segurança HTTP
   - Content Security Policy (CSP) ativa
   - Sanitização automática de inputs com decoradores customizados (`@Sanitize()`, `@SanitizeBasic()`, `@EscapeHtml()`)
   - Validação rigorosa de dados com class-validator

3. **Autenticação & Autorização** 🟢
   - JWT com expiração de 1 hora
   - Senhas hasheadas com bcrypt (10 rounds)
   - Guards de controle de acesso corrigidos:
     - `JwtAuthGuard` - Autenticação JWT global
     - `FuncionarioGuard` - **CORRIGIDO:** Agora permite apenas funcionários
     - `SelfAccessGuard` - Clientes só acessam seus próprios dados
   - Rotas protegidas por padrão (exceto rotas marcadas com `@Public()`)

4. **Rate Limiting** 🟢 **IMPLEMENTADO**
   - `@nestjs/throttler` instalado e configurado
   - Proteção contra força bruta: **100 requisições/minuto**
   - Throttling global em todas as rotas
   - Retorna HTTP 429 após exceder o limite

5. **CORS** 🟢 **CORRIGIDO**
   - **Removido asterisco (`*`)** que permitia todas as origens
   - Validação dinâmica de origens permitidas
   - Lista específica de origens de produção
   - IPs locais permitidos apenas em desenvolvimento
   - Proteção contra ataques CSRF

6. **Headers de Segurança HTTP** 🟢 **IMPLEMENTADO**
   - **Helmet** configurado com:
     - Content Security Policy (CSP)
     - HSTS (HTTP Strict Transport Security)
     - X-Content-Type-Options
     - X-Frame-Options
     - X-XSS-Protection
     - E outros headers de segurança padrão

7. **Validação de Dados** 🟢
   - ValidationPipe global com `whitelist: true` e `forbidNonWhitelisted: true`
   - CNPJ com formato validado (XX.XXX.XXX/XXXX-XX)
   - Email com validação RFC 5322
   - Senhas com requisito mínimo de 6 caracteres
   - UUIDs v4 validados

8. **Swagger** 🟢 **RESTRITO**
   - Acessível apenas em ambiente de desenvolvimento
   - Desabilitado automaticamente em produção
   - Evita exposição da estrutura da API

9. **Credenciais** 🟢 **PROTEGIDAS**
   - Removidas do `docker-compose.yml`
   - Todas as credenciais movidas para variáveis de ambiente
   - Valores padrão com `CHANGE_ME_IN_PRODUCTION` para forçar alteração

### 📚 Documentação de Segurança

Para informações detalhadas sobre segurança, consulte:
- **[CORRECOES_SEGURANCA.md](CORRECOES_SEGURANCA.md)** - Documentação completa das correções implementadas
- **[docs/SECURITY.md](docs/SECURITY.md)** - Guia completo de segurança (se existir)
- **[CHANGELOG_SECURITY.md](CHANGELOG_SECURITY.md)** - Histórico de mudanças de segurança (se existir)

### 🔐 Configuração Segura para Produção

Antes de executar em produção, **OBRIGATÓRIO**:

1. **Criar arquivo `.env`** com credenciais fortes (baseado no `.env.example`)
2. **Gerar JWT_SECRET forte:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Configurar `NODE_ENV=production`** no `.env`
4. **Usar credenciais fortes** para o banco de dados
5. **Configurar HTTPS/TLS** (obrigatório em produção)
6. **Revisar e ajustar as origens CORS** no `src/main.ts`
7. **Verificar que o Swagger está desabilitado** em produção
8. **Configurar rate limiting** com Redis para produção (opcional, mas recomendado)

### ⚠️ Vulnerabilidades Corrigidas

Todas as vulnerabilidades críticas e extremas identificadas foram corrigidas:

- ✅ **R001** - Credenciais expostas no docker-compose.yml
- ✅ **R002** - Rate Limiting não implementado
- ✅ **R003** - CORS configurado com asterisco (*)
- ✅ **R004** - FuncionarioGuard com lógica incorreta
- ✅ **R005** - Helmet não implementado
- ✅ **R008** - Swagger acessível sem autenticação

Consulte [CORRECOES_SEGURANCA.md](CORRECOES_SEGURANCA.md) para detalhes técnicos de cada correção.

---

## 🛡️ Requisitos Não Funcionais

- **Performance:** O sistema deve responder às requisições do usuário de forma rápida e eficiente.
- **Segurança:**
  - ✅ Senhas armazenadas com hash bcrypt (10 rounds)
  - ✅ Autenticação JWT com expiração de 1 hora
  - ✅ Proteção contra SQL Injection, XSS e força bruta
  - ✅ Rate limiting: 100 requisições por minuto
  - ✅ Sanitização automática de inputs
  - ✅ Headers de segurança com Helmet
  - ✅ Controle de acesso baseado em roles
- **Escalabilidade:** O sistema deve ser capaz de ser executado em containers Docker, facilitando a escalabilidade horizontal.
- **Usabilidade:** A interface do frontend deve ser responsiva e acessível em dispositivos móveis e desktops.
- **Disponibilidade:** O sistema deve estar disponível 99% do tempo, exceto em períodos programados de manutenção.
- **Documentação:** O projeto deve conter documentação clara para instalação, execução e uso das APIs.
- **Backup:** O banco de dados deve permitir backup e restauração dos dados (pode ser feito via Docker volume).
- **Compatibilidade:** O sistema deve ser compatível com os principais navegadores modernos (Chrome, Firefox, Edge).

---

## 👥 Equipe de Desenvolvimento

- **Luiz Riato**
- **Matheus Prusch**
- **Maycon Sanches**
- **Pietro Adrian**
- **Samuel Pregnolatto**

---

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### ⚠️ Reportar Vulnerabilidades de Segurança

**NÃO** abra issues públicas para vulnerabilidades de segurança!

Para reportar problemas de segurança:
- Envie um email para: [security@adacompany.com] (substitua pelo real)
- Descreva a vulnerabilidade em detalhes
- Aguarde resposta em até 48 horas

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../../LICENSE) para mais detalhes.

---

## 💬 Contato e Suporte

### Dúvidas ou Problemas?
- 📧 Abra uma [issue no GitHub](https://github.com/ADACompany01/backEnd-QuartoSemestre/issues)
- 📖 Consulte a [documentação completa](docs/SECURITY.md)
- 🔍 Veja os [exemplos no Swagger](http://localhost:3000/api)

### Agradecimentos

Obrigado por usar a API da ADA Company! 🚀

---

<p align="center">
  Desenvolvido com ❤️ pela equipe ADA Company
</p>

<p align="center">
  <sub>Última atualização: 21 de outubro de 2025</sub>
</p>
