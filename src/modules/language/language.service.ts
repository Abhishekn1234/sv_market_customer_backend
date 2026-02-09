import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Language } from "@svmarket/shared";
import { SelectLanguageDto } from "@svmarket/shared";

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<Language>,
  ) {}

  async createOrUpdateLanguage(mobile: string, dto: SelectLanguageDto) {
    const existing = await this.languageModel.findOne({ mobile });
    if (existing) {
      existing.language = dto.language;
      return existing.save();
    }

    const created = new this.languageModel({ mobile, language: dto.language });
    return created.save();
  }

  async getLanguageByMobile(mobile: string) {
    const lang = await this.languageModel.findOne({ mobile });
    if (!lang) throw new NotFoundException("Language not found for this mobile");
    return lang;
  }

  async getAllLanguages() {
    return this.languageModel.find();
  }
}
