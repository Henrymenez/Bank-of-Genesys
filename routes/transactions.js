const router = require("express").Router()
const auth = require("../middlewares/auth")
const status = require("../middlewares/status")
const TransactionController = require("./../controllers/transactions")


 router.post("/deposite", auth(),status(), TransactionController.deposite)
router.post("/withdraw", auth(), status(), TransactionController.withdraw)
router.post("/transfer", auth(), status(), TransactionController.transfer)
router.get("/me",auth(), status(), TransactionController.getAll)
router.get("/me/:transaction_id", auth(), status(), TransactionController.getOne)
// router.delete("/:post_id", auth(), TransactionController.delete)

 

module.exports = router