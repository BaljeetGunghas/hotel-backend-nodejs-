"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hotel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const hotelSchema = new mongoose_1.default.Schema({
    hostid: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    owner_name: { type: String },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: Number, required: true },
    state: { type: Number, required: true },
    country: { type: Number, required: true },
    postal_code: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    rooms: { type: Number, default: 0 },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel_Review' }],
    policies: { type: Object }, // JSON object for policies like check-in, check-out, etc.
    cancellation_policy: { type: Object }, // JSON object for cancellation rules    
    contact_number: { type: Number, required: true, minlength: 10, maxlength: 10, unique: true },
    email: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });
exports.Hotel = mongoose_1.default.model('Hotel', hotelSchema);
