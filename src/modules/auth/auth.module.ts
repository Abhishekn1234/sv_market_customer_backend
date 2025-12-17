import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthStrategy, JwtRefreshStrategy } from '@faizudheen/shared';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
   JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: "1h",
        },
      }),
      inject: [ConfigService]
    }),
    UserModule
  ],
  providers: [AuthService,AuthStrategy, JwtRefreshStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
