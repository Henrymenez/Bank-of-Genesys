const User = require("../models/user")


module.exports = () => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.USER_ID)
            if (!user.status) res.status(400).send({ error: "Your account have been disabled, Contact admin" })
            next()
        } catch (error) {
            next(error)
        }
    }
}