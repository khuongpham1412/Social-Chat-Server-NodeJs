const jwt = require('jsonwebtoken')
const User = require('../app/models/User')

async function auth(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '')
    try {
        const data = await jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (user == null) {
            return res.send({ data:null, error:"Không tìm thấy thông tin tài khoản" })
        }else{
            req.user = user
            req.token = token
            next()
        }
    } catch (error) {
        res.status(500).send({data:null,error:"Token không hợp lệ"})
    }
    
    
}
module.exports = auth