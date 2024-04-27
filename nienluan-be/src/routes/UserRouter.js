const express = require('express')
const userController = require('../controllers/UserController')
const authController = require('../controllers/AuthController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/signup', userController.register);
router.post('/signin', authController.login);
router.put('/update-account/:id', middlewares.UserIdAccuracy, userController.updateAccount);
router.get('/detail-account/:id', middlewares.userOrAdminAccuracy, userController.getDetailAccount);
router.get('/all-account',  userController.getAllAccount);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', middlewares.userAccuracy, authController.logout);
router.put('/add-favorite/:id', middlewares.UserIdAccuracy, userController.addFavorite);
router.get('/test-favorite/:id', userController.testFavorite);
router.put('/delete-favorite/:id', middlewares.UserIdAccuracy, userController.deleteFavorite);
router.get('/all-favorite-by-user/:id', middlewares.userOrAdminAccuracy, userController.allFavoriteByUser);
router.get('/number-favorite-by-product/:id', userController.numberFavoriteByProduct);

module.exports = router