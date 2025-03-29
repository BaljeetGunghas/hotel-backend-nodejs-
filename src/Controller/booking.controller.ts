import { Request, Response } from "express";
import { Booking } from "../Model/booking.model";
import { Room } from "../Model/room.model";
import mongoose from "mongoose";

export const createBooking = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
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
        const room = await Room.findById(room_id).session(session);
        if (!room) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                output: 0,
                message: "Room not found.",
                jsonResponse: null
            });
        }

        // Check if the room is already booked for the selected dates within the transaction
        const existingBooking = await Booking.findOne({
            room_id,
            booking_status: "confirmed",
            $or: [
                { check_in_date: { $lt: checkOut }, check_out_date: { $gt: checkIn } }
            ]
        }).session(session);

        if (existingBooking) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({
                output: 0,
                message: "Room is already booked for the selected dates.",
                jsonResponse: null
            });
        }

        // Create the booking within the transaction
        const newBooking = new Booking({
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
        await newBooking.save({ session });
        await room.save({ session });

        await session.commitTransaction(); // Commit transaction
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

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};


export const getBookingById = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(200).json({
                output: 0,
                message: "Booking ID is required",
                jsonResponse: null
            });
        }

        const booking = await Booking.findById(bookingId).select("-__v");
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
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null
        });
    }
}