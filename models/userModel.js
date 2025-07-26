import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["User", "Admin"], default: "User"
    },
    accountVerified: { type: Boolean, default: false },
    borrowedBooks: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Borrow" },
        returned: { type: Boolean, default: false },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date
    }],
    avatar: {
        public_id: { type: String },
        url: { type: String }
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
    {
        timestamps: true,
    }
);
userSchema.methods.getVerificationCode = function () {
    function generateRandomNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, 0); // Ensure first digit is not zero
        return parseInt(firstDigit.toString() + remainingDigits);
    }
    const verificationCode = generateRandomNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // Code valid for 10 minutes
    return verificationCode;
};
userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const User = mongoose.model("User", userSchema);
export default User;