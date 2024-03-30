const mongoose = require("mongoose");

const TypeProductSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    father: {type: String,  default: null},
    isDelete: { type: Boolean, default: 0 }
}, {
    collection: 'types'
})

const TypeProductModel = mongoose.model('Type', TypeProductSchema)
module.exports = TypeProductModel