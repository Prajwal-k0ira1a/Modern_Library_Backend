import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true ,trim:true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String,
        enum:["User", "Admin"], default: "User" },
        accountVerified: { type: Boolean, default: false },
        borrowedBooks: [{
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Borrow" },
            returned: { type: Boolean, default: false },
            bookTitle: String,
            borrowedDate:Date,
            dueDate: Date
        }],
avatar:{
    public_id: { type: String },
    url: { type: String}
},
verificationCode:Number,
verificationCodeExpire: Date,
resetPasswordToken: String,
resetPasswordExpire: Date,
},
{
    timestamps: true,
}
);
const User = mongoose.model("User", userSchema);
export default User;