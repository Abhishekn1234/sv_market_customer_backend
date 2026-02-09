import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BookingStatus, BookingService as CommonBookingService, CreateBookingInput, CurrentUser, JwtAuthGuard, GenerateOTPInput, PaymentInput } from '@svmarket/shared';
import type { JwtUser } from '@svmarket/shared';
import { Types } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CancelBookingInput } from './dto/cancel-booking.input';

@ApiTags('booking')
@ApiBearerAuth()
@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
    constructor(
        private readonly commonBookingService: CommonBookingService,
        private readonly bookingService: BookingService
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


    @Get('categories')
    @ApiOperation({ summary: 'Get categories' })
    @ApiResponse({ status: 200, description: 'Return categories' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCategories() {
        return await this.bookingService.getCategories()
    }

    @Get('services')
    @ApiOperation({ summary: 'Get services' })
    @ApiResponse({ status: 200, description: 'Return services' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getServices() {
        return await this.bookingService.getServices()
    }

    @Get('pricing-tiers')
    @ApiOperation({ summary: 'Get pricing tiers' })
    @ApiResponse({ status: 200, description: 'Return pricing tiers' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getTier() {
        return await this.bookingService.getTier()
    }


    @Post('cancel')
    @ApiOperation({ summary: 'Cancel a booking' })
    @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async cancelBooking(
        @CurrentUser() user: JwtUser,
        @Body() cancelBookingDto: CancelBookingInput
    ) {
        return await this.commonBookingService.cancelBooking(new Types.ObjectId(cancelBookingDto.bookingId), new Types.ObjectId(user.id))
    }

    @Post('generate-start-otp')
    @ApiOperation({ summary: 'Generate OTP for worker to start work' })
    @ApiBody({ type: GenerateOTPInput })
    @ApiResponse({ status: 200, description: 'OTP generated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async generateStartOTP(
        @CurrentUser() user: JwtUser,
        @Body() input: GenerateOTPInput
    ) {
        return await this.bookingService.generateStartOTP(new Types.ObjectId(user.id), new Types.ObjectId(input.bookingId));
    }

    @Post('generate-completion-otp')
    @ApiOperation({ summary: 'Generate OTP for confirming work completion' })
    @ApiBody({ type: GenerateOTPInput })
    @ApiResponse({ status: 200, description: 'OTP generated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async generateCompletionOTP(
        @CurrentUser() user: JwtUser,
        @Body() input: GenerateOTPInput
    ) {
        return await this.bookingService.generateCompletionOTP(new Types.ObjectId(user.id), new Types.ObjectId(input.bookingId));
    }

    @Get('invoice/:bookingId')
    @ApiOperation({ summary: 'Get invoice for a booking' })
    @ApiParam({ name: 'bookingId', description: 'Booking ID' })
    @ApiResponse({ status: 200, description: 'Return invoice details' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    async getInvoice(
        @CurrentUser() user: JwtUser,
        @Param('bookingId') bookingId: string
    ) {
        return await this.bookingService.getInvoice(new Types.ObjectId(user.id), new Types.ObjectId(bookingId));
    }

    @Post('payment')
    @ApiOperation({ summary: 'Initiate payment for a booking' })
    @ApiBody({ type: PaymentInput })
    @ApiResponse({ status: 200, description: 'Payment initiated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Booking or invoice not found' })
    async initiatePayment(
        @CurrentUser() user: JwtUser,
        @Body() input: PaymentInput
    ) {
        return await this.bookingService.initiatePayment(new Types.ObjectId(user.id), input);
    }

    @Post('payment/verify-mock')
    @ApiOperation({ summary: 'MOCK: Verify payment success' })
    @ApiBody({ schema: { type: 'object', properties: { paymentId: { type: 'string' } } } })
    @ApiResponse({ status: 200, description: 'Payment verified and booking finalized' })
    async verifyPaymentMock(
        @CurrentUser() user: JwtUser,
        @Body('paymentId') paymentId: string
    ) {
        return await this.bookingService.verifyPaymentMock(new Types.ObjectId(user.id), new Types.ObjectId(paymentId));
    }
}

