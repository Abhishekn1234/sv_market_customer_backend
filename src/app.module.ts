import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClodinaryModule } from '@faizudheen/shared';
import { ServicesModule } from './modules/services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal:true,
       envFilePath:'.env'
    }),
    ClodinaryModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URI!),
    AuthModule, 
    UserModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
