"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    customer_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    room_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    hotel_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    check_in_date: { type: Date, required: true },
    check_out_date: { type: Date, required: true },
    total_guests: { type: Number, required: true, min: 1 },
    total_price: { type: Number, required: true, min: 0 },
    // 🔹 Razorpay Payment Fields
    razorpay_order_id: { type: String, unique: true, sparse: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    payment_status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    booking_status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
    special_requests: { type: String, default: "" },
    cancellation_reason: { type: String, default: "" },
}, { timestamps: true });
// ✅ Unique index to prevent duplicate confirmed bookings for the same room & date
bookingSchema.index({ room_id: 1, check_in_date: 1, check_out_date: 1, booking_status: 1 }, { unique: true, partialFilterExpression: { booking_status: "confirmed" } });
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
