"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact_Enquery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const contactusSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    subject: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});
exports.Contact_Enquery = mongoose_1.default.model('Contact_Enquery', contactusSchema);
