import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LighthouseService } from '../../../infrastructure/providers/lighthouse.service';
import { Public } from '../decorators/public.decorator';

@Controller('lighthouse')
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 