class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
import User from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import sendVerificationCode from "../utils/sendVerificationCode.js";
import bcrypt from "bcryptjs";
import {sendToken} from "../utils/sendToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
    console.log("=== REGISTRATION STARTED ===");
    console.log("req.body:", req.body);
    console.log("req.body type:", typeof req.body);
    console.log("Content-Type:", req.headers['content-type']);
    
    if (!req.body) {
        console.log("req.body is undefined or null");
        return next(new ErrorHandler("Request body is missing", 400));
    }
    
    try {
        const { name, email, password } = req.body;
        console.log("Extracted fields:", { name, email, password: password ? "***" : undefined });

        if (!name || !email || !password) {
            console.log("Missing required fields");
            return next(new ErrorHandler("Please provide all required fields", 400));
        }

        console.log("All fields provided");
        console.log("Checking if user already exists...");

        // Check for any user with this email (verified or not)
        const existingUser = await User.findOne({ email });
        console.log("Existing user:", existingUser ? "Found" : "Not found");

        if (existingUser) {
            if (existingUser.accountVerified) {
                console.log("User already exists and is verified");
                return next(new ErrorHandler("User already exists", 400));
            } else {
                console.log("User exists but not verified - resending code");
                const verificationCode = await existingUser.getVerificationCode();
                await existingUser.save();
                return await sendVerificationCode(verificationCode, email, res);
            }
        }

        console.log("Checking registration attempts...");
        const registrationAttemptByUser = await User.find({ email, accountVerified: false });
        console.log("Previous attempts:", registrationAttemptByUser.length);

        if (registrationAttemptByUser.length >= 5) {
            console.log("Too many registration attempts");
            return next(new ErrorHandler("Registration Attempt has reached maximum limits.Please contact support", 400));
        }

        console.log("Validating password length...");
        if (password.length < 8 || password.length > 20) {
            console.log("Invalid password length:", password.length);
            return next(new ErrorHandler("Password must be at least 8 characters long and 20 characters short", 400));
        }

        console.log("Password validation passed");
        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed");

        console.log("Creating user in database...");
        const user = await User.create({ name, email, password: hashedPassword });
        console.log("User created with ID:", user._id);

        console.log("Generating verification code...");
        const verificationCode = await user.getVerificationCode();
        console.log("Verification code generated:", verificationCode);

        console.log("Saving user with verification code...");
        await user.save();
        console.log("User saved");

        console.log("Sending verification email...");
        await sendVerificationCode(verificationCode, email, res);
        console.log("Email sent successfully");

    } catch (error) {
        console.log("ERROR in registration:", error.message);
        console.log("Error stack:", error.stack);
        return next(new ErrorHandler("Error registering user", 500));
    }
})


export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    console.log("=== OTP VERIFICATION STARTED ===");
    console.log("req.body:", req.body);
    console.log("req.body type:", typeof req.body);
    console.log("Content-Type:", req.headers['content-type']);
    
    if (!req.body) {
        console.log("req.body is undefined or null");
        return next(new ErrorHandler("Request body is missing", 400));
    }
    
    const { email, otp } = req.body;
    console.log("Extracted fields:", { email, otp });
    
    if (!email || !otp) {
        return next(new ErrorHandler("Please provide email and OTP", 400));
    }
    
    try {
        const userAllEntries = await User.find({ email, accountVerified: false }).sort({ createdAt: -1 });
        if (!userAllEntries || userAllEntries.length === 0) {
            return next(new ErrorHandler("No pending verification found", 404));
        }
        
        let user;
        if (userAllEntries.length > 1) {
            user = userAllEntries[0];
            await User.deleteMany({
                _id: { $ne: user._id },
                email, 
                accountVerified: false,
            })
        } else {
            user = userAllEntries[0];
        }
        
        if (user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP", 400));
        }
        
        const currentTime = Date.now();
        const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP expired", 400));
        }
        
        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;
        await user.save({ validateModifiedOnly: true });

        sendToken(user, 200, "Account verified successfully", res);

    } catch (error) {
        console.log("ERROR in OTP verification:", error.message);
        return next(new ErrorHandler("Error verifying OTP", 500));
    }
})






