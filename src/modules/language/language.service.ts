import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Language, LanguageDocument } from '@svmarket/shared';
import { SelectLanguageDto } from '@svmarket/shared';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
  ) {}

  // Set or update language
  async setLanguage(dto: SelectLanguageDto): Promise<Language> {
    let lang = await this.languageModel.findOne();
    if (!lang) {
      lang = new this.languageModel(dto);
    } else {
      lang.language = dto.language;
    }
    return lang.save();
  }

  // Get language (default 'en' if not set)
  async getLanguage(): Promise<Language | { language: string }> {
    const lang = await this.languageModel.findOne();
    if (!lang) {
      return { language: 'en' };
    }
    return lang;
  }
}
