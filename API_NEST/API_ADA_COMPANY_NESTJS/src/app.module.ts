import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './infrastructure/database/database.module';
import { DynamoDBModule } from './infrastructure/database/dynamodb.module';
import { AuthModule } from './application/auth/auth.module';
import { ClienteModule } from './modules/cliente.module';
import { FuncionarioModule } from './modules/funcionario.module';
import { OrcamentoModule } from './modules/orcamento.module';
import { ContratoModule } from './modules/contrato.module';
import { PacoteModule } from './modules/pacote.module';
import { LighthouseModule } from './modules/lighthouse.module';
import { LogModule } from './modules/log.module';
import { JwtAuthGuard } from './interfaces/http/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET não configurado no arquivo .env');
        }
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      global: true,
    }),
    DatabaseModule,
    DynamoDBModule,
    AuthModule,
    ClienteModule,
    FuncionarioModule,
    OrcamentoModule,
    ContratoModule,
    PacoteModule,
    LighthouseModule,
    LogModule,
  ],
  controllers: [TestController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
