"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.client = void 0;
const { MailtrapClient } = require("mailtrap");
exports.client = new MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN,
});
exports.sender = {
    email: "hello@demomailtrap.com",
    name: "Hotel Web",
};
