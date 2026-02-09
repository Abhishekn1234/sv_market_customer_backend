import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { LanguageService } from "./language.service";
import { SelectLanguageDto } from "@svmarket/shared";

@Controller("language")
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post(":mobile")
  async setLanguage(
    @Param("mobile") mobile: string,
    @Body() dto: SelectLanguageDto,
  ) {
    return this.languageService.createOrUpdateLanguage(mobile, dto);
  }

  @Get(":mobile")
  async getLanguage(@Param("mobile") mobile: string) {
    return this.languageService.getLanguageByMobile(mobile);
  }

  @Get()
  async getAllLanguages() {
    return this.languageService.getAllLanguages();
  }
}
