const router = require("express").Router()
const auth = require("./../middlewares/auth")
const status = require("../middlewares/status")
const userController = require("./../controllers/user")


router.get("/", auth(), status(), userController.getOne)
router.get("/:user_id/avatar", userController.getImage)


module.exports = router