const CommentModel = require('../models/CommentModel')
const OrderModel = require('../models/OrderModel')

const addComment = async (req, res) => {
    const idOrder = req.params.id
    try {
        const isOrder = await OrderModel.findOne({ _id: idOrder, status: 'Đã giao' })
        const existingComment = await CommentModel.findOne({ order: idOrder })
        if (isOrder && !existingComment) {
            const arrayComment = await Promise.all(isOrder.cart.map(async (item, index) =>{                
                let { shortComment, star } = req.body[index]
                return await CommentModel.create({ 
                    user: isOrder.user, 
                    order: idOrder,
                    product: item.idProduct, 
                    shortComment: shortComment,
                    star: star
                })
            }))
        res.status(200).json(arrayComment)
        }
         else res.status(400).json({
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