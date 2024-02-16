const express = require('express')
const oderControllor = require('../controllers/OrderController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/create-order', middlewares.userAccuracy, oderControllor.createOrder)
router.put('/cancel-order/:id', middlewares.userAccuracy, oderControllor.cancelOrder)
router.get('/allorder-byuser/:id', middlewares.UserIdAccuracy, oderControllor.allOrderByUser)
router.get('/allorder', middlewares.userAdminAccuracy, oderControllor.allOrder)
router.get('/order-detail/:id', middlewares.userOrAdminAccuracy, oderControllor.orderDetail)
router.put('/update-status-order/:id', middlewares.userAdminAccuracy, oderControllor.updateStatus)

module.exports = router
