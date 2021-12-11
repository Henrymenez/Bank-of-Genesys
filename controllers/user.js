const User = require("../models/user")

const user = {}

//get single transaction by id
user.getOne = async (req, res) => {

  try {
    const user = await User.findById(req.USER_ID)
    res.status(200).send({ message: "Transaction", data: user })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get Transaction", error })
  }
}

module.exports = user