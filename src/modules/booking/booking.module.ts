import { Module } from '@nestjs/common';
import {BookingModule as CommonBookingModule} from '@faizudheen/shared'
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
    imports:[
        CommonBookingModule
    ],
    controllers: [BookingController],
    providers: [BookingService]
})
export class BookingModule {}
