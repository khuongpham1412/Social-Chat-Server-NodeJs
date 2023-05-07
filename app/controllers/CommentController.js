const Status = require('../models/Status')
const Comment = require('../models/Comment')

class CommentController {

    async show(req, res) {
        const comments = await Comment.find({ "statusId": req.body.statusId })
        if (comments.length == 0) {
            return res.send({ data: null, error: "No Comment!!!" })
        }
        res.send({ data: { comments }, error: null })
    }
    async post(req, res) {
        const status = await Status.findOne({ '_id': req.body.statusId })
        if (!status) {
            return res.send({ data: null, error: "Can not find the status" })
        } else {
            const userId = req.user._id
            const name = req.user.name
            const comment = new Comment({ 'statusId': req.body.statusId, userId, name, 'dateTime': req.body.dateTime, 'content': req.body.content })
            await comment.save()
            status.commentCount = status.commentCount + 1
            await status.save()

            res.send({ data: { message: 'Posted' }, error: null })
        }
    }
    async update(req, res) {
        const filter = { _id: req.body.commentId }
        const update = { content: req.body.commentEdit }

        const updateComment = await Comment.findOneAndUpdate(filter, update, {
            new: true
        })
        if (!updateComment) {
            return res.send({ data: null, error: "Update Fail!!!" })
        }
        res.send({ data: { message: "Update Success!" }, error: null })
    }

    async delete(req, res) {
        const filter = { _id: req.body.commentId }
        const deteteComment = await Comment.findOneAndDelete(filter, function (err, data) {
            if (err) {
                return res.send({ data: null, error: "Delete Fail!!!" })
            }
            res.send({ data: { message: "Delete Success!" }, error: null })
        })
    }

}
module.exports = new CommentController