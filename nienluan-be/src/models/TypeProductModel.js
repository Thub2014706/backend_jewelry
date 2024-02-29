const mongoose = require("mongoose");

const TypeProductSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    father: {type: String,  default: null},
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, {
    collection: 'types'
})

const TypeProductModel = mongoose.model('Type', TypeProductSchema)
module.exports = TypeProductModel