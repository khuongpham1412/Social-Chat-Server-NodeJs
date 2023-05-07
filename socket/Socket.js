async function socketIo() {
    var real_path;
    const user = []


    io.sockets.on('connection', (socket) => {

        console.log("co nguoi connection ne")

        socket.on('tham-gia', (idphong) => {
            let length = idphong.length / 2;
            let idphong1 = idphong.substring(0, length)
            let idphong2 = idphong.substring(length)
            let idphong3 = idphong2 + idphong1
            socket.join(idphong)
            socket.join(idphong3)
            user.push(idphong)
            user.push(idphong3)

            socket.on('sendImage', (data) => {
                fs1.writeFile(getFileNameImage(socket.id), data, function (err) {
                    console.log("Đã viết file")
                    console.log(real_path)
                })

                var check = false
                var dem = 1;
                fs1.readFile(real_path, (err, data) => {
                    if (!err) {
                        console.log(real_path)
                        console.log("Đã gửi file")
                        io.to(idphong).emit('server_send_image', data)
                        check = true
                    } else {
                        io.to(idphong).emit('server_send_image', "null")
                    }
                })
            })
        })


        socket.on('client-gui-mess', (data) => {
            let id_user = data.substring(0, 24)
            let idphong = data.substring(24, 72)
            let mess = data.substring(72)
            let messs = id_user + mess
            io.to(idphong).emit('message', messs);
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

}
module.exports = {socketIo}