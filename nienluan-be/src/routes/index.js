const userRouter = require('./UserRouter')
const productRouter = require('./ProductRouter')

const routes = (app) => {
    app.use('/api/user/', userRouter)
    app.use('/api/product/', productRouter)
}

module.exports = routes