import { generateVerificationCodeMessage } from "./emailTemplates.js";

export  async function sendVerificationCode(verificationCode, email, res) {
    try{
        const message =generateVerificationCodeMessage(verificationCode);
        await sendEmail({
            to: email,
            subject: "Verify your email",
            text: message
        });
        res.status(200).json({
            success: true,
            message: "Verification code sent"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error sending verification code"
        });
    }
}