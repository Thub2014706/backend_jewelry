const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: Array, required: true},
    type: { type: Array, required: true},
    price: { type: Number, required: true },
    information: { type: String, required: true },
    inStock: { type: Number, required: true },
    selled: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    size: { type: Number }
}, {
    timestamps: true 
}, {
    collection: 'products'
})

const ProductModel = mongoose.model('Product', ProductSchema)

module.exports = ProductModel