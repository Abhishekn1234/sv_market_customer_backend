import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { GetCategoriesWithTopRatedServicesInput } from './dto/getCategoriesWithTopRatedServices.input';
import { JwtAuthGuard } from '@faizudheen/shared';
import { PaginatedCategoriesWithTopRatedServicesDTO } from './dto/PaginatedCategoriesWithTopRatedServices.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('services')
@ApiBearerAuth()
@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Get()
    @ApiOperation({ summary: 'Get categories with top rated services' })
    @ApiResponse({ status: 200, type: PaginatedCategoriesWithTopRatedServicesDTO, description: 'Successfully retrieved categories and services' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCategoriesWithTopRatedServices(@Query() input: GetCategoriesWithTopRatedServicesInput): Promise<PaginatedCategoriesWithTopRatedServicesDTO> {
        return this.servicesService.getCategoriesWithTopServices(input);
    }
}
