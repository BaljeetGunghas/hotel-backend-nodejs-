"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const roomSchema = new mongoose_1.default.Schema({
    hostid: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    room_number: { type: Number, required: true },
    room_type: { type: String, enum: ['Single', 'Double', 'Suite', 'Family', 'Deluxe'], default: 'Single' },
    price_per_night: { type: Number, required: true }, //price per night
    max_occupancy: { type: Number }, //maximum occupancy
    features: { type: Object }, // JSON object for features
    floor_number: { type: Number },
    bed_type: { type: String, enum: ['Single', 'Double', 'Queen', 'King'] },
    availability_status: { type: Boolean, default: true },
    view_type: { type: String }, //city, sea, mountain, garden, pool
    smoking_allowed: { type: Boolean, default: false }, //smoking allowed or not
    description: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Room_Review' }],
    check_in_time: { type: String, default: "14:00" },
    check_out_time: { type: String, default: "12:00" }
}, { timestamps: true });
exports.Room = mongoose_1.default.model('Room', roomSchema);
