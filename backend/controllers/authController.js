const authService = require('../services/authService');

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        res.status(201).json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
                refreshToken: result.refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        res.json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
                refreshToken: result.refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            const error = new Error('Refresh token is required');
            error.statusCode = 400;
            throw error;
        }

        const result = await authService.refreshToken(refreshToken);

        res.json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
                refreshToken: result.refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserProfile(req.user._id);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    getMe
};
