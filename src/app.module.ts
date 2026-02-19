import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClodinaryModule } from '@svmarket/shared';
import { ServicesModule } from './modules/services/services.module';
import { LanguageModule } from './modules/language/language.module';
import { BookingModule } from './modules/booking/booking.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from './redis.module';
import { LocationsModule } from './modules/location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal:true,
       envFilePath:'.env'
    }),
    RedisModule,
    ClodinaryModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URI!),
    AuthModule,
    LanguageModule,
    LocationsModule,
    EventEmitterModule.forRoot({
      wildcard:true,
      delimiter:'.'
    }),
    UserModule, ServicesModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
