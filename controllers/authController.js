import ErrorHandler from "../middlewares/errorMiddleware";
import {User} from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendVerificationCode } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";


const registerUser = catchAsyncErrors(async (req, res, next) => {
    
    try {
        const {name, email, password} = req.body;
  
        if (!name || !email || !password) {
            return next(new ErrorHandler("Please provide all required fields", 400));
        }
        const isRegistered = await User.findOne({ email, accountVerified: true });
        if (isRegistered) {
            return next(new ErrorHandler("User already exists", 400));
        }
        const registrationAttemptByUser = await User.find({ email, accountVerified: false });
        if (registrationAttemptByUser.length >= 5) {
            return next(new ErrorHandler("Registration Attempt has reached maximum limits.Please contact support", 400));
        }
        if( password.length < 8||password.length > 20) {
            return next(new ErrorHandler("Password must be at least 6 characters long and 20 characters short", 400));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const verificationCode = await user.getVerificationCode();
        await user.save();
        sendVerificationCode(verificationCode,email,res);

        
    } catch (error) {
        return next(new ErrorHandler("Error registering user", 500));
    }
})