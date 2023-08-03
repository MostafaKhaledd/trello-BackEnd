import Joi from 'joi'
export const signup = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(25),
    lastName: Joi.string().alphanum().min(3).max(25),
    userName: Joi.string().required().alphanum().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)).required(),
    cPassword: Joi.string().valid(Joi.ref("password")).required(),
    age: Joi.number().integer().min(18).max(100),
    phone: Joi.string().pattern(new RegExp(/^(010|011|012|015)\d{8}$/)).max(11),
    gender: Joi.string().valid('Male', 'Female')
}).required()
export const confirmEmail = Joi.object({
    token: Joi.string().min(64).max(300).required(),
}).required()
export const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)).required(),
}).required()
export const changePassword = Joi.object({
    authorization: Joi.string().min(64).max(300).required(),
    oldPassword: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)).required(),
    newPassword: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)).required(),
    cPassword: Joi.string().valid(Joi.ref("newPassword")).required()
}).required()
export const updateUser = Joi.object({
    authorization: Joi.string().min(64).max(300).required(),
    age: Joi.number().integer().min(18).max(100),
    userName: Joi.string().alphanum().min(3).max(30),
    phone: Joi.string().pattern(new RegExp(/^(010|011|012|015)\d{8}$/)).max(11),
}).required()
export const authorizationCheck = Joi.object({
    authorization: Joi.string().min(64).max(300).required(),
}).required()
