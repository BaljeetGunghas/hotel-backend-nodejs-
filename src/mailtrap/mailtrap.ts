import { MailtrapClient } from "mailtrap";
const evn = "../.env";
import dotenv from 'dotenv';

dotenv.config({ path: evn });

console.log(process.env.MAILTRAP_API_TOKEN,'process.env.MAILTRAP_API_TOKEN');

if (!process.env.MAILTRAP_API_TOKEN) {
    throw new Error("MAILTRAP_API_TOKEN is missing from environment variables1.");
}

export const client = new MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN,
});

export const sender = {
    email: "hello@demomailtrap.com",
    name: "Hotel Web",
};
