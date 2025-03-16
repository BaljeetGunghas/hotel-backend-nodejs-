import mongoose, { Document, Schema } from "mongoose";

export interface IBooking {
    customer_id: mongoose.Schema.Types.ObjectId;
    room_id: mongoose.Schema.Types.ObjectId;
    hotel_id: mongoose.Schema.Types.ObjectId;
    check_in_date: Date;
    check_out_date: Date;
    total_guests: number;
    total_price: number;
    payment_status: "pending" | "paid" | "failed";
    booking_status: "pending" | "confirmed" | "cancelled" | "completed";
    special_requests?: string;
    cancellation_reason?: string;
}

interface IBookingDocument extends IBooking, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>(
    {
        customer_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        room_id: { type: Schema.Types.ObjectId, ref: "Room", required: true, index: true },
        hotel_id: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
        check_in_date: { type: Date, required: true },
        check_out_date: { type: Date, required: true },
        total_guests: { type: Number, required: true, min: 1 },
        total_price: { type: Number, required: true, min: 0 },
        payment_status: { type: String, enum: ["pending", "paid", "failed"], default: "paid" },
        booking_status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "confirmed" },
        special_requests: { type: String, default: "" },
        cancellation_reason: { type: String, default: "" },
    },
    { timestamps: true }
);

// ✅ Add compound unique index to prevent duplicate confirmed bookings
bookingSchema.index(
    { room_id: 1, check_in_date: 1, check_out_date: 1, booking_status: 1 },
    { unique: true, partialFilterExpression: { booking_status: "confirmed" } }
);

export const Booking = mongoose.model<IBookingDocument>("Booking", bookingSchema);
