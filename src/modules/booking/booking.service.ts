import { CategoriesDocument, CategoriesEntity, ServiceDocument, ServiceEntity, ServiceTier, ServiceTierDocument, BookingEntity, BookingDocument, OTPService, OTPPurpose, BookingEvents, InvoiceService, PaymentInput, PaymentEntity, PaymentDocument, PaymentStatus, BookingStatus, WorkerEntity, WorkerDocument, WorkerStatus, AssignWorkerEntity, AssignWorkerDocument } from '@svmarket/shared';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BookingService {
    constructor(
        @InjectModel(CategoriesEntity.name)
        private readonly categoriesModel: Model<CategoriesDocument>,
        @InjectModel(ServiceEntity.name)
        private readonly servicesModel: Model<ServiceDocument>,
        @InjectModel(ServiceTier.name)
        private readonly serviceTierModel: Model<ServiceTierDocument>,
        @InjectModel(BookingEntity.name)
        private readonly bookingModel: Model<BookingDocument>,
        @InjectModel(PaymentEntity.name)
        private readonly paymentModel: Model<PaymentDocument>,
        @InjectModel(WorkerEntity.name)
        private readonly workerModel: Model<WorkerDocument>,
        @InjectModel(AssignWorkerEntity.name)
        private readonly assignWorkerModel: Model<AssignWorkerDocument>,
        private readonly otpService: OTPService,
        private readonly invoiceService: InvoiceService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    async getCategories() {
        return await this.categoriesModel.find()
    }

    async getServices() {
        return await this.servicesModel.find()
    }

    async getTier() {
        return await this.serviceTierModel.find()
    }

    /**
     * Generate OTP for worker to start work
     */
    async generateStartOTP(userId: Types.ObjectId, bookingId: Types.ObjectId) {
        // Verify booking exists and belongs to user
        const booking = await this.bookingModel.findOne({
            _id: bookingId,
            userId
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Verify booking is in correct status
        if (booking.status !== BookingStatus.WORKER_ACCEPTED) {
            throw new BadRequestException('Booking must be in WORKER_ACCEPTED status to generate start OTP');
        }

        // Generate OTP
        const { otp, expiresAt } = await this.otpService.generateOTP(
            bookingId,
            OTPPurpose.WORK_START
        );

        // Emit event
        this.eventEmitter.emit(BookingEvents.WORK_START_OTP_GENERATED, {
            eventName: BookingEvents.WORK_START_OTP_GENERATED,
            bookingId,
            userId
        });

        return {
            success: true,
            otp,
            expiresAt,
            message: 'OTP generated successfully. Share this OTP with the worker to start work.'
        };
    }

    /**
     * Generate OTP for confirming work completion
     */
    async generateCompletionOTP(userId: Types.ObjectId, bookingId: Types.ObjectId) {
        // Verify booking exists and belongs to user
        const booking = await this.bookingModel.findOne({
            _id: bookingId,
            userId
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Verify booking is in correct status
        if (booking.status !== BookingStatus.WORK_COMPLETED_PENDING) {
            throw new BadRequestException('Booking must be in WORK_COMPLETED_PENDING status to generate completion OTP');
        }

        // Generate OTP
        const { otp, expiresAt } = await this.otpService.generateOTP(
            bookingId,
            OTPPurpose.WORK_COMPLETE
        );

        // Emit event
        this.eventEmitter.emit(BookingEvents.COMPLETION_OTP_GENERATED, {
            eventName: BookingEvents.COMPLETION_OTP_GENERATED,
            bookingId,
            userId
        });

        return {
            success: true,
            otp,
            expiresAt,
            message: 'OTP generated successfully. Share this OTP with the worker to confirm completion.'
        };
    }

    /**
     * Get invoice for a booking
     */
    async getInvoice(userId: Types.ObjectId, bookingId: Types.ObjectId) {
        // Verify booking belongs to user
        const booking = await this.bookingModel.findOne({
            _id: bookingId,
            userId
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Get invoice
        const invoice = await this.invoiceService.getInvoiceByBookingId(bookingId);

        if (!invoice) {
            throw new NotFoundException('Invoice not found for this booking');
        }

        return invoice;
    }

    /**
     * Initiate payment for a booking
     */
    async initiatePayment(userId: Types.ObjectId, input: PaymentInput) {
        const bookingId = new Types.ObjectId(input.bookingId);

        // Verify booking belongs to user
        const booking = await this.bookingModel.findOne({
            _id: bookingId,
            userId
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Check booking status
        if (booking.status !== BookingStatus.INVOICE_GENERATED && booking.status !== BookingStatus.PAYMENT_PENDING) {
            throw new BadRequestException('Invoice must be generated before payment');
        }

        // Get invoice
        const invoice = await this.invoiceService.getInvoiceByBookingId(bookingId);

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        // Check if payment already exists
        const existingPayment = await this.paymentModel.findOne({
            bookingId,
            status: { $in: [PaymentStatus.SUCCESS, PaymentStatus.PROCESSING] }
        });

        if (existingPayment) {
            throw new BadRequestException('Payment already exists for this booking');
        }

        // Create payment record
        const payment = await this.paymentModel.create({
            bookingId,
            invoiceId: invoice._id,
            userId,
            amount: invoice.finalAmount,
            currency: invoice.currency,
            paymentMethod: input.paymentMethod,
            status: PaymentStatus.PENDING,
            initiatedAt: new Date()
        });

        // Update booking status
        await this.bookingModel.updateOne(
            { _id: bookingId },
            {
                $set: {
                    status: BookingStatus.PAYMENT_PENDING,
                    paymentId: payment._id
                }
            }
        );

        // Emit event
        this.eventEmitter.emit(BookingEvents.PAYMENT_INITIATED, {
            eventName: BookingEvents.PAYMENT_INITIATED,
            bookingId,
            paymentId: payment._id,
            userId
        });

        // TODO: Integrate with payment gateway here
        // For now, return mock payment URL
        return {
            success: true,
            paymentId: payment._id,
            amount: payment.amount,
            currency: payment.currency,
            paymentUrl: `https://payment-gateway.example.com/pay/${payment._id}`,
            message: 'Payment initiated successfully. Complete payment using the provided URL.'
        };
    };


    /**
     * MOCK ONLY: Verify payment success (Callback)
     * In a real system, this would be a webhook handler from Stripe/Razorpay
     */
    async verifyPaymentMock(userId: Types.ObjectId, paymentId: Types.ObjectId) {
        const payment = await this.paymentModel.findOne({ _id: paymentId, userId });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (payment.status === PaymentStatus.SUCCESS) {
            return {
                success: true,
                message: 'Payment already completed'
            };
        }

        const session = await this.paymentModel.startSession();
        session.startTransaction();

        try {
            // 1. Update Payment Status
            payment.status = PaymentStatus.SUCCESS;
            payment.completedAt = new Date();
            payment.transactionId = `MOCK_${Date.now()}`;
            payment.gatewayResponse = { message: 'Mock success' };
            await payment.save({ session });

            // 2. Update Invoice Status
            await this.invoiceService.markInvoiceAsPaid(payment.invoiceId); // Assuming no session support in shared for now, or acceptable risk

            // 3. Update Booking Status
            const booking = await this.bookingModel.findById(payment.bookingId).session(session);
            if (!booking) throw new NotFoundException('Booking not found');

            booking.status = BookingStatus.PAID;
            booking.isFinalized = true;
            booking.paymentId = payment._id;
            await booking.save({ session });

            // 4. Set Worker Status to ONLINE
            // Find workers assigned to this booking
            const assignments = await this.assignWorkerModel.find({ bookingId: booking._id }).session(session);
            const workerIds = assignments.map(a => a.workerId);

            if (workerIds.length > 0) {
                await this.workerModel.updateMany(
                    { _id: { $in: workerIds } },
                    { $set: { status: WorkerStatus.ONLINE } }
                ).session(session);
            }

            await session.commitTransaction();

            // 5. Emit Event
            this.eventEmitter.emit(BookingEvents.PAYMENT_COMPLETED, {
                eventName: BookingEvents.PAYMENT_COMPLETED,
                bookingId: booking._id,
                paymentId: payment._id,
                amount: payment.amount
            });

            return {
                success: true,
                message: 'Payment verified successfully. Booking finalized.',
                paymentId: payment._id
            };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

