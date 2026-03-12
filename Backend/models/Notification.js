const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);
