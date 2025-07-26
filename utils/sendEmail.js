import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const sendEmail = async ({ email, subject, message, html }) => {
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: subject,
    html: html || message,
};
await transporter.sendMail(mailOptions);

}
export default sendEmail;
