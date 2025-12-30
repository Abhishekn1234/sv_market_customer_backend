import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClodinaryModule } from '@faizudheen/shared';
import { ServicesModule } from './modules/services/services.module';
import { BookingModule } from './modules/booking/booking.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal:true,
       envFilePath:'.env'
    }),
    ClodinaryModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URI!),
    AuthModule,
    EventEmitterModule.forRoot({
      wildcard:true,
      delimiter:'.'
    }),
    UserModule, ServicesModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
