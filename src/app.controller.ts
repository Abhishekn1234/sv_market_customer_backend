import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getServerStatus(): string {
    return `Server is running on port ${process.env.PORT ?? 3000}`;
  }
}
