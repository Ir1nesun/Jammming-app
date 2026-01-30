import { COOKIE_NAME, verifyToken } from "../auth.js";

export function requireAuth(req, res, next){
    const token = req.cookies?.[COOKIE_NAME]
    if(!token) return res.status(401).json({error: 'Unauthorized'})

    try{
        const payload = verifyToken(token)
        req.user = payload;
        next()
    } catch {
        return res.status(401).json({error: 'Unauthorized'})
    }
}