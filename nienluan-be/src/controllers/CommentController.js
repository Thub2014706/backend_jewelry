const CommentModel = require('../models/CommentModel')
const OrderModel = require('../models/OrderModel')

const addComment = async (req, res) => {
    const { user, product, shortComment, star } = req.body
    try {
        const isOrder = await OrderModel.findOne({ user: user, "cart.idProduct": product, status: 'Đã giao' })
        // const bought = await OrderModel.findOne({ user: user, "cart.idProduct": product})
        if (isOrder) {
            const comment = await CommentModel.create({ user, product, shortComment, star })
            res.status(200).json(comment)
        } else res.status(200).json({
            message: 'Không thể bình luận'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

module.exports = {
    addComment,
}