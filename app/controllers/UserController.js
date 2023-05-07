const User = require('../models/User')
const fs = require('fs')
const formidable = require('formidable')


class UserController {

    async setAvatar(req, res) {
        var form = new formidable.IncomingForm();
        form.uploadDir = './images'
        form.keepExtensions = true
        form.maxFieldSize = 10 * 1024 * 1024
        form.multiples = true

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.send({ data: null, error: err })
            }
            var arrayOfFiles = files[""]
            if (arrayOfFiles.length > 0) {

                var fileNames = []
                arrayOfFiles.forEach((eachFiles) => {

                    fileNames.push(eachFiles.path.split('\\')[1])
                })

                res.send({ data: fileNames, error: null })
            } else {
                var index = files[''].path.indexOf('\\')
                var path = files[''].path.substring(index + 1)
                var filter = { _id: req.user._id }
                var update = { avatar: path }
                const user = User.findOneAndUpdate(filter, update, { useFindAndModify: false }, function (err) {
                    if (err) {
                        return res.send({ data: null, error: err })
                    }
                })
                if (!user) {
                    return res.send({ data: null, error: "Update Fail!!!" })
                }
                res.send({ data: { message: "success" }, error: null })
            }
        })



    }


    async getAvatar(req, res) {
        var imageName = "images/" + req.params.image
        fs.readFile(imageName, (err, imageName) => {
            if (err) {
                return res.send({ data: null, err: err })
            }
            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
            res.end(imageName)
        })
    }


    async register(req, res) {
        var avatar = 'avatar_boy.jpg'

        const user = new User({ username: req.body.username, password: req.body.password, name: req.body.name, address: req.body.address, avatar: avatar })

        const username = user.username
        const name = user.name
        const address = user.address
        await user.save()
        const token = await user.generateAuthToken()
        avatar = "Users/GetAvatar/avatar_boy.jpg"
        res.send({ data: { username, name, address, avatar, token }, error: null })
    }

    async getListUser(req, res) {
        const listUser = await User.find({}, { _id: 1, name: 1, address: 1, avatar: 1 })
        if (listUser == null) {
            return res.send({ data: null, error: "Đã xảy ra lỗi" })
        }
        for (var i = 0; i < listUser.length; i++) {
            listUser[i].avatar = "Users/GetAvatar/" + listUser[i].avatar
        }
        res.send({ data: { listUser }, error: null })
    }

    async getUserFromId(req, res) {
        var id_user = req.body.id
        var user = await User.findOne({ _id: id_user }, function (err) {
            if (err) {
                return res.send({ data: null, error: "Đã xảy ra lỗi" })
            }
        })
        if (user) {
            const token = user.tokens[user.tokens.length - 1].token
            //const _id = "user._id" 
            const _id = user._id //(Cả 2 cách đều ok ^_^)
            const name = user.name
            const address = user.address
            const username = user.username
            const avatar = "Users/GetAvatar/" + user.avatar
            res.send({ data: { _id, username, name, address, avatar, token }, error: null })
        }
    }

    async login(req, res) {
        const { username, password } = req.body
        const user = await User.findByCredentials(username, password)
        if (!user) {
            return res.send({ data: null, error: "Tài khoản hoặc mật khẩu không chính xác" })
        }
        const token = await user.generateAuthToken()
        //const id = "user._id" 
        const _id = user._id //(Cả 2 cách đều ok ^_^)
        const name = user.name
        const address = user.address
        const avatar = "Users/GetAvatar/" + user.avatar
        res.send({ data: { _id, username, name, address, avatar, token }, error: null })
    }
    async autoLogin(req, res) {

        res.status(201).send({ data: { message: 'Login Success' }, error: null })

    }
    async logout(req, res) {
        req.user.tokens = await req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send({ data: { message: 'Logout Success' }, error: null })
    }
}

module.exports = new UserController