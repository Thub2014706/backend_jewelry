const userRouter = require('./UserRouter')
const productRouter = require('./ProductRouter')
const addressRouter = require('./AddressRouter')

const routes = (app) => {
    app.use('/api/user/', userRouter)
    app.use('/api/product/', productRouter)
    app.use('/api/address/', addressRouter)
}

module.exports = routes