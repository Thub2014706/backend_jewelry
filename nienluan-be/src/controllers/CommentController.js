const CommentModel = require('../models/CommentModel')
const OrderModel = require('../models/OrderModel')
const UserModel = require('../models/UserModel')

const addComment = async (req, res) => {
    const idOrder = req.params.id
    try {
        const isOrder = await OrderModel.findOne({ _id: idOrder, status: 'Đã giao' })
        const existingComment = await CommentModel.findOne({ order: idOrder })
        const users = await UserModel.findOne({_id: isOrder.user})
        if (isOrder && !existingComment) {
            const arrayComment = await Promise.all(isOrder.cart.map(async (item, index) =>{                
                let { shortComment, star } = req.body[index]
                return await CommentModel.create({ 
                    user: {
                        iduser: isOrder.user,
                        username: users.username
                    }, 
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

const CommentDetailByProduct =  async (req, res) => {
    const id = req.params.id
    const comment = await CommentModel.findOne({ product: id })
    try {
        res.status(200).json(comment)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getAllCommentByUser =  async (req, res) => {
    const idUser = req.params.id
    const comment = await CommentModel.find({ "user.iduser": idUser })
    try {
        res.status(200).json(comment)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getAllCommentByProduct =  async (req, res) => {
    const idProduct = req.params.id
    const comment = await CommentModel.find({ product: idProduct })
    try {
        res.status(200).json(comment)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

module.exports = {
    addComment,
    CommentDetailByProduct,
    getAllCommentByUser,
    getAllCommentByProduct
}