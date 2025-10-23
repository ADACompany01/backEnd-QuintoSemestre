# Chaves JWT

Este diretório deve conter suas chaves privadas e públicas para JWT.

## Gerando chaves RSA para JWT

Para gerar um par de chaves RSA para uso com JWT, siga os passos abaixo:

### No Windows

Usando OpenSSL (você pode precisar instalar o OpenSSL para Windows):

```bash
# Gerar chave privada
openssl genrsa -out jwt-private-key.pem 2048

# Gerar chave pública a partir da chave privada
openssl rsa -in jwt-private-key.pem -pubout -out jwt-public-key.pem
```

### No Linux/Mac

```bash
# Gerar chave privada
openssl genrsa -out jwt-private-key.pem 2048

# Gerar chave pública a partir da chave privada
openssl rsa -in jwt-private-key.pem -pubout -out jwt-public-key.pem
```

## Alternativa: Usar uma string secreta

Se preferir usar uma string secreta em vez de chaves RSA, você pode definir a variável de ambiente `JWT_SECRET` com uma string segura e complexa.

Exemplo (no arquivo .env):
```
JWT_SECRET=sua_chave_secreta_jwt_aqui_deve_ser_longa_e_complexa
```

## Importante

- **NUNCA** cometa as chaves privadas no controle de versão. Elas devem permanecer seguras.
- Este diretório está configurado no .gitignore para não subir arquivos .key e .pem.
- Em produção, use um gerenciador de segredos ou variáveis de ambiente para armazenar as chaves. 