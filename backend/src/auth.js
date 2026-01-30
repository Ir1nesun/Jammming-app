import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
const COOKIE_NAME = 'session'

export function signToken(payload){
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '7d'})
}

export function verifyToken(token){
    return jwt.verify(token, JWT_SECRET)
}

export {COOKIE_NAME}