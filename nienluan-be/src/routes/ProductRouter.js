const express = require('express')
const productController = require('../controllers/ProductController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/add-product', middlewares.userAdminAccuracy, productController.addProduct)
router.put('/update-product/:id', middlewares.userAdminAccuracy, productController.updateProduct)
router.delete('/delete-product/:id', middlewares.userAdminAccuracy, productController.deleteProduct)
router.get('/detail-product/:id', productController.getDetailProduct)
router.get('/all-product', productController.getAllProduct)

module.exports = router