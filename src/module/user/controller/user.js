import userModel from '../../../../DB/model/User.model.js'
import CryptoJS from "crypto-js";
import { asyncHandler } from '../../../utils/errorHandling.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../../../utils/email.js';
import cloudinary from '../../../utils/cloudinary.js';
export const signup = asyncHandler(async (req, res, next) => {
    const { gender, phone, userName, password, email, cPassword } = req.body
    console.log({ gender, phone, userName, password, email, cPassword });
    const secretKey = process.env.SECRETKEY
    if (password != cPassword) {
        return next(new Error("Mismatch password and cpassword", { cause: 400 }))
    }
    const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
    const chechUserEmail = await userModel.findOne({ email: email })
    if (chechUserEmail) {
        return next(new Error("Email Exist", { cause: 400 }))
    }
    const newUser = new userModel({ gender, phone, userName, password: encryptedPassword, email })
    const user = await newUser.save()
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SIGNATURE, { expiresIn: 60 * 10 })
    const newEmailToken = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SIGNATURE)
    const link = `${req.protocol}://${req.headers.host}/user/ConfirmEmail/${token}`
    const requestNewEmailLink = `${req.protocol}://${req.headers.host}/user/requestNewConfirmEmail/${newEmailToken}`
    console.log(link);
    await sendEmail({
        to: email,
        subject: "ConfirmEmail",
        html: `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body style="margin:0px;"> 
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
        <td>
        <table border="0" width="100%">
        <tr>
        <td>
        <h1>
            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
        </h1>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
        <tr>
        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding:0px 100px;">
        </p>
        </td>
        </tr>
        <tr>
        <td>
        <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
        </td>
        </tr>
        <br>
        <br>
        <tr>
        <td>
        <a href="${requestNewEmailLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">New Confirm Email</a>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
        <tr>
        <td>
        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
        </td>
        </tr>
        <tr>
        <td>
        <div style="margin-top:20px;">

        <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
        
        <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
        </a>
        
        <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
        </a>

        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`
    })
    return res.status(200).json({ message: "Done", user })
})
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
    const user = await userModel.findByIdAndUpdate({ _id: decoded.id }, { confirmEmail: true })
    return user ? res.redirect("http://localhost:5000") : res.send("<a href='http://localhost:5000'>Not register User please follow the below link to signup</a>")//front-end page missed http://localhost:5000
})
export const newConfirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
    const user = await userModel.findById({ _id: decoded.id })
    if (!user) {
        return res.send("<a href='http://localhost:5000'>Not register User please follow the below link to signup</a>")//front-end page to signUp
    }
    if (user.confirmEmail) {
        return res.redirect("http://localhost:5000")//front-end page to logIn
    }
    const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SIGNATURE, { expiresIn: 60 * 5 })
    const link = `${req.protocol}://${req.headers.host}/user/ConfirmEmail/${newToken}`
    console.log(link);
    await sendEmail({
        to: user.email,
        subject: "ConfirmEmail",
        html: `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body style="margin:0px;"> 
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
        <td>
        <table border="0" width="100%">
        <tr>
        <td>
        <h1>
            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
        </h1>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
        <tr>
        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding:0px 100px;">
        </p>
        </td>
        </tr>
        <tr>
        <td>
        <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
        <tr>
        <td>
        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
        </td>
        </tr>
        <tr>
        <td>
        <div style="margin-top:20px;">

        <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
        
        <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
        </a>
        
        <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
        </a>

        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`
    })
    return res.send(`<p>Check your inbox now</p>`)
})
export const logIn = asyncHandler(async (req, res, next) => {
    const { password, email } = req.body
    const secretKey = process.env.SECRETKEY
    const user = await userModel.findOne({ email: email })
    if (!user) {
        return next(new Error("In-valid email or password", { cause: 401 }))
    }
    if (user.confirmEmail == false) {
        return next(new Error("your email doesn`t confirm", { cause: 401 }))
    }
    const decryptedPassword = CryptoJS.AES.decrypt(user.password, secretKey).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
        return next(new Error("In-valid email or password", { cause: 401 }))
    }
    const token = jwt.sign({ name: user.userName, id: user._id, isOnline: true }, process.env.TOKEN_SIGNATURE)
    const userlogIn = await userModel.findOneAndUpdate({ email: email }, { isOnline: true, isDeleted: false })
    console.log(userlogIn);
    return res.status(200).json({ message: "Done", token })
})
export const profileImage = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `trello` })
        const userupdate = await userModel.findOneAndUpdate({ _id: user.id }, { profilePicture: { secure_url, public_id } }, { new: true })
        return res.status(200).json({ message: "Done", userupdate })
    }
    if (user.isDeleted == true) {
        return next(new Error("this email is deleted please login again", { cause: 401 }))
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword, cPassword } = req.body
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRETKEY).toString(CryptoJS.enc.Utf8);
        if (oldPassword !== decryptedPassword) {
            return next(new Error("old password not match your password", { cause: 400 }))
        }
        const encryptedPassword = CryptoJS.AES.encrypt(newPassword, process.env.SECRETKEY).toString();
        const userupdate = await userModel.findByIdAndUpdate({ _id: user.id }, { password: encryptedPassword })
        console.log(userupdate);
        return res.status(200).json({ message: "Done" })
    }
    else if (user.isDeleted == true) {
        return next(new Error("this email is deleted please login again", { cause: 401 }))
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const updateUser = asyncHandler(async (req, res, next) => {
    const { age, userName, phone } = req.body
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const userupdate = await userModel.findOneAndUpdate({ _id: user.id }, { age, userName, phone }, { new: true })
        console.log(userupdate);
        return res.status(200).json({ message: "Done" })
    }
    else if (user.isDeleted == true) {
        return next(new Error("this email is deleted please login again", { cause: 401 }))
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const userdelete = await userModel.findByIdAndDelete({ _id: user.id })
        console.log(userdelete);
        return res.status(200).json({ message: "Done" })
    }
    else if (user.isDeleted == true) {
        return next(new Error("this email is deleted please login again", { cause: 401 }))
    }
    else {
        return next(new Error("please login first", { cause: 401 }))
    }
})
export const logOut = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const userlogOut = await userModel.findByIdAndUpdate({ _id: user.id }, { isOnline: false })
        console.log(userlogOut);
        return res.status(200).json({ message: "Done" })
    }
    if (user.isDeleted == true) {
        return next(new Error("this email is deleted please login again", { cause: 401 }))
    }
})
export const softDelete = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (user.isOnline == true && user.isDeleted == false && user.confirmEmail == true) {
        const usersoftDelete = await userModel.findByIdAndUpdate({ _id: user.id }, { isDeleted: true })
        console.log(usersoftDelete);
        return res.status(200).json({ message: "Done" })
    }
    else {
        return next(new Error("please login first", { cause: 401 }))

    }
})
