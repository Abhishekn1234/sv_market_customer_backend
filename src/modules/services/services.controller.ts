import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { GetCategoriesWithTopRatedServicesInput } from './dto/getCategoriesWithTopRatedServices.input';
import { JwtAuthGuard } from '@faizudheen/shared';
import { PaginatedCategoriesWithTopRatedServicesDTO } from './dto/PaginatedCategoriesWithTopRatedServices.dto';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Get()
    async getCategoriesWithTopRatedServices(@Query() input: GetCategoriesWithTopRatedServicesInput):Promise<PaginatedCategoriesWithTopRatedServicesDTO> {
        return this.servicesService.getCategoriesWithTopServices(input);
    }
}
