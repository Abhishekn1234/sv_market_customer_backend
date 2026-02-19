import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { SelectLanguageDto } from '@svmarket/shared';

@ApiTags('Language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

 
  @Post()
  @ApiBody({ type: SelectLanguageDto })
  setLanguage(@Body() dto: SelectLanguageDto) {
    return this.languageService.setLanguage(dto);
  }

  // GET /language
  @Get()
  getLanguage() {
    return this.languageService.getLanguage();
  }
}
