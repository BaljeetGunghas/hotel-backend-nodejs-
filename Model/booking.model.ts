import mongoose, { Document } from "mongoose";

export interface IBooking {
    customer_id: mongoose.Schema.Types.ObjectId;
    room_id: mongoose.Schema.Types.ObjectId;
    check_in_date: Date;
    check_out_date: Date;
    total_guests: number;
    total_price: number;
    payment_status: string;
    booking_status: string;
    special_requests: string;
    cancellation_reason: string;
};

interface IBookingDocument extends IBooking, Document {
    created_at: Date;
    updated_at: Date;
};

const bookingSchema = new mongoose.Schema<IBookingDocument>({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Room
    check_in_date: { type: Date, required: true },      //check in date
    check_out_date: { type: Date, required: true },    //check out date
    total_guests: { type: Number, required: true },   //total guests
    total_price: { type: Number, required: true },  //total price
    payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },  //payment status
    booking_status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },     //booking status
    special_requests: { type: String },  //special requests
    cancellation_reason: { type: String },  //cancellation reason
}, { timestamps: true} );

module.exports = mongoose.model('Booking', bookingSchema);

