const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    isAdmin: { type: Boolean, default: false },
    shipper: { type: Boolean, default: false }
}, {
    timestamps: true 
}, {
    collection: 'users'
});

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel