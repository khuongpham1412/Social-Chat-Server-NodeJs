//chú ý Conversation phải đặt đúng tên file kể cả chữ in hoa
const Conversation = require('../models/Conversation')
const User = require('../models/User')
const formidable = require('formidable')
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');




class ConversationController {
    async getListMessage(req, res) {
        var userId = req.body.id
        var listMess = await Conversation.aggregate([
            {
                $match: {
                    $or: [
                        { userSend: userId },
                        { userGet: userId }
                    ]
                }
            },
            {
                $addFields: {
                    name: "name",
                    avatar: "avatar",
                }
            },
            {
                $project: {
                    _id: 1, idphong: 1, userGet: 1, userSend: 1, status:1, conversation: {
                        $slice: ["$conversation", -1]
                    }, name: 1, avatar: 1
                }
            }
        ])
        if (JSON.stringify(listMess) == "[]") {
            return res.send({ data: null, error: "Khong co du lieu" })
        }
        for (var i = 0; i < listMess.length; i++) {
            if (userId == listMess[i].userSend) {
                var user = await User.findOne({ _id: listMess[i].userGet }, { name: 1, avatar: 1 })
            }
            else {
                var user = await User.findOne({ _id: listMess[i].userSend }, { name: 1, avatar: 1 })
            }
            listMess[i].name = user.name
            listMess[i].avatar = "Users/GetAvatar/" + user.avatar
        }
        res.send({ data: { listMess }, error: null })
    }

    async getMessage(req, res) {
        var idphong = req.body.id;
        var length = idphong.length / 2;
        var idphong1 = idphong.substring(0, length)
        var idphong2 = idphong.substring(length)
        var idphong3 = idphong2 + idphong1
        var room = await Conversation.findOne({
            $or: [
                { idphong: idphong },
                { idphong: idphong3 }
            ]
        })

        if (room == null) {
            res.send({ data: null, error: "Khong co du liẹu" })
        }
        else {
            for (var i = 0; i < room.conversation.length; i++) {
                if (room.conversation[i].type == "image") {
                    room.conversation[i].message = "Users/GetAvatar/" + room.conversation[i].message
                }
            }

            res.send({ data: room, error: null })
        }
    }

    async sendImage(req, res) {
        var id_user = req.user._id
        var image = localStorage.getItem('imageLocal')
        var idphong = req.idphong
        var length = idphong.length / 2;
        var idphong1 = idphong.substring(0, length)
        var idphong2 = idphong.substring(length)
        var idphong3 = idphong2 + idphong1
        var room = await Conversation.findOne({
            $or: [
                { idphong: idphong },
                { idphong: idphong3 }
            ]
        })
        if (!room) {
            room = new Conversation({ idphong: idphong, userSend: idphong1, userGet: idphong2 ,status:"false"})
            await room.save()
        }
        // var form = new formidable.IncomingForm();
        // form.uploadDir = './images'
        // form.keepExtensions = true
        // form.maxFieldSize = 10 * 1024 * 1024
        // form.multiples = true
        // console.log("hello1");
        // form.parse(req, (err, fields, files) => {
        //     if (err) {
        //         return res.send({ data: null, error: err })
        //     }
        //     console.log("hello2");
        //     var arrayOfFiles = files[""]
        //     if (arrayOfFiles.length > 0) {
        //         console.log("hello3");
        //         var fileNames = []
        //         arrayOfFiles.forEach((eachFiles) => {

        //             fileNames.push(eachFiles.path.split('\\')[1])
        //         })

        //         res.send({ data: fileNames, error: null })
        //     } else {
        // console.log("hello4");
        //         var index = files[''].path.indexOf('\\')
        //         var image = files[''].path.substring(index + 1)
                 var type = "image"
                 console.log("path real: "+image)
        //         localStorage.removeItem('imageLocal')
        //         localStorage.setItem('imageLocal', image);
                 console.log("fake 1: "+localStorage.getItem('imageLocal'))
                 room.getMessage(id_user, image, type)
                 res.send({ data: { message: "success" }, error: null })
        //     }
        //  })

        // upload.single('image'),function(req,res){
        //     console.log(req.file)
        // }
        // console.log("hi");
    }

    async sendMessage(req, res) {
        var idphong = req.body.id;
        var message = req.body.message;
        var length = idphong.length / 2;
        var idphong1 = idphong.substring(0, length)
        var idphong2 = idphong.substring(length)
        var idphong3 = idphong2 + idphong1
        var room = await Conversation.findOne({
            $or: [
                { idphong: idphong },
                { idphong: idphong3 }
            ]
        })
        if (room == null) {
            room = new Conversation({ idphong: req.body.id, userSend: idphong1, userGet: idphong2 , status:"false"})
            await room.save()
        }
        var type = "message"
        await room.getMessage(idphong1, message, type)
        res.send({ data: { message: "success" }, error: null })
    }

}
module.exports = new ConversationController