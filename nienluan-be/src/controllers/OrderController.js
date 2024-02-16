const OrderModel = require('../models/OrderModel')
const ProductModel = require('../models/ProductModel')

const createOrder = async (req, res) => {
    const { total, amount, cart, user, shipping } = req.body
    try {
        cart.map(async (item) => 
            await ProductModel.findOneAndUpdate(
                { "variants._id": item.idVariant },
                { 
                    $inc: { "variants.$.inStock": - item.quantity, selled: + item.quantity }, 
                }, 
                { new: true, upsert: false } 
            )
        )
        const order = await OrderModel.create(req.body)
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allOrder = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const cancelOrder = async (req, res) => {
    const idOrder = req.params.id
    try {
        const order = await OrderModel.findOne({_id: idOrder})
        order.cart.map(async (item) => 
            await ProductModel.findOneAndUpdate(
                { "variants._id": item.idVariant },
                { $inc: {"variants.$.inStock": +item.quantity, selled: -item.quantity } },
                { new: true, upsert: false }
            )
        )
        await OrderModel.findByIdAndUpdate({_id: idOrder}, { status: 'Đã hủy' }, { new: true })
        res.status(200).json({
            message: 'Đã hủy đơn'
        })
    } catch (err) {
        console.log(err)
        // console.log(order)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allOrderByUser = async (req, res) => {
    const idUser = req.params.id
    try {
        const order = await OrderModel.find({ user: idUser })
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const orderDetail = async (req, res) => {
    const idOrder = req.params.id
    try {
        const order = await OrderModel.findOne({ _id: idOrder })
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const updateStatus = async (req, res) => {
    const idOrder = req.params.id
    // const { status } = req.body
    try {
        const orderById = await OrderModel.findOne({_id: idOrder})
        const findStatus = orderById.status
        let order
        if (findStatus === 'Đang xử lý') {
            order = await OrderModel.findByIdAndUpdate({ _id: idOrder }, { status: 'Đang vận chuyển' }, { new: true })
        } else if (findStatus === 'Đang vận chuyển') {
            order = await OrderModel.findByIdAndUpdate({ _id: idOrder }, { status: 'Đã giao' }, { new: true })
        }
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

module.exports = {
    createOrder,
    cancelOrder,
    allOrderByUser,
    allOrder,
    orderDetail,
    updateStatus
}