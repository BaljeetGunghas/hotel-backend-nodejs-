import { client, sender } from "./mailtrap";
import { VerifyEmailTamplate, WelcomeEmailTamplate } from "./EmailTamplate";

export const sendVerificationEmail = async (email: string, name: string, verificationCode: string) => {
    try {
        const mail = {
            to: email,
            from: sender,
            subject: "Verify your email address",
            text: `Your verification code is ${verificationCode}`,
            html: VerifyEmailTamplate(name, verificationCode),
            categories: "Email Verification",
        };
        await client.send(mail);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send verification email");
    }
}


export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const mail = {
            to: email,
            from: sender,
            subject: "Welcome to Hotel Web",
            text: `Welcome to Hotel Web`,
            html: WelcomeEmailTamplate(name),
            categories: "Welcome Email",
        };
        await client.send(mail);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email");
    }
}

export const sendPasswordResetEmail = async (email: string, resetCode: string) => {
    try {
        const mail = {
            to: email,
            from: sender,
            subject: "Password Reset",
            // text: `Your password reset link is ${resetCode}`,
            html: `<h1>Your password reset link is <a href={${resetCode}} target="_blank" > ${resetCode}</a> </h1>`,
            categories: "Password Reset",
        };
        await client.send(mail);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset email");
    }
}

export const passwordResetConfirmationEmail = async (email: string) => {
    try {
        const mail = {
            to: email,
            from: sender,
            subject: "Password Reset Confirmation",
            text: `Your password has been reset successfully`,
            html: `<h1>Your password has been reset successfully</h1>`,
            categories: "Password Reset",
        };
        await client.send(mail);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset confirmation email");
    }
}