
import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { LocationsService } from './location.service';
import { CreateLocationDto } from './dto/createlocation.dto';
import { UpdateLocationDto } from './dto/updatelocation.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}


  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.createLocation(createLocationDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.updateLocation(id, updateLocationDto);
  }

  
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.locationsService.getLocation(id);
  }
}
