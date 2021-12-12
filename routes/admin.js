const router = require("express").Router()
const multer = require("multer")
const adminController = require("../controllers/admin")

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error('Please Upload an image'))
        }
        cb(undefined, true)
    }
})

router.post("/user/signup", adminController.signup)
router.delete("/user/delete/:user_id", adminController.delete)
router.post("/user/disable/:user_id", adminController.disable)
router.post("/transaction/:transaction_id", adminController.updateTransaction)

router.post("/user/avatar/:user_id", upload.single('avatar'),  adminController.uploadImage)


module.exports = router