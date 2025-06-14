import { config } from '../config/config.js'

const globalErrorHandling = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        errorStack: config.env === 'dev' ? err.stack : '',
        success: false,
    })

}

export default globalErrorHandling