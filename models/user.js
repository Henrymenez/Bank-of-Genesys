const mongoose = require("mongoose")
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    status: {
        required: true,
        type: Boolean,
        default: true
    },
    avatar: {
        type: Buffer
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not include "password"')
            }
        }
    },
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 17) {
                throw new Error('You must be a at least 18')
            }
        }
    },
    transaction_pin: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!(value.toString().length == 4)) {
                throw new Error('Transaction Pin must be 4 digits')
            }
        }
    },
    account_number: {
        type: Number,
        required: true,
        unique: true,
        maxlength: 10,
        validate(value) {
            if (!(value.toString().length == 10)) {
                throw new Error('Account number must be 10 digits')
            }
        }
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("user", userSchema)