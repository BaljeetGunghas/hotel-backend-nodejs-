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
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinaryConfig_1 = __importDefault(require("./cloudinaryConfig"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinaryConfig_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userID = req.userID;
        const hotelId = req.body.hotelId;
        const room_id = (_a = req.body) === null || _a === void 0 ? void 0 : _a.room_id;
        const folderpath = room_id ? `uploads/rooms/host-id_${userID}/Id_${room_id}` : `uploads/hotels/host-id_${userID}/Id_${hotelId}`;
        return {
            folder: folderpath, // Hotel-specific folder
            public_id: `${Date.now()}_${file.originalname}`, // Unique file name
            format: "png", // Convert to PNG
        };
    }),
});
const uploadMulti = (0, multer_1.default)({ storage }).array("images", 5); // Accept up to 5 images
exports.default = uploadMulti;
