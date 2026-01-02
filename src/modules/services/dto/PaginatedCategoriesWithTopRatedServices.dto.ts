import { PaginationDTO } from "@faizudheen/shared";
import { CategoriesWithServicesDTO } from "./CategoriesWithServices.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PaginatedCategoriesWithTopRatedServicesDTO {
    @ApiProperty({ type: [CategoriesWithServicesDTO] })
    data: CategoriesWithServicesDTO[];

    @ApiProperty({ type: PaginationDTO })
    pagination: PaginationDTO
}