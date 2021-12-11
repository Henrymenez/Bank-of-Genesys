const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const Transaction = require("../models/transactions")
 const JWT_SECRET_KEY = 'thisismytokencode'

const admin = {}

admin.signup = async (req, res) => {
  const data = req.body

  try {
    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await new User({
      email: data.email,
      password: passwordHash,
      full_name: data.full_name,
      age: data.age,
      transaction_pin: data.transaction_pin,
      account_number: data.account_number
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

admin.updateTransaction = async (req, res) => {
  try {
    const status = {};

    if(req.query.status === 'approve'){
      status.status = 'Approve'
    }else if(req.query.status === 'decline'){
       status.status = 'Declined'
    }else if(!req.query.status){
      status.status = 'Approve'
    }
  
    const trans = await Transaction.findByIdAndUpdate(req.params.transaction_id,{ $set: status  }, 
      { new: true })
 if (!trans) return res.status(403).send({ message: "Transfer Not Found" })
   if(trans.status === 'Declined') return res.status(200).send({message: 'Transfer Declined',data: trans})
    await User.findOneAndUpdate({account_number: trans.receiver}, {
      $inc: {
        balance: trans.amount
      }
    });
    const upOwner = await User.findById(trans.owner);
    newBalance =  upOwner.balance - trans.amount
    await User.findByIdAndUpdate(trans.owner,{
      $set: {
        balance: newBalance
      }
    })
    res.status(200).send({ message: "Transfer Approved", data: trans })
  } catch (error) {
    res.status(400).send({ message: "Couldn't Approve Transfer", error })
  }
}


module.exports = admin