const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1h'
    });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    });
};

// Register new user
const register = async (userData) => {
    const { email, password, name, role } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    // Create user
    const user = await User.create({
        email,
        password,
        name,
        role: role || 'annotator'
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return {
        user,
        token,
        refreshToken
    };
};

// Login user
const login = async (email, password) => {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    if (!user.isActive) {
        const error = new Error('Account is inactive');
        error.statusCode = 401;
        throw error;
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Remove password from response
    user.password = undefined;

    return {
        user,
        token,
        refreshToken
    };
};

// Refresh token
const refreshToken = async (refreshTokenString) => {
    try {
        const decoded = jwt.verify(refreshTokenString, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            const error = new Error('Invalid refresh token');
            error.statusCode = 401;
            throw error;
        }

        // Generate new tokens
        const token = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        return {
            user,
            token,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        error.statusCode = 401;
        error.message = 'Invalid or expired refresh token';
        throw error;
    }
};

// Get user profile
const getUserProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

module.exports = {
    register,
    login,
    refreshToken,
    getUserProfile,
    generateToken,
    generateRefreshToken
};
