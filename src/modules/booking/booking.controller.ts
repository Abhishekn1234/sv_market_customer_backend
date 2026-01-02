import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BookingStatus, BookingService as CommonBookingService, CreateBookingInput, CurrentUser, JwtAuthGuard } from '@faizudheen/shared';
import type { JwtUser } from '@faizudheen/shared';
import { Types } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('booking')
@ApiBearerAuth()
@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
    constructor(
        private readonly commonBookingService: CommonBookingService
    ) { }


    @Post('create')
    @ApiOperation({ summary: 'Create a new booking' })
    @ApiBody({ type: CreateBookingInput })
    @ApiResponse({ status: 201, description: 'Booking created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createBooking(
        @CurrentUser() user: JwtUser,
        @Body() createBookingDto: CreateBookingInput
    ) {
        return this.commonBookingService.createBooking(new Types.ObjectId(user.id), createBookingDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get current active booking for the user' })
    @ApiResponse({ status: 200, description: 'Return current booking if exists' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCurrentBooking(
        @CurrentUser() user: JwtUser
    ) {
        return await this.commonBookingService.findExistingBooking(new Types.ObjectId(user.id))
    }
}
