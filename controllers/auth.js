const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")
 const JWT_SECRET_KEY = 'thisismytokencode'

const auth = {}

auth.signin = async (req, res) => {
  const data = req.body

  try {
    const user = await User.findOne({ email: data.email })
    if (!user) return res.status(400).send({ message: "Invalid email or password" })
    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) return res.status(400).send({ message: "Invalid email or password" })
    if(!user.status)return res.status(403).send({ message: "You have been disabled" })

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET_KEY)

    res.status(200).send({
      message: "User LoggedIn",
      data: {
        token,
        user_id: user._id,
        email: user.email,
        full_name: user.full_name,
        age: user.age,
      account_number: user.account_number
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: "Unable to signin", error })
  }

}


module.exports = auth