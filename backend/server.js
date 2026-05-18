const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { validateEnv, PORT } = require('./src/config/env');
const errorMiddleware = require('./src/middlewares/error.middleware');

// Load env vars
dotenv.config();

// Validate env vars
validateEnv();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/v1/auth.routes');
const sectionRoutes = require('./src/routes/v1/section.routes');
const searchRoutes = require('./src/routes/v1/search.routes');
const actRoutes = require('./src/routes/v1/act.routes');
const userRoutes = require('./src/routes/v1/user.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sections', sectionRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/acts', actRoutes);
app.use('/api/v1/users', userRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});

// Error Handler
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
