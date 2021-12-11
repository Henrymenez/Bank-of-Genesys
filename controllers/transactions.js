const Transactions = require("./../models/transactions")
const User = require("./../models/user");

const transactions = {}

transactions.deposite = async (req, res) => {
  
  const data = req.body
  const amount = parseInt(data.amount) 

  try {
    if(!(data.type == 'Deposite')){
     return res.status(400).send({error: 'Wrong route'})
    }
    
    if(parseInt(data.amount) <= 0){
       return  res.status(400).send({error: 'Please add a valuable amount'})
    }
    const transaction = await new Transactions({
      type: data.type, 
      amount: data.amount,
      owner: req.USER_ID
    }).save()
    if(transaction){
      const user =  await User.findById(req.USER_ID)
        const balance = user.balance
        const newBalance = balance + amount
        await User.updateOne({_id: user._id},{
            balance: newBalance
        })
    }
    res.status(200).send({ message: "Deposited Successfully", data: transaction })
  } catch (error) {
    res.status(400).send({ message: "Couldn't Deposite", error })
  }

}
//withdrawal route
transactions.withdraw = async (req, res) => {
  const data = req.body
     const pin = parseInt(data.pin) 
 const amount = parseInt(data.amount) 
  try {
    if(!(data.type == 'Withdraw')){
       return  res.status(400).send({error: 'Wrong route'})
    }
    
    if(parseInt(data.amount) <= 0){
       return  res.status(400).send({error: 'Please add a valuable amount'})   
    }
    const user =  await User.findById(req.USER_ID)
    const dbPin = parseInt(user.transaction_pin) 
    if(pin !== dbPin){
     return   res.status(400).send({error: 'Incorrect Withdrawal pin'})
    }
    if(data.amount > user.balance){
          amount = undefined
        return   res.status(403).send({error: 'Please Withdraw available amount'})
    }
   
    const transaction = await new Transactions({
      type: data.type, 
      amount: data.amount,
      owner: req.USER_ID
    }).save()
    if(transaction && amount !== undefined){
      const user =  await User.findById(req.USER_ID)
        const balance = user.balance
        const newBalance =  balance - amount  
        await User.updateOne({_id: user._id},{
            balance: newBalance
        })
    }
    res.status(200).send({ message: "Withdrawal Successful", data:  transaction })
  } catch (error) {
    res.status(400).send({ message: "Couldn't Withdraw", error })
  }

}
//Transfer route
transactions.transfer = async (req, res) => {
  const data = req.body
     const pin = parseInt(data.pin) 
    const amount = parseInt(data.amount) 
   
  try {
    if(!(data.type == 'Transfer'))return res.status(400).send({error: 'Wrong route'})
        
    if(amount <= 0)return res.status(400).send({error: 'Please add a valuable amount'}) 
          
    const user =  await User.findById(req.USER_ID)  
    const dbPin = user.transaction_pin
    const userAccount = user.account_number
  
    if(userAccount == data.receiver)return res.status(400).send({error: 'You can\'t send money to Yourself'}) 
    if(pin.toString() !== dbPin) return res.status(400).send({error: 'Incorrect pin number'}) 
          
    if(amount > user.balance){
         amount = undefined
      return  res.status(403).send({error: 'Please transfer available amount'})
    }
           
    const sendTo = await User.findOne({account_number: parseInt(data.receiver)})
    if(!sendTo) return res.status(404).send({error: 'The Account Number is not Registered to a user'})

  const transaction = await new Transactions({
      status: 'Pending',
      type: data.type, 
      receiver: parseInt(data.receiver),
      amount: data.amount,
      owner: req.USER_ID
    }).save() 
    res.status(200).send({ message: "Transfer Successful", data:  transaction })
  } catch (error) {
    res.status(400).send({ message: "Couldn't transfer", error })
  }

}

//get single transaction by id
transactions.getOne = async (req, res) => {

  try {
    const user = await User.findById(req.USER_ID)
 const transaction = await Transactions.findOne({ _id: req.params.transaction_id}).populate("owner", "email full_name account_number")
 if(transaction.owner._id.toString() != req.USER_ID.toString()) return res.status(400).send({error: 'Unauthorized Person'})
    res.status(200).send({ message: "Transaction", data: transaction })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get Transaction", error })
  }
}

// get /transactions/me?type=dep/wit/trn  mayching by type
//get /transaction/me?sortBy=created_at:asc
//get all transaction
transactions.getAll = async (req, res) => {
  try {
    const match = {}
    const sort = {}

    if(req.query.type === 'dep'){
      match.type = 'Deposite'
    }else if(req.query.type === 'wit'){
       match.type = 'Withdraw'
    }else if(req.query.type === 'trn'){
      match.type = 'Transfer'
    }
     if(req.query.sortBy){
       const parts = req.query.sortBy.split(':')
       sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
   }
   console.log(sort)
    const user = await User.findById(req.USER_ID)
    const transaction = await Transactions.find({ owner: req.USER_ID }).populate({
      path: "owner",
      select: "full_name email account_number",
      match,
      options: {
        sort
      }
    })
    res.status(200).send({ message: "All Transaction", data: transaction })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get Transactions", error })
  }
}




module.exports = transactions