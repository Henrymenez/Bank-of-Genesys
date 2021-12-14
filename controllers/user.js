const User = require("../models/user")

const user = {}

//get single transaction by id
user.getOne = async (req, res) => {

  try {
    const user = await User.findById(req.USER_ID)
    res.status(200).send({ message: "User Profile", data: user })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get Transaction", error })
  }
}
//get image
user.getImage = async (req, res) => {
  try {

    const user = await User.findById(req.params.user_id)
    if (!user || !user.avatar) {
      throw new Error('No user or user image found')
    }
    res.set('content-type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send(error)
  }
}

module.exports = user