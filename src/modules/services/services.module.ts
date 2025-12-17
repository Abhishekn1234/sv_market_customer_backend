import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesEntity, CategoriesSchema } from '@faizudheen/shared';
import { ServicesController } from './services.controller';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:CategoriesEntity.name, schema:CategoriesSchema}
    ])
  ],
  providers: [ServicesService],
  controllers: [ServicesController]
})
export class ServicesModule {}
