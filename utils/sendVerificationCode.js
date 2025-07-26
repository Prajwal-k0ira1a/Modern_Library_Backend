import sendEmail from "./sendEmail.js";
import { generateVerificationCodeMessage } from "./emailTemplates.js";

export default async function sendVerificationCode(verificationCode, email, res) {
    try{
        const message = generateVerificationCodeMessage(verificationCode);
        await sendEmail({
            email: email,
            subject: "Verify your email",
            message: message
        });
        res.status(200).json({
            success: true,
            message: "Verification code sent"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error sending verification code"
        });
    }
}


