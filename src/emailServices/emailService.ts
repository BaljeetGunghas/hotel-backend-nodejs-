import { Resend } from "resend";
import dotenv from "dotenv";


const evn = "../.env";

dotenv.config({ path: evn });

const resend = new Resend(process.env.RESEND_API_KEY); // Store API key in .env

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // Use a verified domain
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
