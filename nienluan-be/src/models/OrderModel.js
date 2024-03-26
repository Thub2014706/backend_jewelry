const mongoose = require('mongoose');

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
        status: { type: String, required: true },
        date: { type: Date, default: Date.now(), required: true },
        note: { 
            type: String, 
            required: function() {
                return this.status === 'Chưa hoàn thành';
            } 
        }
    }],
    shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    shipping: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
}, { 
    timestamps: true
})

const OrderModel = mongoose.model('Order', OrderSchema)
module.exports = OrderModel