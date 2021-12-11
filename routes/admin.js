const router = require("express").Router()
const adminController = require("../controllers/admin")

router.post("/user/signup", adminController.signup)
router.delete("/user/delete/:user_id", adminController.delete)
router.post("/user/disable/:user_id", adminController.disable)
router.post("/transaction/:transaction_id", adminController.updateTransaction)


module.exports = router