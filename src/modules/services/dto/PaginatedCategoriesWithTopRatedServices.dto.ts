import { PaginationDTO } from "@faizudheen/shared";
import { CategoriesWithServicesDTO } from "./CategoriesWithServices.dto";

export class PaginatedCategoriesWithTopRatedServicesDTO {
    data: CategoriesWithServicesDTO[];
    pagination:PaginationDTO
}