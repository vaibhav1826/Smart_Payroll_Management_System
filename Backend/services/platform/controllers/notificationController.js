const Notification = require('../models/Notification');
const { success, fail, serverError } = require('../../../shared/utils/response');

exports.list = async (req, res) => {
    try {
        const filter = { user: req.user.userId };
        if (req.query.unread === 'true') filter.isRead = false;
        const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
        const unreadCount = await Notification.countDocuments({ user: req.user.userId, isRead: false });
        return success(res, { notifications, unreadCount });
    } catch (err) { return serverError(res, err); }
};

exports.create = async (req, res) => {
    try {
        const { user, title, message, type, link } = req.body;
        if (!user || !title) return fail(res, 'User and title required.');
        const n = await Notification.create({ user, title, message, type, link });
        return success(res, { notification: n }, 'Notification created.', 201);
    } catch (err) { return serverError(res, err); }
};

exports.markRead = async (req, res) => {
    try {
        const n = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!n) return fail(res, 'Not found.', 404);
        return success(res, { notification: n });
    } catch (err) { return serverError(res, err); }
};

exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.userId, isRead: false }, { isRead: true });
        return success(res, {}, 'All marked as read.');
    } catch (err) { return serverError(res, err); }
};

exports.remove = async (req, res) => {
    try { await Notification.findByIdAndDelete(req.params.id); return success(res, {}, 'Deleted.'); }
    catch (err) { return serverError(res, err); }
};
