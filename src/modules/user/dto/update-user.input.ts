import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserInput {
    @ApiPropertyOptional({
        description: 'Full name of the user',
        example: 'John Doe',
    })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiPropertyOptional({
        description: 'Address of the user',
        example: '123 Main Street, City',
    })
    @IsString()
    @IsOptional()
    address?: string;
}