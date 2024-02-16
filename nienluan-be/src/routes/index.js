const userRouter = require('./UserRouter')
const productRouter = require('./ProductRouter')
const addressRouter = require('./AddressRouter')
const orderRouter = require('./OrderRouter')
const commentRouter = require('./CommentRouter')

const routes = (app) => {
    app.use('/api/user/', userRouter)
    app.use('/api/product/', productRouter)
    app.use('/api/address/', addressRouter)
    app.use('/api/order/', orderRouter)
    app.use('/api/comment/', commentRouter)
}

module.exports = routes