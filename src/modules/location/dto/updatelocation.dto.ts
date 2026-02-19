import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './createlocation.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}