const usersRoutes = require('./users')
const userInteractionsRoutes = require('./userInteractions')

function route(app){

    app.use('/Users', usersRoutes)

    app.use('/UserInteractions', userInteractionsRoutes)
    
}

module.exports = route
