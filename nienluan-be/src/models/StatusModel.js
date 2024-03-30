const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isDelete: { type: Boolean, default: 0 }
}, { 
    timestamps: true
})

const StatusModel = mongoose.model('Status', StatusSchema)
module.exports = StatusModel