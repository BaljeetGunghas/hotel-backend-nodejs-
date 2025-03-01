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
const getPublicId = (url) => {
    return url
        .replace(/^v\d+\//, "") // Remove version prefix
        .replace(/\.[^.]+$/, ""); // Remove file extension
};
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { public_id, hotelId, type } = req.body;
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
        if (type === 'hotel') {
            const hotel = yield hotel_model_1.Hotel.findById(hotelId);
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
            const updpublic_id = getPublicId(public_id);
            const respons = yield cloudinaryConfig_1.default.uploader.destroy(updpublic_id);
            const hotelImage = hotel.hotel_image;
            const filteredImage = hotelImage === null || hotelImage === void 0 ? void 0 : hotelImage.filter((image) => image !== public_id);
            hotel.hotel_image = filteredImage !== null && filteredImage !== void 0 ? filteredImage : null;
            hotel.save();
            return res.status(200).json({
                output: 1,
                message: "Image deleted successfully",
                jsonResponse: respons
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(500).json({
                output: 0,
                jsonResponse: null,
                message: error.message
            });
        }
        else {
            console.log(String(error));
            res.status(500).json({
                output: 0,
                jsonResponse: null,
                message: String(error)
            });
        }
    }
});
exports.deleteImage = deleteImage;
