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
    room_type: { type: String, enum: ['single', 'double', 'suite', 'family', 'deluxe'], default: 'single' },
    price_per_night: { type: Number, required: true }, //price per night
    max_occupancy: { type: Number, default: 3 }, //maximum occupancy
    floor_number: { type: Number, required: true },
    bed_type: { type: String, enum: ['single', 'double', 'queen', 'king'] },
    availability_status: { type: String, enum: ['available', 'occupied', 'under_maintenance'], default: 'available' },
    description: { type: String },
    amenities: { type: [String], default: null },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Room_Review' }],
    check_in_time: { type: String, default: "14:00" },
    check_out_time: { type: String, default: "12:00" },
    room_images: { type: [String], maxlength: 5, default: null },
}, { timestamps: true });
exports.Room = mongoose_1.default.model('Room', roomSchema);
