import { CategoriesDTO, ServiceDTO } from "@faizudheen/shared";

export class CategoriesWithServicesDTO extends CategoriesDTO {
    services: ServiceDTO[];
}