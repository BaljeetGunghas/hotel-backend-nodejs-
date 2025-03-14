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
exports.getHostHotelName = exports.hostDashboard = void 0;
const hotel_model_1 = require("../Model/hotel.model");
const hostDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hostId } = req.body;
        //hotel count with this host id 
        const totalHotels = yield hotel_model_1.Hotel.find({ hostid: hostId }).limit(2);
        const hotelCount = yield hotel_model_1.Hotel.countDocuments({ hostid: hostId });
        // Calculate average rating of hotels
        const ratingArr = totalHotels.map((h) => h.rating);
        // Calculate average rating
        const avgRating = ratingArr.length > 0
            ? +(ratingArr.reduce((sum, rating) => sum + rating, 0) / ratingArr.length).toFixed(1)
            : 0;
        return res.status(200).json({
            output: 1,
            message: 'ok',
            jsonResponse: {
                hotelCount,
                avgRating,
                hotels: totalHotels
            }
        });
    }
    catch (error) {
        res.status(500).json({
            output: 0,
            message: error.message,
        });
    }
});
exports.hostDashboard = hostDashboard;
const getHostHotelName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostid = req.userID;
        if (!hostid) {
            return res.status(200).json({
                output: 0,
                message: "Host_id is missing",
                jsonResponse: null,
            });
        }
        const hotelNameData = yield hotel_model_1.Hotel.find({ hostid }).select('_id, name');
        if (hotelNameData.length > 0) {
            return res.status(200).json({
                output: 1,
                message: 'ok',
                jsonResponse: hotelNameData
            });
        }
        else {
            return res.status(200).json({
                output: 0,
                message: 'No hotels found',
                jsonResponse: null
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null,
        });
    }
});
exports.getHostHotelName = getHostHotelName;
