import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location,LocationDocument } from '@svmarket/shared';
import { CreateLocationDto } from './dto/createlocation.dto';
import { UpdateLocationDto } from './dto/updatelocation.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async createLocation(createLocationDto: CreateLocationDto) {
    const location = new this.locationModel(createLocationDto);
    return location.save();
  }

  async updateLocation(id: string, updateLocationDto: UpdateLocationDto) {
    return this.locationModel.findByIdAndUpdate(id, updateLocationDto, { new: true });
  }

  async getLocation(id: string) {
    return this.locationModel.findById(id);
  }
}