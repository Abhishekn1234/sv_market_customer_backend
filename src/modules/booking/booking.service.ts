import { CategoriesDocument, CategoriesEntity, ServiceDocument, ServiceEntity, ServiceTier, ServiceTierDocument } from '@faizudheen/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BookingService {
    constructor(
        @InjectModel(CategoriesEntity.name)
        private readonly categoriesModel: Model<CategoriesDocument>,
        @InjectModel(ServiceEntity.name)
        private readonly servicesModel: Model<ServiceDocument>,
        @InjectModel(ServiceTier.name)
        private readonly serviceTierModel: Model<ServiceTierDocument>

    ){}

    async getCategories(){
        return await this.categoriesModel.find() 
    }

    async getServices(){
        return await this.servicesModel.find()
    }

    async getTier(){
        return await this.serviceTierModel.find()
    }
}
