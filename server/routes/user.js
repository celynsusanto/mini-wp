const router = require('express').Router()
const UserController = require('../controllers/user')
const verifyUser = require('../middlewares/verify-user')

router.get('/', verifyUser, UserController.checkUser)

router.post('/login', UserController.login)

router.post('/register', UserController.register)

router.post('/authentication/google', UserController.authenticationGoogle)

module.exports = router