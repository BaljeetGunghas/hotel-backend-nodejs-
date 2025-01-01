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
exports.passwordResetConfirmationEmail = exports.sendPasswordResetEmail = exports.sendWelcomeEmail = exports.sendVerificationEmail = void 0;
const mailtrap_1 = require("./mailtrap");
const EmailTamplate_1 = require("./EmailTamplate");
const sendVerificationEmail = (email, name, verificationCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = {
            to: email,
            from: mailtrap_1.sender,
            subject: "Verify your email address",
            text: `Your verification code is ${verificationCode}`,
            html: (0, EmailTamplate_1.VerifyEmailTamplate)(name, verificationCode),
            categories: "Email Verification",
        };
        yield mailtrap_1.client.send(mail);
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send verification email");
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendWelcomeEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = {
            to: email,
            from: mailtrap_1.sender,
            subject: "Welcome to Hotel Web",
            text: `Welcome to Hotel Web`,
            html: (0, EmailTamplate_1.WelcomeEmailTamplate)(name),
            categories: "Welcome Email",
        };
        yield mailtrap_1.client.send(mail);
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email");
    }
});
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendPasswordResetEmail = (email, resetCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = {
            to: email,
            from: mailtrap_1.sender,
            subject: "Password Reset",
            // text: `Your password reset link is ${resetCode}`,
            html: `<h1>Your password reset link is <a href={${resetCode}} target="_blank" > ${resetCode}</a> </h1>`,
            categories: "Password Reset",
        };
        yield mailtrap_1.client.send(mail);
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset email");
    }
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const passwordResetConfirmationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = {
            to: email,
            from: mailtrap_1.sender,
            subject: "Password Reset Confirmation",
            text: `Your password has been reset successfully`,
            html: `<h1>Your password has been reset successfully</h1>`,
            categories: "Password Reset",
        };
        yield mailtrap_1.client.send(mail);
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset confirmation email");
    }
});
exports.passwordResetConfirmationEmail = passwordResetConfirmationEmail;
