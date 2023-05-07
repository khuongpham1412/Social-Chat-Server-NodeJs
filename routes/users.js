const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/UserController')
const auth = require('../middleware/auth')

router.post('/Register', userController.register)

router.post('/getUser', userController.getUserFromId)

router.post('/SetAvatar',auth, userController.setAvatar)

router.get('/GetAvatar/:image', userController.getAvatar)

router.post('/Login', userController.login)

router.post('/GetListUser', userController.getListUser)

router.post('/AutoLogin', auth, userController.autoLogin)

router.post('/Logout', auth, userController.logout)

module.exports=router