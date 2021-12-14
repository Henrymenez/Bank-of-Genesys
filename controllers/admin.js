const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/user")
const Transaction = require("../models/transactions")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const admin = {}

admin.signup = async (req, res) => {
  const data = req.body

  try {
    if (data.password.length < 7) return res.status(400).send({ error: 'Password should be at least 7 characters' })
    if (data.age < 18) return res.status(400).send({ error: 'should be at least 18 years' })
    if (data.transaction_pin.length != 4) return res.status(400).send({ error: 'Pin should be only 4 characters' })
    const passwordHash = await bcrypt.hash(data.password, 10)
    const accountNumber = Math.floor(Math.random() * 10000000000)
    const user = await new User({
      email: data.email,
      password: passwordHash,
      full_name: data.full_name,
      age: data.age,
      transaction_pin: data.transaction_pin,
      account_number: accountNumber
    }).save()

    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: 50 * 10 })

    res.status(201).send({
      message: "User created",
      data: {
        token,
        userId: user._id,
        email: user.email,
        full_name: user.full_name,
        age: user.age,
        transaction_pin: user.transaction_pin,
        account_number: user.account_number

      }
    })
  } catch (error) {
    res.status(400).send({ message: "User couldn't be created", error })
  }

}

admin.delete = async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(req.params.user_id)
    if (!user) return res.status(403).send({ message: "User Not Found" })
    res.status(200).send({ message: "User deleted", data: user })
  } catch (error) {
    res.status(400).send({ message: "Couldn't delete user", error })
  }
}

admin.disable = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.user_id, {
      $set: {
        status: false
      }
    }, { new: true })
    if (!user) return res.status(403).send({ message: "User Not Found" })
    res.status(200).send({ message: "User Disabled", data: user })
  } catch (error) {
    res.status(400).send({ message: "Couldn't Disable user", error })
  }
}
//Post url/transaction_id?query "approve, to Approve. decline, to Decline"
//if you add no query parameter it will be approved by default
admin.updateTransaction = async (req, res) => {
  try {
    const status = {};

    if (req.query.status === 'approve') {
      status.status = 'Approve'
    } else if (req.query.status === 'decline') {
      status.status = 'Declined'
    } else if (!req.query.status) {
      status.status = 'Approve'
    }

    const trans = await Transaction.findByIdAndUpdate(req.params.transaction_id, { $set: status },
      { new: true })
    if (!trans) return res.status(403).send({ message: "Transfer Not Found" })
    if (trans.status === 'Declined') return res.status(200).send({ message: 'Transfer Declined', data: trans })
    await User.findOneAndUpdate({ account_number: trans.receiver }, {
      $inc: {
        balance: trans.amount
      }
    });
    const upOwner = await User.findById(trans.owner);
    newBalance = upOwner.balance - trans.amount
    await User.findByIdAndUpdate(trans.owner, {
      $set: {
        balance: newBalance
      }
    })
    res.status(200).send({ message: "Transfer Approved", data: trans })
  } catch (error) {
    res.status(400).send({ message: "Couldn't Approve Transfer", error })
  }
}

//User Profile Image


admin.uploadImage = async (req, res) => {

  const user = await User.findById(req.params.user_id);
  if (!user) return res.status(403).send('User not found')
  if (!req.file) return res.status(400).send({ error: "Please Upload an image" })
  const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()
  user.avatar = buffer
  await user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
}




module.exports = admin
