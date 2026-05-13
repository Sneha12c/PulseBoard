import mongoose, { Document, Schema} from "mongoose";
import bcrypt from "bcryptjs"

export interface IUser extends Document{
   username: string,
   email: string,
   password: string,
   isVerified: boolean,
   verificationToken?: string,
   refreshToken?: string,
   resetPasswordToken?: string,
   resetPasswordExpires?: Date
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 100,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minlength: 6,
        maxlength: 50,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {type: String, select: false},
    refreshToken: {type: String, select: false},
    resetPasswordToken: { type: String, select: false},
    resetPasswordExpires: { type: Date, select: false},
}, { timestamps: true})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
})

export const User = mongoose.model<IUser>("users", userSchema);
