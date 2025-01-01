"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const amenitySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Hotel', 'Room'], required: true },
    description: { type: String },
    is_paid: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});
module.exports = mongoose_1.default.model('Amenity', amenitySchema);
