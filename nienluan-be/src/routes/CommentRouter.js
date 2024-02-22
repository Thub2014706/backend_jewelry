const express = require('express')
const commentController = require('../controllers/CommentController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/add-comment/:id', middlewares.userAccuracy, commentController.addComment)
router.get('/detail-comment/:id', middlewares.userAccuracy, commentController.CommentDetailByProduct)
router.get('/all-comment-by-user/:id', middlewares.UserIdAccuracy, commentController.getAllCommentByUser)
router.get('/all-comment-by-product/:id', commentController.getAllCommentByProduct)

module.exports = router
