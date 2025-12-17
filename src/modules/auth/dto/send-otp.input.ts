import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpInput {
    @ApiProperty({
        description: 'Email address to send OTP',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
