import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interfaces/http/interceptors/logging.interceptor';
import { LoggingExceptionFilter } from './interfaces/http/filters/logging-exception.filter';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
   origin: [
     'http://localhost:3000',
     'http://localhost:8081', 
     'http://192.168.50.58:8081',
     'https://newadacompany.vercel.app',
     '*' // Permitir todas durante desenvolvimento
   ],
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
  });
  
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
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API ADA Company')
    .setDescription('API para gerenciamento de serviços da ADA Company')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('clientes', 'Gerenciamento de clientes')
    .addTag('funcionarios', 'Gerenciamento de funcionários')
    .addTag('pacotes', 'Gerenciamento de pacotes')
    .addTag('orcamentos', 'Gerenciamento de orçamentos')
    .addTag('contratos', 'Gerenciamento de contratos')
    .addTag('logs', 'Sistema de logs da aplicação')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port, '0.0.0.0');  // Escuta em todas as interfaces de rede
  
  console.log(`Aplicação rodando na porta ${port}`);
  console.log(`Documentação Swagger disponível em: http://localhost:${port}/api`);
  console.log(`Acessível via rede local em: http://192.168.50.58:${port}/api`);
}
bootstrap();
