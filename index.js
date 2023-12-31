import dotenv from 'dotenv'
dotenv.config()
import bootstrap from './src/index.router.js'
import express from 'express'
const app = express()
const port = process.env.PORT || 5000
app.use("/uploads",express.static("./uploads"))
bootstrap(app, express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))