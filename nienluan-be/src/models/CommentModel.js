const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    shortComment: { type: String, required: true },
    star: { type: Number, required: true, default: 5 },
}, {
    timestamps: true 
}
);

const CommentModel = mongoose.model('Comment', CommentSchema)

module.exports = CommentModel