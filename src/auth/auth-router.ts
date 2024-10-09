import {Router, Response, Request} from "express";
import {RequestBody} from "../common-types/request-types";
import {AuthInputModel, LoginSuccessViewModel} from "./auth-types";
import {authPostMiddleware} from "./auth-middleware/auth-middleware";
import {ObjectId} from "mongodb";
import {usersQueryRepo} from "../users/users-repositories/users-query-repo";
import {jwtService} from "./jwt-service";

export const authRouter = Router();

authRouter.post("/login",
   authPostMiddleware,
   async (req: RequestBody<AuthInputModel>, res: Response) => {
      const credentials: AuthInputModel = {
         loginOrEmail: req.body.loginOrEmail,
         password: req.body.password
      }
      const user = await usersQueryRepo.checkUserCredentials(credentials)
      if (!user) return res.sendStatus(401)
      const success: LoginSuccessViewModel = {
         accessToken: jwtService.createJWTToken(user)
      }
      res.status(200).json(success)
   })

authRouter.get('/me',
   async (req:Request, res: Response)=>{
   if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) return res.sendStatus(401)
   const userId = jwtService.getUserIdByJWTToken(req.headers.authorization.split(' ')[1])
   if (!userId) return res.sendStatus(401)
   const result = await usersQueryRepo.getUserData(new ObjectId(userId))
   return res.sendStatus(200).json(result)
})