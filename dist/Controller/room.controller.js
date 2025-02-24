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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRoomReview = exports.deleteRoom = exports.getRoomsByHotel = exports.updateRoom = exports.createRoom = exports.getSpacificRoombyRoomId = exports.getAllRooms = void 0;
const room_model_1 = require("../Model/room.model");
const hotel_model_1 = require("../Model/hotel.model");
const room_review_model_1 = require("../Model/room_review.model");
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield room_model_1.Room.find();
        return res.status(200).json({
            output: 1,
            message: "Rooms fetched successfully",
            jsonResponse: rooms.length > 0 ? rooms : null,
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
exports.getAllRooms = getAllRooms;
const getSpacificRoombyRoomId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }
        const room = yield room_model_1.Room.findById({ _id: roomId }, { __v: 0, reviews: 0 });
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        const hotel = yield hotel_model_1.Hotel.findById({ _id: room.hotel_id }, { __v: 0 });
        const roomReviews = yield room_review_model_1.Room_Review.find({ room_id: roomId }, { __v: 0 });
        return res.status(200).json({
            output: 1,
            message: "Room fetched successfully",
            jsonResponse: Object.assign(Object.assign({}, room.toObject()), { roomReviews: roomReviews.length > 0 ? roomReviews : null, hotelDetails: hotel || null }),
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
exports.getSpacificRoombyRoomId = getSpacificRoombyRoomId;
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hostid, hotel_id, room_number, room_type, price_per_night, max_occupancy, features, floor_number, bed_type, availability_status, view_type, smoking_allowed, description, rating, check_in_time, check_out_time, } = req.body;
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
        const isRoomAlreadyCrated = yield room_model_1.Room.findOne({
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
        const room = new room_model_1.Room({
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
        yield room.save();
        const hotel = yield hotel_model_1.Hotel.findById(hotel_id);
        if (hotel) {
            hotel.rooms += 1;
            yield hotel.save();
        }
        return res.status(201).json({
            output: 1,
            message: "Room created successfully",
            json: room,
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
exports.createRoom = createRoom;
const updateRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { room_id, room_number, room_type, price_per_night, max_occupancy, features, floor_number, bed_type, availability_status, view_type, smoking_allowed, description, check_in_time, check_out_time, } = req.body;
        if (!room_id) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }
        const room = yield room_model_1.Room.findById({ _id: room_id });
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
        const updatedRoomDoc = yield room_model_1.Room.findByIdAndUpdate(room_id, updatedRoom, {
            new: true,
        });
        return res.status(200).json({
            output: 1,
            message: "Room updated successfully",
            jsonResponse: updatedRoomDoc,
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
exports.updateRoom = updateRoom;
const getRoomsByHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotel_id } = req.body;
        if (!hotel_id) {
            return res.status(400).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null,
            });
        }
        const rooms = yield room_model_1.Room.find({ hotel_id: hotel_id }, { __v: 0 });
        return res.status(200).json({
            output: rooms.length > 0 ? rooms.length : 0,
            message: "Rooms fetched successfully",
            jsonResponse: rooms.length > 0 ? rooms : null,
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
exports.getRoomsByHotel = getRoomsByHotel;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }
        const room = yield room_model_1.Room.findById({ _id: roomId });
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        yield room_model_1.Room.findByIdAndDelete(roomId);
        return res.status(200).json({
            output: 1,
            message: "Room deleted successfully",
            jsonResponse: null,
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
exports.deleteRoom = deleteRoom;
// Add Revew to Room by Room ID
const addRoomReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, userId, hotelId, rating, comment } = req.body;
        if (!roomId || !userId || !hotelId || !rating || !comment) {
            return res.status(400).json({
                output: 0,
                message: "Please provide all required fields",
                jsonResponse: null,
            });
        }
        const review = new room_review_model_1.Room_Review({
            user_id: userId,
            hotel_id: hotelId,
            room_id: roomId,
            rating,
            comment,
        });
        yield review.save();
        // update review count and rating in Room model
        const room = yield room_model_1.Room.findById({ _id: roomId });
        if (room) {
            room.reviews.push(review._id);
            const totalRating = ((room.rating ? +room.rating : 0) * (room.reviews.length - 1) + Number(rating)) / room.reviews.length;
            room.rating = +totalRating.toFixed(1);
            yield room.save();
        }
        else {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        return res.status(200).json({
            output: 1,
            message: "Review added successfully",
            jsonResponse: review,
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
exports.addRoomReview = addRoomReview;
