# Configuração AWS para Sistema de Logs

Este documento explica como configurar o Amazon DynamoDB para o sistema de logs da ADA Company API.

## Pré-requisitos

1. Conta AWS ativa
2. AWS CLI instalado e configurado
3. Node.js e npm instalados

## Configuração Inicial

### 1. Configurar AWS CLI

```bash
aws configure
```

Informe suas credenciais:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (ex: us-east-1)
- Default output format (json)

### 2. Criar Usuário IAM

Crie um usuário IAM específico para a aplicação com as seguintes políticas:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:BatchGetItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/ada-company-logs",
        "arn:aws:dynamodb:us-east-1:*:table/ada-company-logs/index/*"
      ]
    }
  ]
}
```

### 3. Criar Tabela DynamoDB

Execute o script fornecido:

```bash
npm run dynamodb:create-table
```

Ou manualmente via AWS CLI:

```bash
aws dynamodb create-table \
  --table-name ada-company-logs \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
    AttributeName=level,AttributeType=S \
    AttributeName=context,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --global-secondary-indexes \
    '[{
      "IndexName": "level-timestamp-index",
      "KeySchema": [
        {"AttributeName": "level", "KeyType": "HASH"},
        {"AttributeName": "timestamp", "KeyType": "RANGE"}
      ],
      "Projection": {"ProjectionType": "ALL"}
    }, {
      "IndexName": "context-timestamp-index",
      "KeySchema": [
        {"AttributeName": "context", "KeyType": "HASH"},
        {"AttributeName": "timestamp", "KeyType": "RANGE"}
      ],
      "Projection": {"ProjectionType": "ALL"}
    }, {
      "IndexName": "userId-timestamp-index",
      "KeySchema": [
        {"AttributeName": "userId", "KeyType": "HASH"},
        {"AttributeName": "timestamp", "KeyType": "RANGE"}
      ],
      "Projection": {"ProjectionType": "ALL"}
    }]' \
  --billing-mode PAY_PER_REQUEST
```

## Configuração da Aplicação

### Variáveis de Ambiente

Configure as seguintes variáveis no seu arquivo `.env`:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# DynamoDB Configuration
DYNAMODB_TABLE_LOGS=ada-company-logs

# Para desenvolvimento local com DynamoDB Local (opcional)
DYNAMODB_ENDPOINT=http://localhost:8000
```

### Docker Compose para Produção

```yaml
backend:
  environment:
    AWS_REGION: "us-east-1"
    AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
    AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
    DYNAMODB_TABLE_LOGS: "ada-company-logs"
```

## Desenvolvimento Local

### Opção 1: DynamoDB Local

Para desenvolvimento local, você pode usar DynamoDB Local:

```yaml
# docker-compose.dev.yml
services:
  dynamodb-local:
    image: amazon/dynamodb-local:latest
    container_name: dynamodb-local
    ports:
      - "8000:8000"
    command: ["-jar", "DynamoDBLocal.jar", "-sharedDb", "-inMemory"]
  
  backend:
    environment:
      DYNAMODB_ENDPOINT: "http://dynamodb-local:8000"
```

### Opção 2: AWS Cloud

Use diretamente o DynamoDB na AWS (recomendado para testes):

```bash
# Instalar dependências
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb

# Criar tabela
npm run dynamodb:create-table

# Executar aplicação
npm run start:dev
```

## Monitoramento

### CloudWatch

O DynamoDB automaticamente envia métricas para CloudWatch:

- `ConsumedReadCapacityUnits`
- `ConsumedWriteCapacityUnits`
- `ThrottledRequests`
- `SystemErrors`

### Alertas Recomendados

1. **Throttling**: Alertas quando há throttling de requisições
2. **Erros**: Alertas para erros de sistema
3. **Custos**: Alertas para custos elevados

### Configurar Alertas

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "DynamoDB-Logs-Throttling" \
  --alarm-description "Alert for DynamoDB throttling" \
  --metric-name ThrottledRequests \
  --namespace AWS/DynamoDB \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=TableName,Value=ada-company-logs
```

## Backup e Recuperação

### Backup Automático

Configure backup automático:

```bash
aws dynamodb update-continuous-backups \
  --table-name ada-company-logs \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

### Backup Manual

```bash
# Exportar dados
aws dynamodb scan --table-name ada-company-logs --output json > logs-backup.json

# Restaurar dados
aws dynamodb batch-write-item --request-items file://logs-backup.json
```

## Otimização de Custos

### 1. Lifecycle Policies

Configure TTL (Time To Live) para logs antigos:

```bash
aws dynamodb update-time-to-live \
  --table-name ada-company-logs \
  --time-to-live-specification Enabled=true,AttributeName=ttl
```

### 2. Limpeza Automática

Use AWS Lambda para limpeza automática:

```javascript
// lambda-cleanup-logs.js
const { DynamoDBClient, ScanCommand, BatchWriteCommand } = require('@aws-sdk/client-dynamodb');

exports.handler = async (event) => {
  const client = new DynamoDBClient({ region: 'us-east-1' });
  const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás
  
  // Implementar lógica de limpeza
  // ...
};
```

### 3. Monitoramento de Custos

Configure alertas de custo no AWS Billing:

```bash
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget '{
    "BudgetName": "DynamoDB-Logs-Monthly",
    "BudgetLimit": {"Amount": "50", "Unit": "USD"},
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }'
```

## Segurança

### 1. Criptografia

O DynamoDB criptografa dados em repouso por padrão. Para criptografia em trânsito:

```javascript
const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Criptografia em trânsito é habilitada por padrão
});
```

### 2. VPC Endpoints

Para maior segurança, use VPC endpoints:

```bash
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-12345678 \
  --service-name com.amazonaws.us-east-1.dynamodb \
  --route-table-ids rtb-12345678
```

### 3. IAM Roles

Para aplicações em EC2/ECS, use IAM Roles ao invés de credenciais:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sts:AssumeRole"
      ],
      "Resource": "arn:aws:iam::ACCOUNT_ID:role/DynamoDB-Logs-Role"
    }
  ]
}
```

## Troubleshooting

### Problemas Comuns

1. **Erro de Permissão**: Verifique as políticas IAM
2. **Região Incorreta**: Confirme se a região está correta
3. **Tabela Não Existe**: Execute o script de criação
4. **Throttling**: Aumente a capacidade ou use On-demand

### Logs de Debug

Ative logs de debug:

```bash
export AWS_SDK_LOAD_CONFIG=true
export AWS_SDK_LOG_LEVEL=debug
```

### Teste de Conectividade

```bash
# Testar conexão
aws dynamodb list-tables

# Verificar tabela
aws dynamodb describe-table --table-name ada-company-logs
```
