import taskModel from "../../../../DB/model/task.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from '../../../utils/errorHandling.js';
export const addTask = asyncHandler(async (req, res, next) => {
    const { title, description, deadline, assignTo } = req.body;
    console.log(title, description, deadline, assignTo);
    const userAddedTask = await userModel.findById(req.user._id)
    if (!userAddedTask) {
        return next(new Error("In-vaild user ID", { cause: 401 }))
    }
    const userTakeTask = await userModel.findById(assignTo)
    if (!userTakeTask) {
        return next(new Error("this user you want to assign this task not exist"), { cause: 404 })
    }
    if (new Date(deadline) <= new Date()) {
        return next(new Error("Enter vaild date", { cause: 401 }))
    }
    if (userAddedTask.isOnline == true && userAddedTask.isDeleted == false) {
        const task = await taskModel.create({ title, description, deadline, assignTo, userId: userAddedTask.id })
        return res.status(200).json({ massage: "Done", task });
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const getAllTasks = asyncHandler(async (req, res, next) => {
    const tasklist = await taskModel.find().populate([
        {
            path: "userId",
            select: 'email userName'
        },
        {
            path: "assignTo",
            select: 'email userName'
        }
    ])
    return res.status(200).json({ massage: "Done", tasklist });
})
export const getAllCreatedTasks = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const tasklist = await taskModel.find({ userId: user.id }).populate([
            {
                path: "userId",
                select: 'email userName'
            },
            {
                path: "assignTo",
                select: 'email userName'
            }
        ])
        return res.status(200).json({ massage: "Done", tasklist });
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const getAllAssignTasks = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const tasklist = await taskModel.find({ assignTo: user.id }).populate([
            {
                path: "userId",
                select: 'email userName'
            },
            {
                path: "assignTo",
                select: 'email userName'
            }
        ])
        return res.status(200).json({ massage: "Done", tasklist });
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const allLateTasks = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    const date = new Date()
    const currentDate = date.toISOString().split('T')[0]
    console.log(currentDate);
    if (!user) {
        return next(new Error("In-valid account", { cause: 401 }))
    }
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const tasklist = await taskModel.find({ userId: user.id, deadline: { $lt: currentDate } }).populate([
            {
                path: "userId",
                select: 'email userName'
            },
            {
                path: "assignTo",
                select: 'email userName'
            }
        ])
        return res.status(200).json({ massage: "Done", tasklist });
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const getTasksAssignToAnyUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const { id } = req.params
        const tasklist = await taskModel.find({ assignTo: id }).populate([
            {
                path: "userId",
                select: 'email userName'
            },
            {
                path: "assignTo",
                select: 'email userName'
            }
        ])
        return res.status(200).json({ massage: "Done", tasklist });
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const updateTask = asyncHandler(async (req, res, next) => {
    const { taskId } = req.params
    const { title, description, deadline, status, assignTo } = req.body
    const task = await taskModel.findById({ _id: taskId })
    if (!task) {
        return next(new Error("In-valid task ID", { cause: 401 }))
    }
    const user = await userModel.findById(req.user._id)
    if (task.userId != user.id) {
        return next(new Error("You arenot allowed to update this task", { cause: 403 }))
    }
    const userTakeTask = await userModel.findById(assignTo)
    if (!userTakeTask) {
        return next(new Error("this user you want to assign this task not exist", { cause: 404 }))
    }
    if (new Date(deadline) <= new Date()) {
        return next(new Error("Enter vaild date", { cause: 400 }))
    }
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const taskupdate = await taskModel.findByIdAndUpdate({ _id: taskId }, { title, description, deadline, status, assignTo })
        return res.status(200).json({ message: "Done", taskupdate })
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const deleteTask = asyncHandler(async (req, res, next) => {
    const { taskId } = req.params
    const task = await taskModel.findById({ _id: taskId })
    if (!task) {
        return next(new Error("In-valid task ID", { cause: 401 }))
    }
    const user = await userModel.findById(req.user._id)
    if (task.userId != user.id) {
        return next(new Error("You arenot allowed to delete this task", { cause: 403 }))
    }
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const taskdelete = await taskModel.findByIdAndDelete({ _id: taskId })
        return res.status(200).json({ message: "Done", taskdelete })
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
