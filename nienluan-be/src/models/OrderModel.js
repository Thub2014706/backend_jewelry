const mongoose = require('mongoose');

const OrderStatus = {
    0: 'Đang xử lý',
    1: 'Đang vận chuyển',
    2: 'Giao hàng',
    3: 'Chưa hoàn thành',
    4: 'Đã giao',
    5: 'Đã hủy',
    6: 'Đã hoàn thành'
};

const OrderSchema = new mongoose.Schema({
    total: { type: Number, required: true },
    amount: { type: Number, required: true },
    cart: [{
        name: { type: String, required: true },
        image: { type: Object, required: true },
        size: { type: Number, required: true },
        price: { type: Number, required: true },
        priceMain: { type: Number, required: true },
        priceBuy: { type: Number, required: true },
        quantity: { type: Number, required: true },
        idVariant: { type: String, required: true },
        idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }],
    variants: [{
        status: { type: String, default: OrderStatus[0], required: true },
        date: { type: Date, default: Date.now(), required: true },
        note: { 
            type: String, 
            required: function() {
                return this.status === OrderStatus[3];
            } 
        },
        shipper: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user', 
            required: function() {
                return this.status === OrderStatus[2] || this.status === OrderStatus[3] || this.status === OrderStatus[4];
            } 
        },
    }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    shipping: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    isDelete: { type: Boolean, default: 0 }
}, { 
    timestamps: true
})

const OrderModel = mongoose.model('Order', OrderSchema)
module.exports = {OrderModel, OrderStatus}