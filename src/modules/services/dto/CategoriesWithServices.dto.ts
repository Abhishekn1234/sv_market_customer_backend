import { CategoriesDTO, ServiceDTO } from "@svmarket/shared";
import { ApiProperty } from "@nestjs/swagger";

export class CategoriesWithServicesDTO extends CategoriesDTO {
    @ApiProperty({ type: [ServiceDTO] })
    services: ServiceDTO[];
}