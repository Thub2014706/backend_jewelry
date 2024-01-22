const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: Array, required: true},
    // type: { type: Array, required: true},
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type'}, 
    price: { type: Number, required: true },
    information: { type: String, required: true },
    selled: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    variants: [
        {
          size: { type: Number, default: null }, 
          inStock: { type: Number, required: true },
        },
      ],
}, {
    timestamps: true 
}, {
    collection: 'products'
})

const ProductModel = mongoose.model('Product', ProductSchema)

module.exports = ProductModel