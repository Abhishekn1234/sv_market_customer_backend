import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordInput {
    @ApiProperty({
        description: 'Current password',
        example: 'OldPassword@123',
    })
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty({
        description:
            'New password must be at least 8 characters with alphanumeric and special characters',
        example: 'NewPassword@456',
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
            'Password must be at least 8 characters with alphanumeric and special characters',
    })
    newPassword: string;
}