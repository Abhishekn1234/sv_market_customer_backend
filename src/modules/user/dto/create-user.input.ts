import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class CreateUserInput {
    @ApiProperty({
        description: 'Full name of the user',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description:
            'Password must be at least 8 characters with alphanumeric and special characters',
        example: 'Password@123',
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
            'Password must be at least 8 characters with alphanumeric and special characters',
    })
    password: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: '+919876543210',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;
}