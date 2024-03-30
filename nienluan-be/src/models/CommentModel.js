const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: {
        iduser: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        username: { type: String, required: true },
    },
    shortComment: { type: String },
    star: { type: Number, required: true, default: 5 },
    isDelete: { type: Boolean, default: 0 }
}, {
    timestamps: true 
}
);

const CommentModel = mongoose.model('Comment', CommentSchema)

module.exports = CommentModel