const express = require("express")
const path  = require("path")
const dotenv = require('dotenv')
const cors = require("cors")
const connectDB = require('./config/db')
const employeeRouter = require("./router/employeeRouter")
const app = express()
// dot inv configaration
dotenv.config()
// connect mongoose
connectDB()
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: false }));
app.use(cors())
app.use("/", employeeRouter)

// const __dirname = path.resolve()

app.use(express.static(path.join(__dirname,'../frontend/build')))
const pather = (__dirname, '../frontend/build')
console.log(pather)

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )




const PORT = process.env.PORT || 8000
app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))

