import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordInput {
    @ApiProperty({
        description: 'Email address',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description:
            'New password must be at least 8 characters with alphanumeric and special characters',
        example: 'NewPassword@123',
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
            'Password must be at least 8 characters with alphanumeric and special characters',
    })
    password: string;
}
