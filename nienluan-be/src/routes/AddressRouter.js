const express = require('express')
const AddressController = require('../controllers/AddressController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/add-address', middlewares.userAccuracy, AddressController.addAddress)
router.put('/update-address/:id', middlewares.userAccuracy, AddressController.updateAddress)
router.get('/detail-address/:id', middlewares.userAccuracy, AddressController.getDetail)
router.get('/getall-by-user/:id', middlewares.userOrAdminAccuracy, AddressController.getAllAddressByUser)
router.get('/getall', middlewares.userAdminAccuracy, AddressController.allAdress)
router.delete('/delete-by-user/:id', middlewares.userAccuracy, AddressController.deleteAddressByUser)

module.exports = router