const express = require('express')
const userController = require('../controllers/UserController')
const authController = require('../controllers/AuthController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/signup', userController.register);
router.post('/signin', authController.login);
router.put('/update-account/:id', middlewares.UserIdAccuracy, userController.updateAccount);
router.get('/detail-account/:id', middlewares.userOrAdminAccuracy, userController.getDetailAccount);
router.get('/all-account', middlewares.userAdminAccuracy, userController.getAllAccount);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', middlewares.userAccuracy, authController.logout);

module.exports = router