import { Request, Response } from "express";
import { Room } from "../Model/room.model";
import { Hotel } from "../Model/hotel.model";
import { IReviewDocument, Room_Review } from "../Model/room_review.model";
import { Document } from "mongoose";

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find();

        return res.status(200).json({
            output: 1,
            message: "Rooms fetched successfully",
            jsonResponse: rooms.length > 0 ? rooms : null,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
};

export const getSpacificRoombyRoomId = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }

        const room = await Room.findById({ _id: roomId }, { __v: 0, reviews: 0 });
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        const hotel = await Hotel.findById({ _id: room.hotel_id }, { __v: 0 });

        const roomReviews = await Room_Review.find({ room_id: roomId }, { __v: 0 });

        return res.status(200).json({
            output: 1,
            message: "Room fetched successfully",
            jsonResponse: {
                ...room.toObject(),
                roomReviews: roomReviews.length > 0 ? roomReviews : null,
                hotelDetails: hotel || null,
            },
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const {
            hostid,
            hotel_id,
            room_number,
            room_type,
            price_per_night,
            max_occupancy,
            features,
            floor_number,
            bed_type,
            availability_status,
            view_type,
            smoking_allowed,
            description,
            rating,
            check_in_time,
            check_out_time,
        } = req.body;
        if (!hostid || !hotel_id) {
            return res.status(400).json({
                output: 0,
                message: "Please provide hostid and hotel_id",
                jsonResponse: null,
            });
        }
        if (!room_number) {
            return res.status(400).json({
                output: 0,
                message: "Please provide room_number",
                jsonResponse: null,
            });
        }
        const isRoomAlreadyCrated = await Room.findOne({
            room_number: room_number,
            hotel_id: hotel_id,
        });

        if (isRoomAlreadyCrated) {
            return res.status(400).json({
                output: 0,
                message: "Room already created within this hotel with this room number",
                jsonResponse: null,
            });
        }

        const room = new Room({
            hostid: hostid,
            hotel_id,
            room_number,
            room_type,
            price_per_night,
            max_occupancy,
            features,
            floor_number,
            bed_type,
            availability_status,
            view_type,
            smoking_allowed,
            description,
            rating,
            check_in_time,
            check_out_time,
        });
        await room.save();
        return res.status(201).json({
            output: 1,
            message: "Room created successfully",
            json: room,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const {
            room_id,
            room_number,
            room_type,
            price_per_night,
            max_occupancy,
            features,
            floor_number,
            bed_type,
            availability_status,
            view_type,
            smoking_allowed,
            description,
            check_in_time,
            check_out_time,
        } = req.body;
        if (!room_id) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }

        const room = await Room.findById({ _id: room_id });
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }

        const updatedRoom = {
            room_number: room_number || room.room_number,
            room_type: room_type || room.room_type,
            price_per_night: price_per_night || room.price_per_night,
            max_occupancy: max_occupancy || room.max_occupancy,
            features: features || room.features,
            floor_number: floor_number || room.floor_number,
            bed_type: bed_type || room.bed_type,
            availability_status: availability_status || room.availability_status,
            view_type: view_type || room.view_type,
            smoking_allowed: smoking_allowed || room.smoking_allowed,
            description: description || room.description,
            check_in_time: check_in_time || room.check_in_time,
            check_out_time: check_out_time || room.check_out_time,
        };
        const updatedRoomDoc = await Room.findByIdAndUpdate(room_id, updatedRoom, {
            new: true,
        });

        return res.status(200).json({
            output: 1,
            message: "Room updated successfully",
            jsonResponse: updatedRoomDoc,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
};

export const getRoomsByHotel = async (req: Request, res: Response) => {
    try {
        const { hotel_id } = req.body;
        if (!hotel_id) {
            return res.status(400).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null,
            });
        }
        const rooms = await Room.find({ hotel_id: hotel_id }, { __v: 0 });

        return res.status(200).json({
            output: rooms.length > 0 ? rooms.length : 0,
            message: "Rooms fetched successfully",
            jsonResponse: rooms.length > 0 ? rooms : null,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }
        const room = await Room.findById({ _id: roomId });
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        await Room.findByIdAndDelete(roomId);
        return res.status(200).json({
            output: 1,
            message: "Room deleted successfully",
            jsonResponse: null,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
};

// Add Revew to Room by Room ID
export const addRoomReview = async (req: Request, res: Response) => {
    try {
        const { roomId, userId, hotelId, rating, comment } = req.body;
        if (!roomId || !userId || !hotelId || !rating || !comment) {
            return res.status(400).json({
                output: 0,
                message: "Please provide all required fields",
                jsonResponse: null,
            });
        }
        const review: Document = new Room_Review({
            user_id: userId,
            hotel_id: hotelId,
            room_id: roomId,
            rating,
            comment,
        });
        await review.save();

        // update review count and rating in Room model
        const room = await Room.findById({ _id: roomId });
        room.reviews.push(review._id as any);

        const totalRating = ((+room.rating || 0) * (room.reviews.length - 1) + Number(rating)) / room.reviews.length;

        room.rating = +totalRating.toFixed(1);
        await room.save();

        return res.status(200).json({
            output: 1,
            message: "Review added successfully",
            jsonResponse: review,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
};
