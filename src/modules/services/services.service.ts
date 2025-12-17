import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ServicesService {
    constructor(
        @InjectModel()
    ){}
}
