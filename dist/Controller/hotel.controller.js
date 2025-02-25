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
exports.addhotelReview = exports.deletespacificHotelbyHotelId = exports.updatespacificHotelbyHotelId = exports.createHotel = exports.getSpecificHotelDetailsByHotelId = exports.getspacificHotelbyHotelId = exports.getHotelsList = void 0;
const hotel_model_1 = require("../Model/hotel.model");
const room_model_1 = require("../Model/room.model");
const hotel_review_1 = require("../Model/hotel_review");
const room_review_model_1 = require("../Model/room_review.model");
const getHotelsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield hotel_model_1.Hotel.find().populate('hotel_reviews');
        res.status(200).json({
            output: 1,
            message: "Hotels fetched successfully",
            json: hotels.length > 0 ? hotels : null,
        });
    }
    catch (error) {
        res.status(500).json({
            output: 0,
            message: error.message,
        });
    }
});
exports.getHotelsList = getHotelsList;
const getspacificHotelbyHotelId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId } = req.body;
        if (!hotelId) {
            return res.status(400).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null
            });
        }
        const hotel = yield hotel_model_1.Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null
            });
        }
        return res.status(200).json({
            output: 1,
            message: "Hotel fetched successfully",
            json: hotel,
        });
    }
    catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
        });
    }
});
exports.getspacificHotelbyHotelId = getspacificHotelbyHotelId;
const getSpecificHotelDetailsByHotelId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId } = req.body;
        if (!hotelId) {
            return res.status(400).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null,
            });
        }
        // Fetch the hotel details
        const hotel = yield hotel_model_1.Hotel.findById(hotelId).select({ __v: 0 });
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null,
            });
        }
        // Fetch hotel reviews
        const hotelReviews = yield hotel_review_1.Hotel_Review.find({ hotel_id: hotelId }, { __v: 0 });
        // Fetch rooms in the hotel
        const rooms = yield room_model_1.Room.find({ hotel_id: hotelId }, { __v: 0 });
        // Fetch reviews for each room
        const roomsWithReviews = yield Promise.all(rooms.map((room) => __awaiter(void 0, void 0, void 0, function* () {
            const roomReviews = yield room_review_model_1.Room_Review.find({ room_id: room._id }, { __v: 0 });
            return Object.assign(Object.assign({}, room.toObject()), { reviews: roomReviews.length > 0 ? roomReviews : null });
        })));
        // Construct the response object
        return res.status(200).json({
            output: 1,
            message: "Hotel fetched successfully",
            jsonResponse: Object.assign(Object.assign({}, hotel.toObject()), { reviews: hotelReviews.length > 0 ? hotelReviews : null, rooms: roomsWithReviews.length > 0 ? roomsWithReviews : null }),
        });
    }
    catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
        });
    }
});
exports.getSpecificHotelDetailsByHotelId = getSpecificHotelDetailsByHotelId;
const createHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hostid, name, owner_name, description, address, city, state, country, postal_code, policies, cancellation_policy, contact_number, email, status, } = req.body;
        const hotelexist = yield hotel_model_1.Hotel.findOne({ contact_number: contact_number });
        if (hotelexist) {
            return res.status(400).json({
                output: 0,
                message: "Hotel already exist with this contact number",
                jsonResponse: null
            });
        }
        // Create an object with only the defined values
        const hotelData = {
            hostid,
            name,
            owner_name,
            description,
            address,
            city,
            state,
            country,
            postal_code,
            policies,
            cancellation_policy,
            contact_number,
            email,
            status,
        };
        const filteredHotelData = Object.fromEntries(Object.entries(hotelData).filter(([_, value]) => value !== undefined && value !== null));
        const hotel = new hotel_model_1.Hotel(filteredHotelData);
        yield hotel.save();
        // Send success response
        res.status(201).json({
            output: 1,
            message: "Hotel created successfully",
            json: hotel,
        });
    }
    catch (error) {
        res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null
        });
    }
});
exports.createHotel = createHotel;
const updatespacificHotelbyHotelId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { hotelId, name, owner_name, description, address, city, state, country, postal_code, policies, cancellation_policy, contact_number, email, status } = req.body;
        if (!hotelId) {
            return res.status(400).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null
            });
        }
        const hotel = yield hotel_model_1.Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null
            });
        }
        if (req.userID !== hotel.hostid.toString()) {
            return res.status(403).json({
                output: 0,
                message: "You are not authorized to update this hotel",
                jsonResponse: null
            });
        }
        const hotelData = {
            name,
            owner_name,
            description,
            address,
            city,
            state,
            country,
            postal_code,
            policies,
            cancellation_policy,
            contact_number,
            email,
            status,
        };
        const filteredHotelData = Object.fromEntries(Object.entries(hotelData).filter(([_, value]) => value !== undefined && value !== null));
        const currentImages = hotel.hotel_image || [];
        const newImages = (_b = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.map((file) => { var _a; return ((_a = file === null || file === void 0 ? void 0 : file.path) === null || _a === void 0 ? void 0 : _a.split("image/upload/")[1]) || null; })) !== null && _b !== void 0 ? _b : [];
        const updatedImages = [...currentImages, ...newImages];
        if (updatedImages.length) {
            filteredHotelData.hotel_image = updatedImages;
        }
        const updatedHotel = yield hotel_model_1.Hotel.findByIdAndUpdate(hotelId, filteredHotelData, { new: true });
        return res.status(200).json({
            output: 1,
            message: "Hotel updated successfully",
            jsonResponse: updatedHotel,
        });
    }
    catch (error) {
        console.error("Error updating hotel:", error); // Log the error for debugging
        return res.status(500).json({
            output: 0,
            message: "An error occurred while updating the hotel.",
            error: error.message, // Optionally include the error message
        });
    }
});
exports.updatespacificHotelbyHotelId = updatespacificHotelbyHotelId;
const deletespacificHotelbyHotelId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId } = req.body;
        if (!hotelId) {
            return res.status(400).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null
            });
        }
        const hotel = yield hotel_model_1.Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null
            });
        }
        yield hotel_model_1.Hotel.findById(hotelId).deleteOne();
        return res.status(200).json({
            output: 1,
            message: "Hotel deleted successfully",
            jsonResponse: null
        });
    }
    catch (error) {
        console.error("Error deleting hotel:", error); // Log the error for debugging
        return res.status(500).json({
            output: 0,
            message: "An error occurred while deleting the hotel.",
            error: error.message, // Optionally include the error message
        });
    }
});
exports.deletespacificHotelbyHotelId = deletespacificHotelbyHotelId;
const addhotelReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hotelId, userId, rating, comment } = req.body;
        if (!hotelId || !userId || !rating || !comment) {
            return res.status(400).json({
                output: 0,
                message: "Hotel ID, User ID, Rating, and Comment are required",
                jsonResponse: null
            });
        }
        const hotel = yield hotel_model_1.Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null
            });
        }
        ;
        const review = yield hotel_review_1.Hotel_Review.create({ hotel_id: hotelId, user_id: userId, rating, comment });
        hotel.reviews.push(review._id);
        const totalRating = ((+hotel.rating || 0) * (hotel.reviews.length - 1) + Number(rating)) / hotel.reviews.length;
        hotel.rating = +totalRating.toFixed(1);
        yield hotel.save();
        return res.status(201).json({
            output: 1,
            message: "Review added successfully",
            jsonResponse: review,
        });
    }
    catch (error) {
        console.error("Error adding hotel review:", error); // Log the error for debugging
        return res.status(500).json({
            output: 0,
            message: "An error occurred while adding the review.",
            error: error.message, // Optionally include the error message
        });
    }
});
exports.addhotelReview = addhotelReview;
