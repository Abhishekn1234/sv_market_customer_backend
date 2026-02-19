import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Endpoint to check server status
  @Get('status')
  getServerStatus(): string {
    return `Server is running on port ${process.env.PORT ?? 3000}`;
  }

  
  @Get() 
  getHello(): string {
     return 'Hello World!';
  }
}

