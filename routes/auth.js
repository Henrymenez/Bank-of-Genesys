const router = require("express").Router()
const auth = require("./../middlewares/auth")
const status = require("../middlewares/status")
const AuthController = require("./../controllers/auth")


router.post("/signin", AuthController.signin)


module.exports = router