const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE, NODE_ENV } = require('../../../shared/config');
const { success, fail, serverError } = require('../../../shared/utils/response');
const { isValidEmail, sanitize } = require('../../../shared/utils/validators');
const { logAudit } = require('../../../shared/middleware/auditLogger');

const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
};

function signToken(user) {
    return jwt.sign(
        { userId: user._id, role: user.role, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

function safeUser(user) {
    return { _id: user._id, email: user.email, role: user.role, name: user.name, phone: user.phone, isActive: user.isActive };
}

/** POST /api/auth/register */
exports.register = async (req, res) => {
    try {
        const { email, password, name, role, phone } = req.body;
        if (!email || !password || !name) return fail(res, 'Name, email, and password are required.');
        if (!isValidEmail(email)) return fail(res, 'Invalid email format.');
        if (password.length < 6) return fail(res, 'Password must be at least 6 characters.');

        const validRoles = ['admin', 'supervisor', 'employee', 'contractor'];
        const userRole = validRoles.includes(role) ? role : 'employee';

        const existing = await User.findOne({ email: sanitize(email).toLowerCase() });
        if (existing) return fail(res, 'An account with this email already exists.', 409);

        const user = await User.create({
            email: sanitize(email).toLowerCase(),
            password,
            name: sanitize(name),
            role: userRole,
            phone: sanitize(phone || ''),
        });

        const token = signToken(user);
        res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);

        logAudit({ userId: user._id, userName: user.name, userRole: user.role, action: 'REGISTER', module: 'auth', targetId: user._id.toString(), details: `New ${userRole} registration`, ip: req.ip });

        return success(res, { user: safeUser(user) }, 'Registration successful.', 201);
    } catch (err) {
        if (err.code === 11000) return fail(res, 'Email already registered.', 409);
        return serverError(res, err);
    }
};

/** POST /api/auth/login */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return fail(res, 'Email and password required.');

        const user = await User.findOne({ email: sanitize(email).toLowerCase(), isActive: true }).select('+password');
        if (!user) return fail(res, 'Invalid email or password.', 401);

        const valid = await user.comparePassword(password);
        if (!valid) return fail(res, 'Invalid email or password.', 401);

        const token = signToken(user);
        res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);

        logAudit({ userId: user._id, userName: user.name, userRole: user.role, action: 'LOGIN', module: 'auth', targetId: user._id.toString(), details: 'User logged in', ip: req.ip });

        return success(res, { user: safeUser(user) }, 'Login successful.');
    } catch (err) {
        return serverError(res, err);
    }
};

/** POST /api/auth/logout */
exports.logout = (req, res) => {
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/', httpOnly: true, sameSite: 'lax' });
    return success(res, {}, 'Logged out.');
};

/** POST /api/auth/refresh */
exports.refresh = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || !user.isActive) return fail(res, 'User not found.', 401);
        const token = signToken(user);
        res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);
        return success(res, { user: safeUser(user) });
    } catch (err) {
        return serverError(res, err);
    }
};

/** GET /api/auth/me */
exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || !user.isActive) return fail(res, 'User not found.', 401);
        return success(res, { user: safeUser(user) });
    } catch (err) {
        return serverError(res, err);
    }
};

/** GET /api/auth/users — admin only */
exports.listUsers = async (req, res) => {
    try {
        const { search, role, status } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (status === 'active') filter.isActive = true;
        if (status === 'inactive') filter.isActive = false;
        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [{ name: regex }, { email: regex }];
        }
        const users = await User.find(filter).sort({ createdAt: -1 });
        return success(res, { users: users.map(safeUser) });
    } catch (err) {
        return serverError(res, err);
    }
};

/** PUT /api/auth/users/:id — admin update user role/status */
exports.updateUser = async (req, res) => {
    try {
        const updates = {};
        if (req.body.role) updates.role = req.body.role;
        if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
        if (req.body.name) updates.name = sanitize(req.body.name);
        if (req.body.phone !== undefined) updates.phone = sanitize(req.body.phone);

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!user) return fail(res, 'User not found.', 404);
        return success(res, { user: safeUser(user) }, 'User updated.');
    } catch (err) {
        return serverError(res, err);
    }
};
