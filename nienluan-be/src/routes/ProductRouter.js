const express = require('express')
const productController = require('../controllers/ProductController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/add-product', middlewares.userAdminAccuracy, productController.addProduct)
router.put('/update-product/:id', middlewares.userAdminAccuracy, productController.updateProduct)
router.delete('/delete-product/:id', middlewares.userAdminAccuracy, productController.deleteProduct)
router.get('/detail-product/:id', productController.getDetailProduct)
router.get('/all-product', productController.getAllProduct)
router.post('/create-type', middlewares.userAdminAccuracy, productController.createType)
router.get('/getall-type', middlewares.userAdminAccuracy, productController.getAllType)
router.delete('/delete-type', middlewares.userAdminAccuracy, productController.getAllType)

module.exports = router