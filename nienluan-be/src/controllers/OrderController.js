// const OrderModel = require('../models/OrderModel')
const { OrderModel, OrderStatus } = require('../models/OrderModel');
const ProductModel = require('../models/ProductModel')
const AddressModel = require('../models/AddressModel');
const { transporter } = require('./EmailController');
const UserModel = require("../models/UserModel");
const moment = require('moment');

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
    const { shipper } = req.body
    try {
        const order = await OrderModel.findOne({_id: idOrder})
        order.cart.map(async (item) => 
            await ProductModel.findOneAndUpdate(
                { "variants._id": item.idVariant },
                { $inc: {"variants.$.inStock": +item.quantity, selled: -item.quantity } },
                { new: true, upsert: false }
            )
        )
        await OrderModel.findByIdAndUpdate(
            {_id: idOrder}, 
            { $push: { variants: { status: OrderStatus[5], date: Date.now(), shipper: shipper && shipper } } }, 
            { new: true }
        )
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
    // const { value } = req.query
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

const rocessingByUser = async (req, res) => {
    const idUser = req.params.id
    try {
        const order = await OrderModel.find({ user: idUser})
        const array = order.filter((item) => 
            item.variants[item.variants.length - 1].status === OrderStatus[0]
        )
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const transportByUser = async (req, res) => {
    const idUser = req.params.id
    try {
        const order = await OrderModel.find({ user: idUser })
        const array = order.filter((item) => (item.variants[item.variants.length - 1].status === OrderStatus[1]))
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const deliveringByUser = async (req, res) => {
    const idUser = req.params.id
    try {
        const order = await OrderModel.find({ user: idUser })
        const array = order.filter((item) =>  (
                [OrderStatus[2], OrderStatus[3], OrderStatus[4]].includes(item.variants[item.variants.length - 1].status)
            )
        )
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const finishedByUser = async (req, res) => {
    const idUser = req.params.id
    try {
        const order = await OrderModel.find({ user: idUser })
        const array = order.filter((item) => item.variants[item.variants.length - 1].status === OrderStatus[6])
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const cancelledByUser = async (req, res) => {
    const idUser = req.params.id
    try {
        const order = await OrderModel.find({ user: idUser })
        const array = order.filter((item) => item.variants[item.variants.length - 1].status === OrderStatus[5])
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
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const transportUpdate = async (req, res) => {
    const idOrder = req.params.id
    try {
        const order = await OrderModel.findByIdAndUpdate(
            { _id: idOrder }, 
            { $push: { variants: { status: OrderStatus[1], date: Date.now() } } },
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

const deliveringUpdate = async (req, res) => {
    const idOrder = req.params.id
    const { shipper } = req.body
    try {
        const order = await OrderModel.findByIdAndUpdate(
            { _id: idOrder }, 
            { $push: { variants: { status: OrderStatus[2], date: Date.now(), shipper: shipper } } },
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

const deliveredUpdate = async (req, res) => {
    const idOrder = req.params.id
    const { shipper } = req.body
    try {
        const findOrder = await OrderModel.findById(idOrder)
        const idUser = await UserModel.findById(findOrder.user)
        const order = await OrderModel.findByIdAndUpdate(
            { _id: idOrder }, 
            { $push: { variants: { status: OrderStatus[4], date: Date.now(), shipper: shipper } } },
            { new: true }
        )
        if (order) {
            await transporter.sendMail({
                from: `"GIATHU JEWELRY" <${process.env.EMAIL_ACCOUNT}>`, // sender address
                to: `${idUser.email}`, // list of receivers
                subject: "Xác nhận đơn hàng của bạn.", // Subject line
                text: `Xin chào ${idUser.username},
                Đơn hàng của bạn đã được giao thành công vào ${moment(order.variants[order.variants.length - 1]).format('DD/MM/YYYY')}.
                Hãy nhận hàng ngay và đánh giá 5 sao giúp shop nhé!`, // plain text body
                html: `<p>Xin chào ${idUser.username},
                <br />
                Đơn hàng của bạn đã được giao thành công vào
                ${moment(order.variants[order.variants.length - 1]).format('DD/MM/YYYY')}.
                <br />
                Hãy nhận hàng ngay và đánh giá 5 ⭐ giúp shop nhé!
                <br />
                Chân thành cảm ơn quý khách!
                <br />
                <a href="https://shopee.vn/">Đã nhận hàng</a>
                </p>`, // html body
              });
        }
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const unfinishedUpdate = async (req, res) => {
    const idOrder = req.params.id
    const { shipper, note } = req.body
    try {
        const order = await OrderModel.findByIdAndUpdate(
            { _id: idOrder }, 
            { $push: { variants: { status: OrderStatus[3], date: Date.now(), note: note, shipper: shipper } } },
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

const finishedUpdate = async (req, res) => {
    const idOrder = req.params.id
    // const { shipper, note } = req.body
    try {
        const order = await OrderModel.findByIdAndUpdate(
            { _id: idOrder }, 
            { $push: { variants: { status: OrderStatus[6], date: Date.now() } } },
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

const allStatus = async (req, res) => {
    const idOrder = req.params.id
    try {
        const orders = await OrderModel.findOne({_id: idOrder})
        const allStatus = orders.variants.filter(item => item.status === OrderStatus[3])
        res.status(200).json(allStatus)
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
        const array = order.filter((item) => 
            ([OrderStatus[1], OrderStatus[3]].includes(item.variants[item.variants.length - 1].status))
        )
        res.status(200).json(array)
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
        const array = order.filter((item) => 
            item.variants[item.variants.length - 1].status === OrderStatus[2]
        )
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allTransport = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        const array = order.filter((item) => 
            ([OrderStatus[1], OrderStatus[2]].includes(item.variants[item.variants.length - 1].status))
        )
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allRocessing = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        const array = order.filter((item) => 
            item.variants[item.variants.length - 1].status === OrderStatus[0]
        )
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allDelivered = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        const array = order.filter((item) => 
            item.variants[item.variants.length - 1].status === OrderStatus[4]
        )
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allUnfinished = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        const array = order.filter((item) => 
            item.variants[item.variants.length - 1].status === OrderStatus[3]
        )
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allFinished = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        const array = order.filter((item) => 
            item.variants[item.variants.length - 1].status === OrderStatus[6]
        )
        res.status(200).json(array)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allCancel = async (req, res) => {
    try {
        const order = await OrderModel.find({})
        const array = order.filter((item) => 
            item.variants[item.variants.length - 1].status === OrderStatus[5]
        )
        res.status(200).json(array)
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
    rocessingByUser,
    transportByUser,
    deliveringByUser,
    finishedByUser,
    cancelledByUser,
    allOrder,
    orderDetail,
    transportUpdate,
    deliveringUpdate,
    deliveredUpdate,
    unfinishedUpdate,
    finishedUpdate,
    allStatus,
    allOrderTransport,
    allOrderConfirm,
    allTransport,
    allRocessing,
    allDelivered,
    allUnfinished,
    allFinished,
    allCancel
}