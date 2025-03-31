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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactUs = void 0;
const contactus_model_1 = require("../Model/contactus.model");
const emailService_1 = require("../emailServices/emailService");
const EmailTamplate_1 = require("../emailServices/EmailTamplate");
const createContactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(200).json({
                output: 0,
                message: "All fields are required",
                jsonResponse: null
            });
        }
        yield new contactus_model_1.Contact_Enquery({
            name,
            email,
            subject,
            message
        }).save();
        // Send email logic can be added here
        // For example, using nodemailer to send an email
        const formatedTemplate = yield (0, EmailTamplate_1.ContactUsEmailTamplate)(name, email, subject, message);
        const response = yield (0, emailService_1.sendEmail)('jaatmrharyanvi@gmail.com', subject, formatedTemplate);
        res.status(201).json({
            output: 1,
            message: "Contact Us message sent successfully",
            jsonResponse: response,
        });
    }
    catch (error) {
        return res.status(500).json({
            output: 0,
            message: error.message,
            jsonResponse: null
        });
    }
});
exports.createContactUs = createContactUs;
