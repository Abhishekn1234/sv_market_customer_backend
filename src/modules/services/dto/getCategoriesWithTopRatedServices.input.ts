import { PaginationInput } from "@faizudheen/shared";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, ValidateNested } from "class-validator";

export  class GetCategoriesWithTopRatedServicesInput extends PaginationInput{
    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    servicesLimitPerCategory: number = 5;
}