const express = require('express')
const router = express.Router()
const path = require('path')
const StatusController = require('../app/controllers/StatusController')
const ConversationController = require('../app/controllers/ConversationController')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const auth = require('../middleware/auth')

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./images')
    },
    filename: function(req,file,cb) {
        let date = new Date();
        cb(null,date.getTime()+file.originalname)
                localStorage.removeItem('imageLocal')
                localStorage.setItem('imageLocal', date.getTime()+file.originalname);
        console.log(date.getTime()+file.originalname)
    }
})
var upload = multer({storage:storage})

var videoStorage = multer.diskStorage({
    destination: './image_mess', // Destination to store video 
    filename: (req, file, cb) => {
        let date = new Date();
        cb(null,date.getTime()+file.originalname)
        console.log(date.getTime()+file.originalname)
    }
});

var videoUpload = multer({
    storage: videoStorage,
    // limits: {
    // fileSize: 10000000 // 10000000 Bytes = 10 MB
    // },
    fileFilter(req, file, cb) {
      // upload only mp4 and mkv format
      if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
         return cb(new Error('Please upload a video'))
      }
      cb(undefined, true)
   }
})

router.post('/SendVideo',videoUpload.single('video'), (req, res) => {
    res.send(req.file)
    console.log("success");
 })


router.post('/GetMessage', ConversationController.getMessage )
router.post('/GetListMessage', ConversationController.getListMessage )
router.post('/SendMessage',ConversationController.sendMessage)
//router.post('/SendImage',auth, ConversationController.sendImage)
router.post('/SendImage',upload.single('image'),(req,res,next) =>{
    req.idphong = req.body.idphong
    req.image = req.file
    next()
},auth,ConversationController.sendImage)

router.post('/PostStatus', auth, StatusController.post)
router.post('/GetPublicStatus', StatusController.getPublic)


module.exports = router