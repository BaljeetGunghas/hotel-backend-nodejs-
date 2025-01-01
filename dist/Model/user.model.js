"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true }, //name
    email: { type: String, unique: true, required: true }, //email
    password: { type: String, required: true }, //password
    phone_number: { type: String, default: null }, //phone number
    role: { type: String, enum: ['customer', 'host', 'admin'], default: 'customer' },
    profile_picture: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' }, //active, inactive, banned
    date_of_birth: { type: Date, default: null },
    //advance 
    isVerified: { type: Boolean, default: false }, //email verification
    lastLogin: { type: Date, default: Date.now }, //last login
    resetPasswordToken: { type: String || null }, //reset password token
    resetPasswordExpires: { type: Date || null }, //reset password token expiry
    verificationToken: { type: String || null }, //email verification token
    verificationTokenExpires: { type: Date || null }, //email verification token expiry
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
