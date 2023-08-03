import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as userController from "./controller/user.js";
import * as validators from './validation.js'
import { Router } from "express";
const router = Router()
router.post('/signup', validation(validators.signup), userController.signup)
router.get('/confirmEmail/:token', validation(validators.confirmEmail), userController.confirmEmail)
router.get('/requestNewConfirmEmail/:token', validation(validators.confirmEmail), userController.newConfirmEmail)
router.post('/logIn', validation(validators.login), userController.logIn)
router.patch('/changePassword', validation(validators.changePassword), auth, userController.changePassword)
router.put('/update', validation(validators.updateUser), auth, userController.updateUser)
router.delete('/delete', validation(validators.authorizationCheck), auth, userController.deleteUser)
router.patch('/logout', validation(validators.authorizationCheck), auth, userController.logOut)
router.patch('/softDelete', validation(validators.authorizationCheck), auth, userController.softDelete)
export default router