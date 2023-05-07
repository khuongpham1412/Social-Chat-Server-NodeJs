const mongoose = require('mongoose')

const Conversation = mongoose.Schema({
    idphong: {
        type: String,
        require: true
    },
    userSend: {
        type: String,
        require: true
    },
    userGet: {
        type: String,
        require: true
    },
    status :{
        type: String,
        require: true
    },
    conversation: [{
        id: {
            type: String,
            require: true
        },
        type: {
            type: String,
            require: true
        },
        message: {
            type: String,
            require: true
        }

    }]
})

Conversation.methods.getMessage = async function (id, message, type) {
    const conversation = this
    conversation.conversation = conversation.conversation.concat({ id, type, message })
    await conversation.save()
}
module.exports = mongoose.model('conversation', Conversation)
