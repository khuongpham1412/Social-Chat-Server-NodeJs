
const UserInteractions = require('../models/UserInteractions')

class StatusController {

    async getPublic(req, res) {
        const size = parseInt(req.body.size)
        const start = size * (-2)
        const limit = 2
        const posts = await UserInteractions.aggregate([
            // { 
            //     $unwind : "$userinteractions" 
            // }
            // {
            //     $match:{
            //         "status.mode": "Public"
            //     }
            // }
            // {   
            //     $addFields: {
            //         convertedDate: { $toDate: "$status.dateTime" }
            //     }
            // },
            // {
            //     $sort: { //stage 2: sort the remainder last-first
            //         "convertedDate": -1
            //     }
            // },
            // {
            //     $skip: size
            // },
            // {
            //     $limit: 4
            // }

            {
                $project: {
                    // __v: 0, __id: 0, convertedDate: 0
                    test: {
                        $slice: ["$userinteractions", start, limit]
                    }
                }
            }
        ])
        if (posts == null) {
            res.send({ data: null, error: 'Không tìm thấy bất kì bài viết nào' })
        } else {
            // posts.forEach(value => 
            //     console.log(value._id)
            // )
            // console.log(s);
            res.send({ data: { posts }, error: null })
        }
    }

    async post(req, res) {
        var userId = req.user._id;
        var dateTime = req.body.dateTime;
        var mode = req.body.mode;
        var content = req.body.content;
        var user = await UserInteractions.find({});
        if (JSON.stringify(user) == "[]") {
            var status = new UserInteractions();
            await status.save()
            await status.postStatus(userId, dateTime, mode, content)
        }
        else {
            user[0].userinteractions = user[0].userinteractions.concat({ userId, dateTime, mode, content })
            await user[0].save()
        }
        res.send({ data: { message: 'Posted' }, error: null })
    }

}

module.exports = new StatusController