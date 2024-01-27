const express = require('express')
const oderControllor = require('../controllers/OrderController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/create-order', middlewares.userAccuracy, oderControllor.createOrder)
router.delete('/cancel-order', middlewares.userAccuracy, oderControllor.cancelOrder)


module.exports = router
