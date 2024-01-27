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

const cancelOrder = async (req, res) => {
    const idOrder = req.params.id
    try {
        const order = OrderModel.findById(idOrder)
        order.cart.map(async (item) => 
            await ProductModel.findOneAndUpdate(
                { "variants._id": item.idVariant },
                { $inc: {"variants.$.inStock": +quantity, selled: -quantity } },
                { new: true, upsert: false }
            )
        )
        await OrderModel.findByIdAndDelete({id: idOrder})
        res.status(200).json({
            message: 'Đã hủy đơn'
        })
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
}