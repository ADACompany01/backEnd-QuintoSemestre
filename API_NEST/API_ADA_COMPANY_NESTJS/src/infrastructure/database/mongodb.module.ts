import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('MONGODB_HOST', 'localhost');
        const port = configService.get<string>('MONGODB_PORT', '27017');
        const database = configService.get<string>('MONGODB_DATABASE', 'adacompany');
        const username = configService.get<string>('MONGODB_USERNAME');
        const password = configService.get<string>('MONGODB_PASSWORD');

        // Construir URI do MongoDB
        let uri: string;
        if (configService.get<string>('MONGODB_URI')) {
          uri = configService.get<string>('MONGODB_URI')!;
        } else if (username && password) {
          // URI com autenticação
          uri = `mongodb://${username}:${encodeURIComponent(password)}@${host}:${port}/${database}?authSource=admin`;
        } else {
          // URI sem autenticação
          uri = `mongodb://${host}:${port}/${database}`;
        }

        console.log(`[MongoDB] Conectando a: ${uri.replace(/:[^:@]+@/, ':****@')}`); // Log sem senha

        return {
          uri,
          retryWrites: true,
          w: 'majority',
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDBModule {}


