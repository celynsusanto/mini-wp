const mongoose = require('mongoose')
const Password = require('../helpers/password-decrypr-encrypt')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: [true, "Please fill up your Fullname"]
    },
    email: {
        type: String,
        required: [true, "Please fill up your Email address"],
        unique: [true, "Sorry, Email has been used"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid Email address']
    },
    password: {
        type: String,
        required: [true, "Please fill up your Password"],
        minlength: [6, "Password should be at least 6 characters"],
    },
    source: String
})

UserSchema.pre("save", function() {
    this.password = Password.hashPassword(this.password)
})

const User = mongoose.model("User", UserSchema)

module.exports = User