const mongoose = require('mongoose');

const RefreshSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'}, 
    expires: { type: Date, required: true }
}, { 
    timestamps: true
})

const RefreshModel = mongoose.model('Refresh', RefreshSchema)
module.exports = RefreshModel