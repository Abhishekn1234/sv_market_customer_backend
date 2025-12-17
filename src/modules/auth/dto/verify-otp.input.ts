import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpInput {
    @ApiProperty({
        description: 'hash',
        example: 'A1B2C3',
    })
    @IsString()
    @IsNotEmpty()
    hash: string;

    @ApiProperty({
        description: 'OTP code',
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    otp: string;
}
