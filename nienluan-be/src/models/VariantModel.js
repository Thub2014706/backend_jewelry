const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
    size: { type: Number, default: null }, 
    inStock: { type: Number, required: true },
})

const VariantModel = mongoose.model('Variant', VariantSchema)

module.exports = VariantModel