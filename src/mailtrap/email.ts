import { client, sender } from "./mailtrap";
import { VerifyEmailTamplate, WelcomeEmailTamplate } from "./EmailTamplate";

const sendEmail = async (mail: any, emailType: string) => {
    try {
        if (!mail.to || !mail.from || !mail.subject || !mail.html) {
            throw new Error(`Missing required parameters for ${emailType} email.`);
        }

        await client.send(mail);
        console.log(`${emailType} email sent to ${mail.to}`);
    } catch (error) {
        console.error(`Error sending ${emailType} email:`, error);
        throw new Error(`Failed to send ${emailType} email.`);
    }
};

export const sendVerificationEmail = async (
    email: string, 
    name: string,
    verificationCode: string
): Promise<void> => {
    const mail = {
        to: [{ email }], // Ensure `to` is an array of objects
        from: sender,
        subject: "Verify Your Email Address",
        text: `Hello ${name},\n\nYour verification code is: ${verificationCode}.\n\nPlease enter this code to verify your account.\n\nThank you!`,
        html: VerifyEmailTamplate(name, verificationCode),
    };

    await sendEmail(mail, "Verification");
};



export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
    const mail = {
        to: email,
        from: sender,
        subject: "Welcome to Hotel Web",
        text: `Welcome to Hotel Web, ${name}!`,
        html: WelcomeEmailTamplate(name),
        categories: ["Welcome Email"],
    };

    await sendEmail(mail, "Welcome");
};

export const sendPasswordResetEmail = async (email: string, resetCode: string): Promise<void> => {
    const mail = {
        to: email,
        from: sender,
        subject: "Password Reset",
        text: `Use the following link to reset your password: ${resetCode}`,
        html: `<h1>Your password reset link: <a href="${resetCode}" target="_blank">${resetCode}</a></h1>`,
        categories: ["Password Reset"],
    };

    await sendEmail(mail, "Password Reset");
};

export const passwordResetConfirmationEmail = async (email: string): Promise<void> => {
    const mail = {
        to: email,
        from: sender,
        subject: "Password Reset Confirmation",
        text: `Your password has been reset successfully.`,
        html: `<h1>Your password has been reset successfully</h1>`,
        categories: ["Password Reset"],
    };

    await sendEmail(mail, "Password Reset Confirmation");
};
