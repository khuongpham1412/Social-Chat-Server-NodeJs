const express = require('express')
const app = express()
const fs1 = require('fs')
const http = require('http')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const db = require('./config/configDb')
require('dotenv/config')
const route = require('./routes/app')
const path = require('path')
var multer = require('multer');
var upload = multer();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

db.connect()

//app.use(upload.any());

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

route(app)
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/video", function (req, res) {
  // Ensure there is a range given for the video

  const range = req.headers.range
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  // get video stats (about 61MB)
  const videoPath = "./image_mess/test.mp4";
  const videoSize = fs1.statSync("./image_mess/test.mp4").size;
  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs1.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});








//app.listen(process.env.PORT)
server.listen(process.env.PORT)
var real_path;
const user = []


io.sockets.on('connection', (socket) => {

  console.log("co nguoi connection ne")

  socket.on('JOIN', (idphong) => {
    let length = idphong.length / 2;
    let idphong1 = idphong.substring(0, length)
    let idphong2 = idphong.substring(length)
    let idphong3 = idphong2 + idphong1
    socket.join(idphong)
    socket.join(idphong3)
    user.push(idphong)
    user.push(idphong3)

    socket.on('USER_SEND_IMAGE', (data) => {
      // var image = localStorage.getItem('image');

      // var mess = data + image
      //console.log(constants.get())
      console.log("fake 2" + localStorage.getItem('imageLocal'))
      var mess = data + "Users/GetAvatar/" + localStorage.getItem('imageLocal')
      io.to(idphong).emit('SERVER_SEND_IMAGE', mess)
    })
  })

  // socket.on('test', (data)=>{
  //     console.log(data)
  // })


  socket.on('USER_SEND_MESSAGE', (data) => {
    let id_user = data.substring(0, 24)
    let idphong = data.substring(24, 72)
    let mess = data.substring(72)
    let messs = id_user + mess
    io.to(idphong).emit('SERVER_SEND_MESS', messs);
  })





})

function getFileNameImage(id) {
  real_path = "images/" + id.substring * (2) + getMilis() + ".png";
  return "images/" + id.substring * (2) + getMilis() + ".png";
}

function getMilis() {
  var date = new Date()
  return date.getTime()
}
