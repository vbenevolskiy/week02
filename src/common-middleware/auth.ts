import {NextFunction, Request, Response} from 'express';
import {SETTINGS} from "../settings";
import {jwtService} from "../auth/jwt-service";
import {usersQueryRepo} from "../users/users-repositories/users-query-repo";
import {ObjectId} from "mongodb";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
   let auth = req.headers['authorization'] as string
   if (!auth) return res.sendStatus(401)
   const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
   const [basic, code] = auth.split(' ')
   if (code !== codedAuth || basic !== 'Basic') return res.sendStatus(401)
   next()
}

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      // console.log('No auth header or doesnt starts with Bearer')
      return res.sendStatus(401)
   }
   const token = req.headers.authorization.split(' ')[1]
   // console.log(token)
   const payload = jwtService.getUserIdByJWTToken(token)
   // console.log(`Payload: ${payload}`)
   if (!payload?.userId) {
      // console.log('No payload.userId')
      return res.sendStatus(401)
   }
   const user = await usersQueryRepo.getUserData(new ObjectId(payload.userId))
   // console.log(`User: ${user}`)
   if (!user) {
      // console.log('No user found')
      return res.sendStatus(401)
   }
   req.headers.userId = user.userId
   next()
}