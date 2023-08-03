import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
export const auth = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(new Error("authorization is required", { cause: 401 }))
    }
    const token = authorization.split(process.env.TOKEN_BEARER)[1]
    if (!token) {
        return next(new Error("in-valid token", { cause: 401 }))
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
    if (!decoded?.id) {
        return next(new Error("In-valid Payload", { cause: 400 }))
    }
    const user = await userModel.findById(decoded.id)
    if (!user) {
        return next(new Error("In-valid account", { cause: 404 }))
    }
    req.user = user
    return next()
})