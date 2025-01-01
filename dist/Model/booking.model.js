"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const bookingSchema = new mongoose_1.default.Schema({
    customer_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }, // User
    room_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Room', required: true }, // Room
    check_in_date: { type: Date, required: true }, //check in date
    check_out_date: { type: Date, required: true }, //check out date
    total_guests: { type: Number, required: true }, //total guests
    total_price: { type: Number, required: true }, //total price
    payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }, //payment status
    booking_status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }, //booking status
    special_requests: { type: String }, //special requests
    cancellation_reason: { type: String }, //cancellation reason
}, { timestamps: true });
module.exports = mongoose_1.default.model('Booking', bookingSchema);
