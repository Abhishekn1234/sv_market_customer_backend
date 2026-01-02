import { CategoriesDTO, ServiceDTO } from "@faizudheen/shared";
import { ApiProperty } from "@nestjs/swagger";

export class CategoriesWithServicesDTO extends CategoriesDTO {
    @ApiProperty({ type: [ServiceDTO] })
    services: ServiceDTO[];
}