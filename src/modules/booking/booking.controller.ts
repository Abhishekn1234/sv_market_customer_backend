import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BookingStatus, BookingService as CommonBookingService, CreateBookingInput, CurrentUser, JwtAuthGuard } from '@faizudheen/shared';
import type { JwtUser } from '@faizudheen/shared';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
    constructor(
        private readonly commonBookingService: CommonBookingService
    ){}


    @Post('create')
    async createBooking(
        @CurrentUser() user: JwtUser,
        @Body() createBookingDto: CreateBookingInput
    ){
        return this.commonBookingService.createBooking(new Types.ObjectId(user.id), createBookingDto)
    }

    @Get()
    async getCurrentBooking(
        @CurrentUser() user: JwtUser
    ) {
        return await this.commonBookingService.findExistingBooking(new Types.ObjectId(user.id))
    }

    @Post('noty')
    async sendBookingNoti(){
        const data= this.commonBookingService.sendBookingRequestNotification(new Types.ObjectId("69467a6512d5ef6cbb5951e6"))
        return "OK"
    }
}
