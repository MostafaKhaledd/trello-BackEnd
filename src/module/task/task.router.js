import { Router } from "express"
import * as taskController from "./controller/task.js";
import * as validators from './validation.js'
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
const router = Router();
router.post('/addTask', validation(validators.addTask), auth, taskController.addTask)
router.get('/getAllTasks', taskController.getAllTasks)
router.get('/getAllCreatedTasks', validation(validators.authorizationCheck), auth, taskController.getAllCreatedTasks)
router.get('/getAllAssignTasks', validation(validators.authorizationCheck), auth, taskController.getAllAssignTasks)
router.get('/allLateTasks', validation(validators.authorizationCheck), auth, taskController.allLateTasks)
router.get('/getTasksAssignToAnyUser/:id', validation(validators.getTasksAssignToAnyUser), auth, taskController.getTasksAssignToAnyUser)
router.put('/updateTask/:taskId', validation(validators.updateTask), auth, taskController.updateTask)
router.delete('/deleteTask/:taskId', validation(validators.deleteTask), auth, taskController.deleteTask)
export default router