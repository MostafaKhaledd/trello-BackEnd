import { Schema, model, Types } from "mongoose";
const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    assignTo: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        default: "toDo",
        enum: ['toDo', 'Doing', 'Done']
    }
}, {
    timestamps: true
})

const taskModel = model("task", taskSchema)
export default taskModel