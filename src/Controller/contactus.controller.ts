import { Request, Response } from "express";
import { Contact_Enquery } from "../Model/contactus.model";
import { sendEmail } from "../emailServices/emailService";
import { ContactUsEmailTamplate } from "../emailServices/EmailTamplate";

export const createContactUs = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(200).json({
                output: 0,
                message: "All fields are required",
                jsonResponse: null
            });
        }

        await new Contact_Enquery({
            name,
            email,
            subject,
            message
        }).save();
        // Send email logic can be added here
        // For example, using nodemailer to send an email

        const formatedTemplate = await ContactUsEmailTamplate(name, email, subject, message);
        const response = await sendEmail('jaatmrharyanvi@gmail.com', subject, formatedTemplate);

        res.status(201).json({
            output: 1,
            message: "Contact Us message sent successfully",
            jsonResponse: response,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null
        });
    }
}