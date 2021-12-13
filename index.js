const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const morgan = require('morgan')
const app = express()
const port = process.env.PORT
console.log(port)
const MONGODB_URI = process.env.MONGODB_URI

//middlewares
app.use(morgan('dev'));
app.use(express.json())  
app.use(express.urlencoded({ extended: false }));


app.get('/ping', (req, res) => {
  res.status(200).send("Welcome to the Genesys Bank!")
});

app.use("/auth", require("./routes/auth"))
app.use("/user", require("./routes/user"))
app.use("/transactions", require("./routes/transactions"))
app.use("/admin", require("./routes/admin"))

// Not found route - 404
app.use("**", (req, res) => {
  res.status(404).send({ message: "Route not found" })
})


app.listen(port, async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to database')
  } catch (error) {
    console.log(" Couldn't connect to database ", error)
  }

  console.log(`App is runing on http://localhost:${port}`)
});