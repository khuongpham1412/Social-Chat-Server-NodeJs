const express = require("express")
const router = express.Router()
const CommentController = require('../app/controllers/CommentController')
const auth = require('../middleware/auth')

router.post('/show', auth, CommentController.show)

router.post('/post', auth, CommentController.post)

router.post('/update', auth, CommentController.update)

router.post('/delete', auth, CommentController.delete)

module.exports = router