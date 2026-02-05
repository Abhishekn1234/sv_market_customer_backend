import { Module } from '@nestjs/common';
import { CategoriesEntity, CategoriesSchema, BookingModule as CommonBookingModule, ServiceEntity, ServiceSchema, ServiceTier, ServiceTierSchema, BookingEntity, BookingSchema, PaymentEntity, PaymentSchema, WorkerEntity, WorkerSchema, AssignWorkerEntity, AssignWorkerSchema } from '@faizudheen/shared'
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        CommonBookingModule,
        MongooseModule.forFeature([
            { name: CategoriesEntity.name, schema: CategoriesSchema },
            { name: ServiceEntity.name, schema: ServiceSchema },
            { name: ServiceTier.name, schema: ServiceTierSchema },
            { name: BookingEntity.name, schema: BookingSchema },
            { name: PaymentEntity.name, schema: PaymentSchema },
            { name: WorkerEntity.name, schema: WorkerSchema },
            { name: AssignWorkerEntity.name, schema: AssignWorkerSchema }
        ])
    ],
    controllers: [BookingController],
    providers: [BookingService]
})
export class BookingModule { }

