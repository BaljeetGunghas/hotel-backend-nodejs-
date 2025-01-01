"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = void 0;
const generateVerificationCode = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters[randomIndex];
    }
    return verificationCode;
};
exports.generateVerificationCode = generateVerificationCode;
