const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    total: { type: Number, required: true },
    amount: { type: Number, required: true },
    cart: [{
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        idVariant: { type: String, required: true },
        idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }],
    // products: { type: Array, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    shipping: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
}, { 
    timestamps: true
})

const OrderModel = mongoose.model('Order', OrderSchema)
module.exports = OrderModel