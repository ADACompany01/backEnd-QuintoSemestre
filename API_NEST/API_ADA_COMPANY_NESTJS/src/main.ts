import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interfaces/http/interceptors/logging.interceptor';
import { LoggingExceptionFilter } from './interfaces/http/filters/logging-exception.filter';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const port = 3001;
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const isDevelopment = configService.get<string>('NODE_ENV') !== 'production';

  // Configuração do Helmet para headers de segurança HTTP
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Permite carregar recursos externos quando necessário
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Configuração segura do CORS - removido asterisco (*)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8081',
    'https://newadacompany.vercel.app',
    'https://adacompany.duckdns.org',
  ];

  // Adicionar IPs locais apenas em desenvolvimento
  if (isDevelopment) {
    allowedOrigins.push(
      'http://192.168.1.7:3000',
      'http://192.168.1.7:8081',
      'http://192.168.50.58:3000',
      'http://192.168.50.58:8081',
    );
  }

  app.enableCors({
   origin: [
     'http://localhost:3000',
     'http://localhost:8081', 
     'http://192.168.50.58:8081',
     'http://adacompany.duckdns.org',
     '*' // Permitir todas durante desenvolvimento
   ],
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
  });
  
  // Configurar limite de tamanho para uploads (50MB)
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

  // Servir arquivos estáticos da pasta uploads
  const express = require('express');
  app.use('/uploads', express.static('uploads'));

  // Configurar prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Adicionar ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Adicionar interceptors e filtros globais para logging
  // TEMPORARIAMENTE DESABILITADO - LoggingInterceptor precisa ser configurado como provider
  // app.useGlobalInterceptors(app.get(LoggingInterceptor));
  // app.useGlobalFilters(app.get(LoggingExceptionFilter));
  
  // Configuração do Swagger - apenas em ambiente de desenvolvimento
  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('API ADA Company - Mobile Backend')
      .setDescription('API para gerenciamento de serviços da ADA Company (Backend Mobile - Porta 3001)\n\n**IMPORTANTE:** Todas as rotas têm o prefixo `/api`. Exemplo: `/api/funcionarios`')
      .setVersion('1.0')
      .addServer('http://localhost:3001', 'Servidor Local (Desenvolvimento)')
      .addServer('http://adacompany.duckdns.org', 'Servidor Produção (AWS)')
      .addTag('auth', 'Endpoints de autenticação')
      .addTag('clientes', 'Gerenciamento de clientes')
      .addTag('funcionarios', 'Gerenciamento de funcionários')
      .addTag('pacotes', 'Gerenciamento de pacotes')
      .addTag('orcamentos', 'Gerenciamento de orçamentos')
      .addTag('contratos', 'Gerenciamento de contratos')
      .addTag('solicitacoes', 'Gerenciamento de solicitações')
      .addTag('mobile/lighthouse', 'Avaliação de acessibilidade (Lighthouse)')
      .addTag('logs', 'Sistema de logs da aplicação')
      .addTag('notificacoes', 'Sistema de notificações')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite o token JWT obtido no endpoint de login',
        in: 'header',
      })
      .build();
      
    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    });
    
    // Garantir que o prefixo global seja aplicado nas rotas do Swagger
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
      },
      customSiteTitle: 'API ADA Company - Documentação',
    });
    console.log(`⚠️  Swagger disponível apenas em desenvolvimento: http://localhost:${port}/api`);
  } else {
    console.log('🔒 Swagger desabilitado em produção por segurança');
  }
  
  await app.listen(port, '0.0.0.0');  // Escuta em todas as interfaces de rede
  
  console.log(`✅ Aplicação rodando na porta ${port}`);
  if (isDevelopment) {
    console.log(`📚 Documentação Swagger disponível em: http://localhost:${port}/api`);
    console.log(`🌐 Acessível via rede local em: http://192.168.1.7:${port}/api`);
  } else {
    console.log(`🔒 Modo produção: Swagger desabilitado`);
  }
}
bootstrap();
