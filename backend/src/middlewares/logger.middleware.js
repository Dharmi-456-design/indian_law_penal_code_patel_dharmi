const morgan = require('morgan');

/**
 * HTTP request logger middleware using morgan.
 * Uses 'dev' format in development, 'combined' in production.
 */
const loggerMiddleware =
    process.env.NODE_ENV === 'production'
        ? morgan('combined')
        : morgan('dev');

module.exports = loggerMiddleware;
