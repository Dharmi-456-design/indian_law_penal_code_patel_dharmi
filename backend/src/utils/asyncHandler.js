/**
 * Higher-order function to handle async errors in Express routes.
 * Eliminates the need for try-catch blocks in controllers.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

module.exports = asyncHandler;
