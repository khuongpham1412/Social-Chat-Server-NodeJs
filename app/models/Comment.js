const mongoose = require('mongoose')

const Comment = mongoose.Schema({//một bài đăng
    statusId: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    name:{
        type: String,
        require:true
    },
    dateTime:{
        type: String,
        require: true
    },
    content:{
        
            type: String,
            require:true
        
    }
})

// Comment.pre('save', async function(next){
//     const user = this
//     const date = new Date(parseInt(user.timestamp))

//     this.dateTime = date.getDate()+"/"+date.getMonth()+1 + "/" + date.getFullYear() +" "+ date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    
//     next()
// })

module.exports = mongoose.model('comment',Comment)