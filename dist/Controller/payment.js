"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createPayment = void 0;
const razorpay_1 = require("../Helper/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const room_model_1 = require("../Model/room.model");
const booking_model_1 = require("../Model/booking.model");
const evn = "../.env";
dotenv_1.default.config({ path: evn });
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { room_id, hotel_id, total_guests, check_in_date, check_out_date } = req.body;
        const userID = req.userID;
        // 🛑 Validate input
        if (!room_id || !hotel_id || !userID || !check_in_date || !check_out_date || !total_guests) {
            return res.status(400).json({
                output: 0,
                message: "Missing required parameters",
                jsonResponse: null,
            });
        }
        // 🏨 Check if the room exists
        const room = yield room_model_1.Room.findById(room_id);
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        // 🛏️ Calculate total nights
        const checkInDate = new Date(check_in_date);
        const checkOutDate = new Date(check_out_date);
        const totalNights = Math.max((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24), 1);
        // 💰 Calculate total amount
        const roomPrice = room.price_per_night * totalNights;
        const tax = roomPrice * 0.18; // Example: 18% GST
        const totalAmount = Math.round((roomPrice + tax) * 100); // Convert to paisa (smallest currency unit)
        // 🔹 Create a new Razorpay order
        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `order_${Date.now()}`,
            payment_capture: 1,
        };
        const razorpayOrder = yield razorpay_1.razorpayInstance.orders.create(options);
        // 🔹 Save booking with payment status "pending"
        const newBooking = yield booking_model_1.Booking.create({
            customer_id: userID,
            room_id,
            hotel_id,
            check_in_date,
            check_out_date,
            total_guests,
            total_price: totalAmount / 100, // Convert back to INR
            payment_status: "pending",
            booking_status: "pending",
            razorpay_order_id: razorpayOrder.id,
        });
        return res.status(200).json({
            output: 1,
            message: "Payment initiated successfully",
            jsonResponse: {
                order_id: razorpayOrder.id,
                amount: totalAmount,
                currency: "INR",
                booking_id: newBooking._id,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
});
exports.createPayment = createPayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;
        const SecretKey = process.env.RAZORPAY_KEY_SECRET;
        // 🛑 Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing required parameters" });
        }
        if (!SecretKey) {
            return res.status(500).json({ success: false, message: "Secret key not found" });
        }
        // 🔹 Generate the expected signature
        const generatedSignature = crypto_1.default
            .createHmac("sha256", SecretKey)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
        // ✅ Update booking payment status
        const booking = yield booking_model_1.Booking.findOneAndUpdate({ _id: booking_id }, { payment_status: "paid", booking_status: "confirmed" }, { new: true });
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            booking,
        });
    }
    catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.verifyPayment = verifyPayment;
