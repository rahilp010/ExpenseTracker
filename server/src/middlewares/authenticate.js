import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { config } from '../config/config.js'

const authenticate = (req, res, next) => {

    const token = req.headers['authorization']

    if (!token) {
        return next(createHttpError(401, 'Unauthorized'))
    }

    const parsedToken = token.split(' ')[1]

    try {
        const decodedToken = jwt.verify(parsedToken, config.jwtSecret)
        console.log("Decoded token", decodedToken);

        req.userId = decodedToken.sub

        next()
    } catch (error) {
        return next(createHttpError(401, 'Token Expired.'))
    }

}

export default authenticate