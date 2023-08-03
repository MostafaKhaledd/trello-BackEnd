
import { Schema, model, Types } from "mongoose";
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: Number,
    gender: {
        type: String,
        default: "Male",
        enum: ['Male', 'Female']
    },
    phone: {
        type: Number,
    },
    posts: [{
        type: Types.ObjectId,
        ref: "post"
    }],
    confirmEmail: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const userModel = model("User", userSchema)
export default userModel