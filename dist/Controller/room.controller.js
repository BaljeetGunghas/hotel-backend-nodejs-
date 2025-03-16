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
exports.addRoomReview = exports.deleteRoom = exports.getRoomsByHotel = exports.updateRoom = exports.createRoom = exports.getSpacificRoombyRoomId = exports.getSpacificCompleteRoombyRoomId = exports.gethostAllRoom = exports.searchRooms = exports.getAllRooms = void 0;
const room_model_1 = require("../Model/room.model");
const hotel_model_1 = require("../Model/hotel.model");
const room_review_model_1 = require("../Model/room_review.model");
const booking_model_1 = require("../Model/booking.model");
const getHotelByCity_1 = require("../Helper/getHotelByCity");
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
const searchRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { city, check_in_date, check_out_date, adults, children, minPrice, maxPrice, amenities, rating, page } = req.query;
        if (!city || !check_in_date || !check_out_date) {
            return res.status(400).json({ message: "City, check-in, and check-out dates are required" });
        }
        const checkInDate = new Date(check_in_date);
        const checkOutDate = new Date(check_out_date);
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
            return res.status(400).json({ message: "Invalid check-in or check-out date" });
        }
        const parsedPage = parseInt(page) || 1;
        const parsedLimit = 3;
        // Get booked room IDs in the given date range
        const bookedRooms = yield booking_model_1.Booking.find({
            check_in_date: { $lt: checkOutDate },
            check_out_date: { $gt: checkInDate },
            booking_status: { $in: ["pending", "confirmed"] }
        }).distinct("room_id");
        // Get properties in the specified city
        const propertyIDs = yield (0, getHotelByCity_1.getHotelByCity)(city);
        if (!propertyIDs.length) {
            return res.status(404).json({ message: "No hotels found in the selected city." });
        }
        // Construct query for available rooms
        let query = {
            hotel_id: { $in: propertyIDs },
            _id: { $nin: bookedRooms },
        };
        // Additional filters
        const totalGuests = (parseInt(adults) || 0) + (parseInt(children) || 0);
        if (totalGuests > 0)
            query.max_occupancy = { $gte: totalGuests };
        if (Number(minPrice) > 0 && Number(maxPrice) > 0) {
            query.price_per_night = {
                $gte: Number(minPrice),
                $lte: Number(maxPrice)
            };
        }
        if (amenities)
            query.amenities = { $all: amenities };
        if (rating)
            query.rating = { $gte: parseFloat(rating) };
        // Fetch available rooms with pagination
        const availableRooms = yield room_model_1.Room.find(query)
            .select("room_images _id amenities room_type price_per_night max_occupancy bed_type rating check_in_time check_out_time")
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit);
        const formattedRooms = availableRooms.map(room => {
            var _a;
            return ({
                amenities: room.amenities,
                image: ((_a = room.room_images) === null || _a === void 0 ? void 0 : _a.length) ? room.room_images[0] : null,
                _id: room._id,
                room_type: room.room_type,
                price_per_night: room.price_per_night,
                max_occupancy: room.max_occupancy,
                bed_type: room.bed_type,
                rating: room.rating,
                check_in_time: room.check_in_time,
                check_out_time: room.check_out_time
            });
        });
        const totalRooms = yield room_model_1.Room.countDocuments(query);
        res.status(200).json({
            output: availableRooms === null || availableRooms === void 0 ? void 0 : availableRooms.length,
            message: 'ok',
            jsonResponse: {
                rooms: formattedRooms,
                totalPages: Math.ceil(totalRooms / parsedLimit),
                currentPage: parsedPage
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.searchRooms = searchRooms;
const gethostAllRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostid = req.userID;
        if (!hostid) {
            return res.status(200).json({
                output: 0,
                message: "Host_id is missing",
                jsonResponse: null,
            });
        }
        const rooms = yield room_model_1.Room.find({ hostid })
            .populate('hotel_id', " _id name");
        return res.status(200).json({
            output: rooms.length,
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
exports.gethostAllRoom = gethostAllRoom;
const getSpacificCompleteRoombyRoomId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getSpacificCompleteRoombyRoomId = getSpacificCompleteRoombyRoomId;
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
        const room = yield room_model_1.Room.findById({ _id: roomId }, { __v: 0, reviews: 0 }).populate('hotel_id', " _id name");
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        return res.status(200).json({
            output: 1,
            message: "Room fetched successfully",
            jsonResponse: room,
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
        const { hotel_id, room_number, room_type, price_per_night, max_occupancy, floor_number, bed_type, availability_status, amenities, description, rating, check_in_time, check_out_time, } = req.body;
        const hostid = req.userID;
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
            return res.status(200).json({
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
            amenities,
            price_per_night,
            max_occupancy,
            floor_number,
            bed_type,
            availability_status,
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
    var _a, _b;
    try {
        const { room_id, room_number, room_type, price_per_night, max_occupancy, floor_number, bed_type, amenities, availability_status, description, check_in_time, check_out_time, } = req.body;
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
        if (req.userID !== room.hostid.toString()) {
            return res.status(403).json({
                output: 0,
                message: "You are not authorized to update this room!",
                jsonResponse: null
            });
        }
        const parsedViewType = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
        const updatedRoom = {
            room_number: room_number || room.room_number,
            room_type: room_type || room.room_type,
            price_per_night: price_per_night || room.price_per_night,
            max_occupancy: max_occupancy || room.max_occupancy,
            floor_number: floor_number || room.floor_number,
            bed_type: bed_type || room.bed_type,
            availability_status: availability_status || room.availability_status,
            description: description || room.description,
            check_in_time: check_in_time || room.check_in_time,
            check_out_time: check_out_time || room.check_out_time,
            room_images: room.room_images,
            amenities: Array.isArray(parsedViewType) ? parsedViewType : room.amenities,
        };
        const currentImages = room.room_images || [];
        const newImages = (_b = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.map((file) => { var _a; return ((_a = file === null || file === void 0 ? void 0 : file.path) === null || _a === void 0 ? void 0 : _a.split("image/upload/")[1]) || null; })) !== null && _b !== void 0 ? _b : [];
        const updatedImages = [...currentImages, ...newImages];
        if (updatedImages.length) {
            updatedRoom.room_images = updatedImages;
        }
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
