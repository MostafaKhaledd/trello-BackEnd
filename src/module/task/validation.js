import Joi from 'joi'
export const addTask = Joi.object({
    authorization: Joi.string().min(64).max(300).required(),
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).required(),
    deadline: Joi.date().iso().required(),
    assignTo: Joi.string().min(5).max(30).required()
}).required()
export const authorizationCheck = Joi.object({
    authorization: Joi.string().min(64).max(300).required()
}).required()
export const getTasksAssignToAnyUser = Joi.object({
    authorization: Joi.string().min(64).max(300).required(),
    id: Joi.string().min(5).max(30).required()
}).required()
export const updateTask = Joi.object({
    authorization: Joi.string().min(64).max(300).required(),
    taskId: Joi.string().min(5).max(30).required(),
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).required(),
    deadline: Joi.date().iso().required(),
    status: Joi.string().valid('Done', 'Doing', "toDo"),
    assignTo: Joi.string().min(5).max(30).required()
}).required()
export const deleteTask = Joi.object({
    authorization: Joi.string().min(64).max(300).required(),
    taskId: Joi.string().min(5).max(30).required(),
}).required()
