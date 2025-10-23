# Sistema de Logs - ADA Company API

## Visão Geral

O sistema de logs da ADA Company API foi implementado utilizando Amazon DynamoDB para armazenamento e oferece funcionalidades completas de logging, monitoramento e análise de logs da aplicação. O DynamoDB foi escolhido por sua integração nativa com AWS, escalabilidade automática e performance otimizada para aplicações cloud.

## Arquitetura

### Componentes Principais

1. **Amazon DynamoDB**: Banco de dados NoSQL gerenciado pela AWS para armazenamento dos logs
2. **AWS SDK**: SDK oficial da AWS para integração com DynamoDB
3. **LoggingService**: Serviço principal para criação de logs
4. **LogController**: API REST para consulta e gerenciamento de logs
5. **Interceptors**: Logging automático de requisições HTTP
6. **Exception Filters**: Logging automático de erros

### Estrutura de Dados

```typescript
interface LogModel {
  id: string; // Partition Key (PK)
  timestamp: string; // Sort Key (SK) - ISO string format
  level: LogLevel; // error, warn, info, debug, verbose
  message: string;
  context?: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  metadata?: Record<string, any>;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}
```

### Estrutura da Tabela DynamoDB

**Nome da Tabela**: `ada-company-logs`

**Chaves**:
- **Partition Key (PK)**: `id` (String) - UUID único do log
- **Sort Key (SK)**: `timestamp` (String) - Timestamp em formato ISO

**Atributos**:
- `level` (String) - Nível do log
- `message` (String) - Mensagem do log
- `context` (String, opcional) - Contexto do log
- `userId` (String, opcional) - ID do usuário
- `userEmail` (String, opcional) - Email do usuário
- `ipAddress` (String, opcional) - Endereço IP
- `userAgent` (String, opcional) - User Agent
- `method` (String, opcional) - Método HTTP
- `url` (String, opcional) - URL da requisição
- `statusCode` (Number, opcional) - Código de status HTTP
- `responseTime` (Number, opcional) - Tempo de resposta em ms
- `metadata` (Map, opcional) - Metadados adicionais
- `createdAt` (String) - Data de criação
- `updatedAt` (String) - Data de atualização

## Configuração

### AWS DynamoDB

O sistema utiliza Amazon DynamoDB como banco de dados para logs. Para usar em produção, você precisa:

1. **Criar uma tabela no DynamoDB**:
   - Nome: `ada-company-logs`
   - Partition Key: `id` (String)
   - Sort Key: `timestamp` (String)
   - Modo: On-demand (recomendado para logs)

2. **Configurar permissões IAM**:
   - Criar um usuário IAM com políticas para DynamoDB
   - Políticas necessárias: `dynamodb:PutItem`, `dynamodb:GetItem`, `dynamodb:Query`, `dynamodb:Scan`, `dynamodb:BatchWriteItem`

### Variáveis de Ambiente

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DYNAMODB_TABLE_LOGS=ada-company-logs
```

### Docker Compose (Desenvolvimento)

Para desenvolvimento local, o DynamoDB Local pode ser usado:

```yaml
backend:
  environment:
    AWS_REGION: "us-east-1"
    AWS_ACCESS_KEY_ID: "fake-access-key"
    AWS_SECRET_ACCESS_KEY: "fake-secret-key"
    DYNAMODB_TABLE_LOGS: "ada-company-logs"
    # Para DynamoDB Local
    DYNAMODB_ENDPOINT: "http://dynamodb-local:8000"
```

## Uso

### 1. Logging Manual

```typescript
import { LoggingService } from '../application/services/logging.service';

@Injectable()
export class MeuService {
  constructor(
    @Inject('LoggingService')
    private readonly loggingService: LoggingService,
  ) {}

  async minhaOperacao() {
    try {
      // Sua lógica aqui
      await this.loggingService.info('Operação realizada com sucesso', 'MeuService');
    } catch (error) {
      await this.loggingService.error('Erro na operação', 'MeuService', { error: error.message });
    }
  }
}
```

### 2. Logging de Requisições HTTP

O sistema automaticamente loga todas as requisições HTTP através do `LoggingInterceptor`:

- Método HTTP
- URL
- Status code
- Tempo de resposta
- IP do cliente
- User Agent
- Informações do usuário (se autenticado)

### 3. Logging de Erros

O `LoggingExceptionFilter` automaticamente captura e loga todas as exceções não tratadas.

### 4. Paginação com DynamoDB

O DynamoDB utiliza `LastEvaluatedKey` para paginação:

```typescript
// Primeira requisição
const result = await logService.list({ limit: 50 });

// Próxima página
const nextPage = await logService.list({ 
  limit: 50, 
  lastEvaluatedKey: result.lastEvaluatedKey 
});
```

## API Endpoints

### Criar Log
```http
POST /logs
Content-Type: application/json
Authorization: Bearer <token>

{
  "level": "info",
  "message": "Mensagem do log",
  "context": "MeuService",
  "metadata": { "key": "value" }
}
```

### Listar Logs
```http
GET /logs?level=error&limit=50&lastEvaluatedKey=eyJpZCI6InNvbWUtaWQiLCJ0aW1lc3RhbXAiOiIyMDI0LTAxLTAxVDAwOjAwOjAwLjAwMFoifQ==
Authorization: Bearer <token>
```

**Resposta**:
```json
{
  "logs": [...],
  "lastEvaluatedKey": "eyJpZCI6Im5leHQtaWQiLCJ0aW1lc3RhbXAiOiIyMDI0LTAxLTAxVDAwOjAwOjAwLjAwMFoifQ=="
}
```

### Obter Estatísticas
```http
GET /logs/stats
Authorization: Bearer <token>
```

### Logs por Usuário
```http
GET /logs/user/{userId}?limit=20&lastEvaluatedKey=...
Authorization: Bearer <token>
```

### Logs por Nível
```http
GET /logs/level/error?limit=20&lastEvaluatedKey=...
Authorization: Bearer <token>
```

### Logs por Intervalo de Data
```http
GET /logs/date-range?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z&limit=50
Authorization: Bearer <token>
```

### Obter Log Específico
```http
GET /logs/{id}?timestamp=2024-01-01T00:00:00.000Z
Authorization: Bearer <token>
```

### Deletar Logs Antigos
```http
POST /logs/cleanup
Content-Type: application/json
Authorization: Bearer <token>

{
  "olderThan": "2024-01-01T00:00:00.000Z"
}
```

## Níveis de Log

- **ERROR**: Erros críticos que requerem atenção imediata
- **WARN**: Avisos sobre situações que podem causar problemas
- **INFO**: Informações gerais sobre o funcionamento da aplicação
- **DEBUG**: Informações detalhadas para debugging
- **VERBOSE**: Informações muito detalhadas

## Índices DynamoDB

Para otimizar consultas no DynamoDB, considere criar Global Secondary Indexes (GSI):

### GSI Recomendados:

1. **GSI-Level-Timestamp**:
   - Partition Key: `level`
   - Sort Key: `timestamp`
   - Uso: Consultas por nível de log

2. **GSI-Context-Timestamp**:
   - Partition Key: `context`
   - Sort Key: `timestamp`
   - Uso: Consultas por contexto

3. **GSI-User-Timestamp**:
   - Partition Key: `userId`
   - Sort Key: `timestamp`
   - Uso: Consultas por usuário

### Comando AWS CLI para criar GSI:

```bash
aws dynamodb update-table \
  --table-name ada-company-logs \
  --attribute-definitions \
    AttributeName=level,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --global-secondary-index-updates \
    '[{
      "Create": {
        "IndexName": "level-timestamp-index",
        "KeySchema": [
          {"AttributeName": "level", "KeyType": "HASH"},
          {"AttributeName": "timestamp", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      }
    }]'
```

## Monitoramento e Alertas

### Estatísticas Disponíveis

- Total de logs
- Contagem por nível
- Contagem por contexto
- Logs por usuário
- Logs por período

### Exemplo de Uso para Monitoramento

```typescript
// Verificar erros recentes
const errorResult = await this.loggingService.findByLevel('error', 10);
const errorLogs = errorResult.logs;

// Verificar logs de um usuário específico
const userResult = await this.loggingService.findByUserId(userId, 20);
const userLogs = userResult.logs;

// Verificar logs de um período específico
const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 horas atrás
const endDate = new Date().toISOString();
const recentResult = await this.loggingService.findByDateRange(startDate, endDate, 100);
const recentLogs = recentResult.logs;
```

## Manutenção

### Limpeza de Logs Antigos

Execute periodicamente a limpeza de logs antigos:

```bash
curl -X POST http://localhost:3000/logs/cleanup \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"olderThan": "2024-01-01T00:00:00.000Z"}'
```

### Backup

Para fazer backup dos logs no DynamoDB:

```bash
# Exportar dados da tabela
aws dynamodb scan --table-name ada-company-logs --output json > logs-backup.json

# Ou usar AWS Data Pipeline para backup automatizado
aws datapipeline create-pipeline \
  --name "logs-backup-pipeline" \
  --unique-id "logs-backup-$(date +%s)"
```

### Restaurar Backup

```bash
# Importar dados para a tabela
aws dynamodb batch-write-item --request-items file://logs-backup.json
```

## Segurança

- Todos os endpoints de logs requerem autenticação JWT
- Logs sensíveis não devem incluir senhas ou tokens
- Use o campo `metadata` para informações adicionais de forma estruturada

## Performance

- Logs são salvos de forma assíncrona para não impactar a performance
- DynamoDB oferece escalabilidade automática
- Limite padrão de 100 logs por consulta
- Paginação com `LastEvaluatedKey` para grandes volumes
- GSI otimizados para consultas frequentes

## Troubleshooting

### DynamoDB não conecta
1. Verifique as credenciais AWS (ACCESS_KEY_ID e SECRET_ACCESS_KEY)
2. Confirme se a região AWS está correta
3. Verifique se a tabela existe no DynamoDB
4. Confirme as permissões IAM

### Logs não aparecem
1. Verifique se o LogModule está importado no AppModule
2. Confirme se o DynamoDB está acessível
3. Verifique os logs do console para erros de conexão
4. Confirme se a tabela `ada-company-logs` existe

### Performance lenta
1. Verifique se os GSI estão criados
2. Considere implementar limpeza automática de logs antigos
3. Monitore o uso de capacidade do DynamoDB
4. Use DynamoDB On-demand para cargas variáveis

### Erros de Permissão
1. Verifique se o usuário IAM tem as políticas corretas
2. Confirme se as ações DynamoDB estão permitidas
3. Verifique se a tabela está na região correta
