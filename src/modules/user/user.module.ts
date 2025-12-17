import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService, DocumentEntity, DocumentSchema, ModuleEntity, ModuleSchema, UserEntity, UserGroup, UserGroupSchema, UserSchema } from '@faizudheen/shared';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:UserEntity.name, schema:UserSchema},
      {name:UserGroup.name, schema:UserGroupSchema},
      {name:DocumentEntity.name, schema:DocumentSchema },
      {name: ModuleEntity.name, schema:ModuleSchema}
    ])
  ],
  providers: [UserService, CloudinaryService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
