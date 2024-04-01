const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    main: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    // isDelete: { type: Boolean, default: 0 }
})

const AddressModel = mongoose.model('Address', AddressSchema)
module.exports = AddressModel