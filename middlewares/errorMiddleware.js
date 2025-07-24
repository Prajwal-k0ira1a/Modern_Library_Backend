class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (err.code === 11000) {
        const statusCode = 400;
        const message = `Duplicate Field Value Entered`;
        err = new ErrorHandler(message, statusCode);
    }
    if (err.name === "JsonWebTokenError") {
        const statusCode = 400;
        const message = `Json Web Token is invalid. Try again.`;
        err = new ErrorHandler(message, statusCode);
    }

    if (err.name === "TokenExpiredError") {
        const statusCode = 480;
        const message = `Token is expired. Try again.`;
        err = new ErrorHandler(message, statusCode);
        // Log the error for debugging purposes
        console.error(err);
    }
    if (err.name === "CastError") {
        const statusCode = 400;
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, statusCode);
    }
    const errorMessage = err.errors ? Object.values(err.errors).map(value => value.message).join(', ') : err.message;
    res.status(statusCode).json({
        success: false,
        message: errorMessage
    });
}
export default ErrorHandler;