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
exports.sendEmail = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
const evn = "../.env";
dotenv_1.default.config({ path: evn });
const resend = new resend_1.Resend(process.env.RESEND_API_KEY); // Store API key in .env
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield resend.emails.send({
            from: "onboarding@resend.dev", // Use a verified domain
            to: to,
            subject: subject,
            html: html,
        });
        console.log("Email sent successfully:", response);
        return response;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
});
exports.sendEmail = sendEmail;
