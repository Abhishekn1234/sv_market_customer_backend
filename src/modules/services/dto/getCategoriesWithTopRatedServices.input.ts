import { PaginationInput } from "@faizudheen/shared";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, ValidateNested } from "class-validator";

export class GetCategoriesWithTopRatedServicesInput extends PaginationInput {
    @ApiProperty({ description: 'Limit of services per category', default: 5, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    servicesLimitPerCategory: number = 5;
}