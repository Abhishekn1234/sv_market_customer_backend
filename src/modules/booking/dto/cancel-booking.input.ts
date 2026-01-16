import { IsNotEmpty, IsString } from "class-validator";

export class CancelBookingInput {
    @IsString()
    @IsNotEmpty()
    bookingId: string
}