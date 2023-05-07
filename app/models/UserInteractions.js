const mongoose = require('mongoose')

const UserInteractions = mongoose.Schema({
    userinteractions: [{
        userId: {
            type: String,
            require: true
        },
        dateTime: {
            type: String,
            require: true
        },
        mode: {
            type: String,
            enum: ['Public', 'Friend', 'Private'],
            require: true
        },
        content: {
            type: String,
            require: true
        }

    }]
})


module.exports = mongoose.model('userinteraction', UserInteractions)