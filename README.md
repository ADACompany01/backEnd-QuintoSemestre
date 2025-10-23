<p align="center">
  <img src="assets/hero/AdaHome.png" alt="ADA Company Banner" width="600"/>
</p>

# ADA Company - Projeto Final

<p align="center">
  <a href="https://newadacompany-3drnxk22f-ada-companys-projects.vercel.app/"><img src="https://img.shields.io/badge/Frontend-Online-green" /></a>
  <a href="https://backend-adacompany.onrender.com/"><img src="https://img.shields.io/badge/Backend-Online-blue" /></a>
</p>

---

## 🗂️ Sumário

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Requisitos Funcionais](#requisitos-funcionais)
3. [Requisitos Não Funcionais](#requisitos-não-funcionais)
4. [Demonstração Visual](#demonstração-visual)
5. [Tecnologias Utilizadas](#tecnologias-utilizadas)
6. [Organização dos Repositórios](#organização-dos-repositórios)
7. [Como Executar](#como-executar)
8. [Integração e Entrega Contínua (CI/CD)](#integração-e-entrega-contínua-cicd)
9. [Documentação Docker](#documentação-docker)
10. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
11. [Documentação da API](#documentação-da-api)
12. [Exemplos de Integração](#exemplos-de-integração)
13. [Links das Aplicações Publicadas](#links-das-aplicações-publicadas)
14. [Integrantes](#integrantes)
15. [Licença](#licença)
16. [Referências e Suporte](#referências-e-suporte)

---

## ✨ Sobre o Projeto

Sistema completo para gestão de serviços, clientes e funcionários, com interface web moderna e API robusta. O sistema foi desenvolvido como projeto final do quinto semestre, utilizando arquitetura em camadas, containers Docker e API RESTful documentada.

---

## ✅ Requisitos Funcionais

**RF01 Cadastro de Usuários:** O sistema deve permitir o cadastro de novos usuários, diferenciando-os por tipos, como "cliente" e "funcionário".

**RF02 Autenticação e Autorização:** O sistema deve prover um mecanismo de login seguro para autenticação de usuários e controlar o acesso às funcionalidades com base no tipo e permissões do usuário logado.

**RF03 Gestão de Serviços:** O sistema deve permitir que usuários autorizados realizem o cadastro, a consulta, a edição e a exclusão dos serviços oferecidos pela empresa.

**RF04 Gestão de Clientes:** O sistema deve permitir que usuários autorizados realizem o cadastro, a consulta, a edição e a exclusão de clientes na plataforma.

**RF05 Gestão de Funcionários:** O sistema deve permitir que usuários com privilégios de administrador realizem o cadastro, a consulta, a edição e a exclusão de funcionários.

**RF06 Solicitação de Orçamento:** O sistema deve permitir que clientes submetam solicitações de orçamento detalhando suas necessidades.

**RF07 Dashboard de Indicadores:** O sistema deve apresentar um painel principal (dashboard) para usuários autenticados com um resumo visual das principais informações, como quantidade de clientes, total de serviços e status dos orçamentos.

**RF08 Comunicação via API:** O sistema deve garantir que todas as operações de criação, leitura, atualização e exclusão (CRUD) de dados realizadas no frontend sejam processadas através de chamadas à API do backend.

**RF09 Acompanhamento de Status:** O sistema deve exibir, em uma área dedicada no frontend, o status atualizado dos pedidos e orçamentos do cliente logado.

**RF10 Análise de Acessibilidade de URL:** O sistema deve fornecer uma funcionalidade onde o cliente pode submeter uma URL para receber uma avaliação automatizada do nível de acessibilidade do site correspondente.

**RF11 Aprovação e Rejeição de Orçamentos:** O sistema deve permitir que funcionários com a devida permissão alterem o status de um orçamento para "Aprovado" ou "Rejeitado".

**RF12 Histórico de Orçamentos:** O sistema deve registrar e exibir para o cliente o histórico de todas as alterações de status de seus orçamentos, incluindo a data e a hora de cada mudança.

**RF13 Exportação de Orçamento:** O sistema deve prover a funcionalidade de exportar os detalhes de um orçamento em formato PDF.

**RF14 Anexo de imagens:** O sistema deve permitir que usuários (clientes e funcionários) realizem o upload de imagens e os associem aos seus perfis.

**RF15 Visualização de Anexos:** O sistema deve permitir a pré-visualização de arquivos anexados (como imagens e PDFs) diretamente na interface do navegador, sem a necessidade de download.

---

## ⚙️ Requisitos Não Funcionais

**RNF01 Desempenho da API:** O sistema deve responder às requisições da API em até 10 segundos, sob carga normal de usuários.

**RNF02 Desempenho do Frontend:** O frontend deve carregar a interface principal (dashboard) em no máximo 10 segundos após o login.

**RNF03 Escalabilidade:** O sistema deve ser projetado de forma modular, permitindo futura expansão para novos serviços, integrações e aumento do número de usuários.

**RNF04 Segurança de Senhas:** As senhas dos usuários devem ser armazenadas com hash (ex: bcrypt).

**RNF05 Segurança de Comunicação:** O sistema deve utilizar HTTPS para garantir a comunicação segura entre frontend e backend.

**RNF06 Segurança de Autenticação:** A autenticação deve ser feita via JWT (JSON Web Token) ou outro método seguro.

**RNF07 Controle de Acesso:** Deve haver controle de permissões conforme o tipo de usuário (cliente, funcionário, administrador, etc.).

**RNF08 Manutenibilidade:** O código deve ser escrito de forma clara, com comentários, documentação e boas práticas de programação para facilitar futuras manutenções.

**RNF09 Arquitetura:** O sistema deve seguir padrões de arquitetura como MVC ou Clean Architecture (dependendo da stack).

**RNF10 Usabilidade e Responsividade:** A interface do usuário deve ser intuitiva, responsiva e acessível em diferentes dispositivos (computador, tablet, celular).

**RNF11 Acessibilidade:** A interface deve seguir princípios de design acessível, com atenção a contraste, tamanho de fonte e navegação por teclado.

**RNF12 Confiabilidade e Diagnóstico:** Deve haver mensagens claras de erro para o usuário final e logs detalhados para análise por desenvolvedores.

**RNF13 Compatibilidade:** O sistema deve ser compatível com os principais sistemas Android.

**RNF14 Portabilidade:** O backend deve poder ser executado em ambientes Linux e containers Docker.
    
**RNF15 Hospedagem e Infraestrutura:** O sistema deve ser implantado e hospedado na nuvem utilizando os serviços da AWS (Amazon Web Services), garantindo escalabilidade, disponibilidade e gerenciamento de recursos.

---

## 🖼️ Demonstração Visual

<p align="center">
  <img src="assets/hero/heroImage.png" alt="Tela Inicial" width="400"/>
  <img src="assets/about/aboutImage.png" alt="Sobre o Projeto" width="400"/>
</p>

<p align="center">
  <img src="assets/cards/site-idosos.jpg" alt="Card Idosos" width="250"/>
  <img src="assets/cards/site-infantil.jpg" alt="Card Infantil" width="250"/>
  <img src="assets/cards/site-acessibilidade.jpg" alt="Card Acessibilidade" width="250"/>
</p>

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React Native + Expo, TypeScript, SQLite
- **Backend:** NestJS, TypeScript, Sequelize, JWT, Swagger
- **Banco de Dados:** PostgreSQL + DynamoDB + SQLite
- **Infraestrutura:** Docker, Docker Compose
- **Ferramentas:** Git, GitHub, AWS, Render

---

## 🗃️ Organização dos Repositórios

- [Repositório Backend](https://github.com/ADACompany01/backEnd-QuintoSemestre)
- [Repositório Frontend](https://github.com/ADACompany01/frontEnd-QuintoSemestre)

Estrutura de pastas principal:

```
Projetos/
├── backEnd-QuintoSemestre/
│   └── API_NEST/
│       └── API_ADA_COMPANY_NESTJS/
│           ├── docker-compose.yml
│           ├── dockerfile
│           └── src/
└── frontEnd-QuintoSemestre/
    ├── components/
    ├── controllers/
    ├── models/
    ├── services/
    └── views/
```

---

## 📦 Como Executar

Para rodar o sistema completo localmente (frontend, backend e banco de dados), basta usar o docker-compose já configurado no backend:

1. **Clone os repositórios:**
   ```sh
   git clone https://github.com/ADACompany01/backEnd-QuintoSemestre.git
   git clone https://github.com/ADACompany01/frontEnd-QuintoSemestre.git
   ```
2. **Navegue até a pasta do docker-compose:**
   ```sh
   cd backEnd-QuintoSemestre/API_NEST/API_ADA_COMPANY_NESTJS
   ```
3. **Suba todos os containers:**
   ```sh
   docker-compose up --build
   ```

- O backend (Swagger) estará em: [http://localhost:3000/api](http://localhost:3000/api)

> **Observação:**
> - Não é necessário criar arquivos `.env` para rodar via Docker, pois todas as variáveis já estão no `docker-compose.yml`.
> - O compose já está ajustado para facilitar o uso local.

---

## 🚦 Integração e Entrega Contínua (CI/CD)

O projeto utiliza um pipeline automatizado com GitHub Actions para o backend, localizado em `.github/workflows/ci-backend.yml`.

**Principais etapas automatizadas:**
- Instalação de dependências do backend
- Execução de testes automatizados (placeholder, pode ser expandido)
- Build do código backend
- Versionamento semântico automático e criação de tags
- Build e push de imagens Docker do backend para o Docker Hub
- Deploy automático do backend no Render
- Notificações por e-mail em caso de falha
- Uso de secrets para credenciais sensíveis
- Cache de build para acelerar execuções

**Resumo do fluxo:**
1. Build, teste, versionamento e publicação da imagem Docker do backend.
2. Deploy automático do backend no Render ao criar uma nova versão.
3. Notificações automáticas por e-mail em caso de falha em qualquer etapa.

Para mais detalhes, consulte o arquivo de workflow `.github/workflows/ci-backend.yml` no repositório.

---

## 🐳 Documentação Docker

O arquivo `docker-compose.yml` já está pronto para uso local. Basta seguir o passo a passo acima para rodar tudo localmente.

### Docker Compose

O arquivo `docker-compose.yml` configura os serviços principais:

```yaml
services:
  database:
    build: ../../database/postgres
    container_name: ada-postgres-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: adacompanysteam
      POSTGRES_PASSWORD: 2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee
      POSTGRES_DB: adacompanybd
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./database/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    build:
      context: .
      dockerfile: dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://adacompanysteam:2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee@database:5432/adacompanybd
      JWT_SECRET: "ada_company_secret_key_2025"
    depends_on:
      database:
        condition: service_healthy
```

### Dockerfile Backend

```dockerfile
# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY . .
RUN npm install
RUN npm run build
# Etapa 2: imagem final
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist/src ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

#### Comandos Docker Úteis

```sh
docker-compose ps
docker-compose logs
docker-compose down
docker-compose up -d --build --force-recreate
docker exec -it ada-postgres-db psql -U adacompanysteam -d adacompanybd
docker exec ada-postgres-db pg_dump -U adacompanysteam adacompanybd > backup.sql
```

---

## 🗄️ Estrutura do Banco de Dados

```
usuarios
├── id_usuario (UUID, PK)
├── email (STRING, UNIQUE)
└── senha (STRING)

clientes
├── id_cliente (UUID, PK)
├── nome_completo (STRING)
├── cnpj (STRING, UNIQUE)
├── telefone (STRING)
├── email (STRING, UNIQUE)
└── id_usuario (UUID, FK -> usuarios)

funcionarios
├── id_funcionario (UUID, PK)
├── nome_completo (STRING)
├── email (STRING, UNIQUE)
├── telefone (STRING)
└── id_usuario (UUID, FK -> usuarios)

pacotes
├── id_pacote (UUID, PK)
├── id_cliente (UUID, FK -> clientes)
├── tipo_pacote (STRING) - A, AA, AAA
└── valor_base (DECIMAL)

orcamentos
├── cod_orcamento (UUID, PK)
├── valor_orcamento (DECIMAL)
├── data_orcamento (DATE)
├── data_validade (DATE)
└── id_pacote (UUID, FK -> pacotes)

contratos
├── id_contrato (UUID, PK)
├── valor_contrato (DECIMAL)
├── cod_orcamento (UUID, FK -> orcamentos)
├── status_contrato (STRING) - EM_ANALISE, EM_ANDAMENTO, CANCELADO, CONCLUIDO
├── data_inicio (DATE)
└── data_entrega (DATE)
```

Relacionamentos:
- **usuarios** ↔ **clientes** (1:1)
- **usuarios** ↔ **funcionarios** (1:1)
- **clientes** ↔ **pacotes** (1:N)
- **pacotes** ↔ **orcamentos** (1:1)
- **orcamentos** ↔ **contratos** (1:1)

---

## 📋 Documentação da API

A API RESTful foi desenvolvida utilizando NestJS e oferece endpoints para todas as funcionalidades do sistema. A documentação completa está disponível via Swagger na URL `/docs` quando o servidor estiver rodando.

Principais endpoints:
- `GET /auth/token` - Obter token de teste
- `POST /auth/login` - Login de usuário
- `POST /clientes/cadastro` - Cadastrar cliente (público)
- `GET /clientes` - Listar clientes (funcionários)
- `POST /pacotes` - Criar pacote
- `POST /orcamentos` - Criar orçamento
- `POST /contratos` - Criar contrato

Veja a lista completa e exemplos na seção seguinte.

---

## 🔌 Exemplos de Integração

### Autenticação

```bash
GET /auth/token
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

```bash
POST /auth/login
Content-Type: application/json
{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

### Clientes

```bash
POST /clientes/cadastro
Content-Type: application/json
{
  "nome_completo": "Empresa ABC Ltda",
  "cnpj": "12.345.678/0001-90",
  "telefone": "(11) 99999-9999",
  "email": "contato@empresaabc.com"
}
```

### Pacotes

```bash
POST /pacotes
Authorization: Bearer <token>
Content-Type: application/json
{
  "id_cliente": "uuid-do-cliente",
  "tipo_pacote": "AA",
  "valor_base": 1500.00
}
```

### Orçamentos

```bash
POST /orcamentos
Authorization: Bearer <token>
Content-Type: application/json
{
  "valor_orcamento": 2000.00,
  "data_orcamento": "2023-10-26T10:00:00Z",
  "data_validade": "2023-11-26T10:00:00Z",
  "id_pacote": "uuid-do-pacote"
}
```

### Contratos

```bash
POST /contratos
Authorization: Bearer <token>
Content-Type: application/json
{
  "valor_contrato": 2000.00,
  "cod_orcamento": "uuid-do-orcamento",
  "status_contrato": "EM_ANALISE",
  "data_inicio": "2023-10-26T10:00:00Z",
  "data_entrega": "2023-12-26T10:00:00Z"
}
```

---

## 🌐 Links das Aplicações Publicadas

- **Frontend:** [https://newadacompany.vercel.app/](https://newadacompany.vercel.app/)
- **Backend:** [https://backend-adacompany.onrender.com/api](https://backend-adacompany.onrender.com/api)

---

## 👥 Integrantes

- Luiz Riato
- Matheus Prusch
- Maycon Sanches
- Pietro Adrian
- Samuel Pregnolatto

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 📚 Referências e Suporte

- [Documentação React](https://react.dev/)
- [Documentação NestJS](https://nestjs.com/)
- [Documentação PostgreSQL](https://www.postgresql.org/)
- [Documentação Docker](https://www.docker.com/)
- [Swagger](https://swagger.io/)

Para dúvidas ou problemas:
- Abra uma issue no repositório correspondente
- Entre em contato com a equipe de desenvolvimento
- Consulte a documentação da API em `/docs` (Swagger)
