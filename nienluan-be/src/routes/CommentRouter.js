const express = require('express')
const commentController = require('../controllers/CommentController')
const middlewares = require('../controllers/MiddlewareController')
const router = express.Router()

router.post('/add-comment/:id', middlewares.userAccuracy, commentController.addComment)

module.exports = router
