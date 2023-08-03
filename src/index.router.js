import connectDB from '../DB/connection.js'
import userRouter from './module/user/user.router.js'
import taskRouter from './module/task/task.router.js'
import { globalErrorHandling } from './utils/errorHandling.js'
const bootstrap = (app, express) => {
    app.use(express.json())
    app.use("/user", userRouter)
    app.use("/task", taskRouter)

    app.use("*", (req, res, next) => {
        return res.json({ message: "In-valid Routing" })
    })
    app.use(globalErrorHandling)
    connectDB()
}
export default bootstrap