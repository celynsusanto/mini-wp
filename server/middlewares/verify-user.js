const User = require('../models/user')
const app = require('express')()
const jwt = require('jsonwebtoken')

function verifyUser(req, res, next) {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    User
        .findOne({email: decoded.email})
        .then((user) => {
            if (!user) {
                res.status(401).json({status: "Please sign in with a valid account"})
            } else {
                req.app.locals.source = user.source
                req.app.locals.userId = user._id
                req.app.locals.email = user.email
                next()
            }
        })
        .catch((err) => {
            res.status(401).json({status: "Please sign in with a valid account"})
        })

}

module.exports = verifyUser