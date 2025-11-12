import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Controller('test')
export class TestController {
  @Public()
  @Get('ping')
  ping() {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
      server: 'Backend está funcionando!'
    };
  }
}

