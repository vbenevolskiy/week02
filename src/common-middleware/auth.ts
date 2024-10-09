import {NextFunction, Request, Response} from 'express';
import {SETTINGS} from "../settings";
import {jwtService} from "../auth/jwt-service";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let auth = req.headers['authorization'] as string // 'Basic xxxx'
    //TODO: refactor this function
    if (!auth) {
        res
            .status(401)
            .json({})
        return
    }

    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
    const codedAuth = buff2.toString('base64')

    if (auth.slice(6) !== codedAuth || auth.slice(0, 6) !== 'Basic ') {
        res
            .status(401)
            .json({})
        return
    }
    next()
}

export const authBearerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) return res.sendStatus(401)
    const userId = jwtService.getUserIdByJWTToken(req.headers.authorization.split(' ')[1])
    if (!userId) return res.sendStatus(401)
    req.headers.userId = userId
    next()
}