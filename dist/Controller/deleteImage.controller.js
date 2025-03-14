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
exports.deleteImage = void 0;
const cloudinaryConfig_1 = __importDefault(require("../Helper/cloudinaryConfig"));
const hotel_model_1 = require("../Model/hotel.model");
const room_model_1 = require("../Model/room.model");
const getPublicId = (url) => {
    return decodeURIComponent(url.replace(/^v\d+\//, "").replace(/\.[^.]+$/, ""));
};
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        let { public_id, _id, type, roomId } = req.body;
        const userId = req.userID;
        if (!public_id) {
            return res.status(200).json({
                output: 0,
                message: "Image ID is required",
                jsonResponse: null
            });
        }
        if (!userId) {
            return res.status(200).json({
                output: 0,
                message: "User ID is required",
                jsonResponse: null
            });
        }
        const updpublic_id = getPublicId(public_id);
        console.log("Extracted public_id:", updpublic_id);
        if (type === 'hotel') {
            const hotel = yield hotel_model_1.Hotel.findById(_id);
            if (!hotel) {
                return res.status(200).json({
                    output: 0,
                    message: "Hotel not found",
                    jsonResponse: null
                });
            }
            if (String(hotel.hostid) !== userId) {
                return res.status(200).json({
                    output: -401,
                    message: "You are not authorized to delete this image",
                    jsonResponse: null
                });
            }
            const response = yield cloudinaryConfig_1.default.uploader.destroy(updpublic_id);
            if (response.result !== "not found") {
                hotel.hotel_image = (_b = (_a = hotel.hotel_image) === null || _a === void 0 ? void 0 : _a.filter((image) => image !== public_id)) !== null && _b !== void 0 ? _b : null;
                yield hotel.save();
                return res.status(200).json({
                    output: 1,
                    message: "Hotel image deleted successfully",
                    jsonResponse: response
                });
            }
        }
        else if (type === 'room') {
            const room = yield room_model_1.Room.findById(_id);
            if (!room) {
                return res.status(200).json({
                    output: 0,
                    message: "Room not found",
                    jsonResponse: null
                });
            }
            if (String(room.hostid) !== userId) {
                return res.status(200).json({
                    output: -401,
                    message: "You are not authorized to delete this image",
                    jsonResponse: null
                });
            }
            const response = yield cloudinaryConfig_1.default.uploader.destroy(updpublic_id);
            if (response.result !== "not found") {
                room.room_images = (_d = (_c = room.room_images) === null || _c === void 0 ? void 0 : _c.filter((image) => image !== public_id)) !== null && _d !== void 0 ? _d : null;
                yield room.save();
                return res.status(200).json({
                    output: 1,
                    message: "Room image deleted successfully",
                    jsonResponse: response
                });
            }
        }
        return res.status(200).json({
            output: 0,
            message: "Something went wrong!",
            jsonResponse: null
        });
    }
    catch (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({
            output: 0,
            jsonResponse: null,
            message: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.deleteImage = deleteImage;
