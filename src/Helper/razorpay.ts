import Razorpay from "razorpay";

import dotenv from "dotenv";
const evn = "../.env";

dotenv.config({ path: evn });

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});