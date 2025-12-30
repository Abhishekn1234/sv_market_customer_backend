import { Module } from '@nestjs/common';
import {BookingModule as CommonBookingModule} from '@faizudheen/shared'
import { BookingController } from './booking.controller';

@Module({
    imports:[
        CommonBookingModule
    ],
    controllers: [BookingController]
})
export class BookingModule {}
