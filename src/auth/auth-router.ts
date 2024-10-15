import {Router, Response, Request} from "express";
import {RequestBody, RequestURI} from "../common-types/request-types";
import {AuthInputModel, LoginSuccessViewModel} from "./auth-types";
import {authPostMiddleware} from "./auth-middleware/auth-middleware";
import {ObjectId} from "mongodb";
import {usersQueryRepo} from "../users/users-repositories/users-query-repo";
import {jwtService} from "./jwt-service";
import {authBearerMiddleware} from "../common-middleware/auth";
import {UserInputModel} from "../users/users-types";

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
         accessToken: jwtService.createJWTToken(user._id.toString())
      }
      res.status(200).json(success)
   })

authRouter.get('/me',
   authBearerMiddleware,
   async (req:Request, res: Response)=>{
   const result = await usersQueryRepo.getUserData(new ObjectId(<string>req.headers.userId))
   return res.status(200).json(result)
})

authRouter.post('registration',
   async (req: RequestBody<UserInputModel>, res: Response) => {

   })