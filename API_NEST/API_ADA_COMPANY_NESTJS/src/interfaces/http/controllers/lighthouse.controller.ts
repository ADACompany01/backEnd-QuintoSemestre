import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LighthouseService } from '../../../infrastructure/providers/lighthouse.service';
import { Public } from '../decorators/public.decorator';

@Controller('mobile/lighthouse')
export class LighthouseController {
  constructor(private readonly lighthouseService: LighthouseService) {}

  @Public()
  @Post('analyze')
  async checkAccessibility(@Body('url') url: string) {
    if (!url) {
      throw new HttpException('URL é obrigatória', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.lighthouseService.runLighthouse(url);
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Erro desconhecido';
      
      // Se for erro de URL inacessível, retorna BAD_REQUEST
      if (errorMessage.includes('não pôde ser acessada') || 
          errorMessage.includes('Verifique se o endereço')) {
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
      
      // Outros erros retornam INTERNAL_SERVER_ERROR
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 