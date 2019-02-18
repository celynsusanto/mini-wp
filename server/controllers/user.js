const User = require('../models/user')
const Password = require('../helpers/password-decrypr-encrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('299733928822-cq5dvg61rfvvn07vj1po12e9ful75hjn.apps.googleusercontent.com');

class UserController {
    static register(req, res) {
        let user = req.body
        user['source'] = "manual"
        User
            .create(user)
            .then((user) => {
                res.status(201).json({status: "You have successfully created an account", user: user})
            })
            .catch((err) => {
                if (err.name === "MongoError") {
                    res.status(400).json({status: "Sorry, Email has been used"})
                } else {
                    res.status(400).json({status: err.errors[Object.keys(err.errors)[0]].message})
                }
            })
    }

    static login(req, res) {
        User
            .findOne({email: req.body.email})
            .then((user) => {
                if (!user) {
                    res.status(400).json({status: "Sorry, Email is not registered"})
                } else {
                    let isPasswordCorrect = Password.comparePassword(req.body.password, user.password)
                    if (isPasswordCorrect) {
                        let token = jwt.sign({email: user.email, fullname: user.fullname}, process.env.JWT_SECRET)
                        res.status(200).json({status: "You have successfully logged in", token, user})
                    } else {
                        res.status(400).json({status: "Sorry, wrong password"})
                    }
                }
            })
            .catch((err) => {
                res.status(500).json({status: "Internal Server Error"})
            })
    }

    static checkUser(req, res) {
        res.status(200).json({source: req.app.locals.source})
    }

    static authenticationGoogle(req, res) {
        let payload = null
        client.verifyIdToken({
            idToken: req.body.token,
            audience: '299733928822-cq5dvg61rfvvn07vj1po12e9ful75hjn.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        })
        .then((ticket) => {
            payload = ticket.getPayload();
            return User.findOne({email: payload.email})
        })
        .then((user) => {
            if (!user) {
                User.create({
                    fullname: payload.name,
                    email: payload.email,
                    password: "anything",
                    source: "google"
                })
                .then((user) => {
                    let token = jwt.sign(({name: payload.name, email: payload.email}), process.env.JWT_SECRET, {expiresIn: 60*60})
                    res.status(201).json({token: token, user:user})
                })
                .catch((err) => {
                    res.status(500).json({err: err})
                })
            } else {
                let token = jwt.sign({name: payload.name, email: payload.email}, process.env.JWT_SECRET, {expiresIn: 60*60})
                res.status(200).json({token: token, user:user})
            }
        })
        .catch((err) => {
            res.status(500).json({err: err})
        })
        
    }
}

module.exports = UserController