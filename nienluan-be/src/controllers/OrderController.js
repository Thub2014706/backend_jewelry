const OrderModel = require('../models/OrderModel')
const ProductModel = require('../models/ProductModel')
const AddressModel = require('../models/AddressModel')

const createOrder = async (req, res) => {
    const { total, amount, cart, status, user, shipping } = req.body
    try {
        const order = await OrderModel.create({total, amount, cart, variants: [{ status: status, date: Date.now() }], user, shipping})
        if (order) {
            cart.map(async (item) => 
                await ProductModel.findOneAndUpdate(
                    { "variants._id": item.idVariant },
                    { 
                        $inc: { "variants.$.inStock": - item.quantity, selled: + item.quantity }, 
                    }, 
                    { new: true, upsert: false } 
                )
            )
        }
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
        const data = await Promise.all(order.map(async item => {
            const ship = await AddressModel.findOne({ _id: item.shipping })
            return {data: item, ship}
        }))
        res.status(200).json(data)
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
        await OrderModel.findByIdAndUpdate({_id: idOrder}, { $push: { variants: { status: 'Đã hủy', date: Date.now() } } }, { new: true })
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
    const { value } = req.query
    try {
        const order = await OrderModel.find({ user: idUser })
        const array = order.filter((item) => {
            let bool = true
            if (value === 'rocessing') {
                bool = bool && item.variants[item.variants.length - 1].status === 'Đang xử lý'
            }
            if (value === 'transport') {
                bool = bool && (item.variants[item.variants.length - 1].status === 'Đang vận chuyển' 
                    || item.variants[item.variants.length - 1].status === 'Giao hàng')
            }
            if (value === 'delivered') {
                bool = bool && item.variants[item.variants.length - 1].status === 'Đã giao'
            }
            if (value === 'cancelled') {
                bool = bool && item.variants[item.variants.length - 1].status === 'Đã hủy'
            }
            return bool;
        })
        res.status(200).json(array)
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
        const ship = await AddressModel.findOne({ _id: order.shipping })
        res.status(200).json({data: order, ship})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const updateStatus = async (req, res) => {
    const idOrder = req.params.id
    const { status, shipper, note } = req.body
    try {
        const order = await OrderModel.findByIdAndUpdate(
            { _id: idOrder }, 
            { $push: { variants: { status: status, date: Date.now(), note: note && note } }, 
                shipper: shipper ? shipper : null, 
            },
            { new: true }
        )
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allOrderTransport = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        const array = order.filter((item) => {
            let bool = true
            bool = bool && item.variants[item.variants.length - 1].status === 'Đang vận chuyển'
            return bool;
        })
        // const order = await OrderModel.find({ "variants[variants.length - 1].status": 'Đang vận chuyển' })
        const data = await Promise.all(array.map(async item => {
            const ship = await AddressModel.findOne({ _id: item.shipping })
            return {data: item, ship}
        }))
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allOrderConfirm = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        const array = order.filter((item) => {
            let bool = true
            bool = bool && item.variants[item.variants.length - 1].status === 'Giao hàng'
            return bool;
        })
        const data = await Promise.all(array.map(async item => {
            const ship = await AddressModel.findOne({ _id: item.shipping })
            return {data: item, ship}
        }))
        res.status(200).json(data)
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
    updateStatus,
    allOrderTransport,
    allOrderConfirm
}