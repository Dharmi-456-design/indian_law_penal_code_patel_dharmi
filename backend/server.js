const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { validateEnv, PORT } = require('./src/config/env');
const errorMiddleware = require('./src/middlewares/error.middleware');
const loggerMiddleware = require('./src/middlewares/logger.middleware');

// Load env vars
dotenv.config();

// Validate env vars
validateEnv();

// Connect to database
connectDB();

const app = express();

// Rate limiter — 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
        errors: []
    }
});

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(loggerMiddleware);
app.use(express.json());
app.use('/api', limiter);

// Routes
const authRoutes = require('./src/routes/v1/auth.routes');
const sectionRoutes = require('./src/routes/v1/section.routes');
const searchRoutes = require('./src/routes/v1/search.routes');
const actRoutes = require('./src/routes/v1/act.routes');
const userRoutes = require('./src/routes/v1/user.routes');
const bookmarkRoutes = require('./src/routes/v1/bookmark.routes');
const analyticsRoutes = require('./src/routes/v1/analytics.routes');
const noteRoutes = require('./src/routes/v1/note.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sections', sectionRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/acts', actRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookmarks', bookmarkRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notes', noteRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});

// Error Handler
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;

