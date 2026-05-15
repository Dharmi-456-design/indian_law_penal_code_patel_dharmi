const dotenv = require('dotenv');

dotenv.config();

const envSchema = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};

const validateEnv = () => {
    const missing = [];
    if (!envSchema.MONGO_URI) missing.push('MONGO_URI');
    if (!envSchema.JWT_SECRET) missing.push('JWT_SECRET');

    if (missing.length > 0) {
        throw new Error(`Config validation error: missing ${missing.join(', ')}`);
    }
};

module.exports = {
    ...envSchema,
    validateEnv
};
