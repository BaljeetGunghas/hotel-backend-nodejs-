"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room_Review = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const reviewSchema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel' },
    room_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Room' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: [] }],
    dislikes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: [] }],
    // images: [{ type: String }], // Array of image URLs
    created_at: { type: Date, default: Date.now },
});
exports.Room_Review = mongoose_1.default.model('Room_Review', reviewSchema);
