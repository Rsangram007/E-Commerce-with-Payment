const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true,
        unique: true
    },
    paymentStatus: {
        type: String,
        enum: ['succeeded', 'pending', 'failed'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

