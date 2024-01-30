const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
}, { 
    timestamps: true
})

const StatusModel = mongoose.model('Status', StatusSchema)
module.exports = StatusModel