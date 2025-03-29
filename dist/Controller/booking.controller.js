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
exports.getBookingById = exports.createBooking = void 0;
const booking_model_1 = require("../Model/booking.model");
const room_model_1 = require("../Model/room.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction(); // Start MongoDB transaction
    try {
        const customer_id = req.userID;
        const { room_id, hotel_id, check_in_date, check_out_date, total_guests, total_price, special_requests } = req.body;
        if (!customer_id || !room_id || !hotel_id) {
            return res.status(200).json({
                output: 0,
                message: "Customer ID, room ID, and hotel ID are required.",
                jsonResponse: null
            });
        }
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(200).json({
                output: 0,
                message: "Invalid date format. Use YYYY-MM-DD.",
                jsonResponse: null
            });
        }
        if (checkIn > checkOut) {
            return res.status(200).json({
                output: 0,
                message: "Check-in date cannot be after check-out date.",
                jsonResponse: null
            });
        }
        // Fetch room within the transaction
        const room = yield room_model_1.Room.findById(room_id).session(session);
        if (!room) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                output: 0,
                message: "Room not found.",
                jsonResponse: null
            });
        }
        // Check if the room is already booked for the selected dates within the transaction
        const existingBooking = yield booking_model_1.Booking.findOne({
            room_id,
            booking_status: "confirmed",
            $or: [
                { check_in_date: { $lt: checkOut }, check_out_date: { $gt: checkIn } }
            ]
        }).session(session);
        if (existingBooking) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(200).json({
                output: 0,
                message: "Room is already booked for the selected dates.",
                jsonResponse: null
            });
        }
        // Create the booking within the transaction
        const newBooking = new booking_model_1.Booking({
            customer_id,
            room_id,
            hotel_id,
            check_in_date: checkIn,
            check_out_date: checkOut,
            total_guests,
            total_price,
            payment_status: 'paid',
            booking_status: 'confirmed',
            special_requests: special_requests || "",
            cancellation_reason: ""
        });
        room.availability_status = "occupied";
        // Save booking and update room status atomically
        yield newBooking.save({ session });
        yield room.save({ session });
        yield session.commitTransaction(); // Commit transaction
        session.endSession();
        res.status(201).json({
            output: 1,
            message: "Booking successful",
            jsonResponse: {
                newBooking,
                room: {
                    room_id: room._id,
                    room_number: room.room_number,
                }
            }
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
});
exports.createBooking = createBooking;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(200).json({
                output: 0,
                message: "Booking ID is required",
                jsonResponse: null
            });
        }
        const booking = yield booking_model_1.Booking.findById(bookingId).select("-__v");
        if (!booking) {
            return res.status(404).json({
                output: 0,
                message: "Booking not found",
                jsonResponse: null
            });
        }
        res.status(200).json({
            output: 1,
            message: "Booking retrieved successfully",
            jsonResponse: booking
        });
    }
    catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null
        });
    }
});
exports.getBookingById = getBookingById;
