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
const deleteExistingImages = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinaryConfig_1.default.search
            .expression(`folder:uploads/profile/Id_${userID}`)
            .max_results(10) // Fetch up to 10 images in the folder
            .execute();
        if (result.resources.length > 0) {
            const deletePromises = result.resources.map((image) => cloudinaryConfig_1.default.uploader.destroy(image.public_id));
            yield Promise.all(deletePromises);
        }
    }
    catch (error) {
        console.error("Cloudinary Deletion Error:", error);
    }
});
// Multer storage setup
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinaryConfig_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = req.userID; // Make sure userID is available in the request
        yield deleteExistingImages(userID); // Delete old images before upload
        return {
            folder: `uploads/profile/Id_${userID}`, // Cloudinary folder
            public_id: `${Date.now()}_${file.originalname}`, // Unique file name
            format: "png", // Convert all uploads to PNG
            overwrite: true, // Ensures existing images are replaced
        };
    }),
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
