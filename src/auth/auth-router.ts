import {Router, Response, Request} from "express";
import {RequestBody, RequestURI} from "../common-types/request-types";
import {AuthInputModel, ConfirmationCodeInputModel, LoginSuccessViewModel, ResendEmailInputModel} from "./auth-types";
import {
   authPostConfirmationCodeMiddleware,
   authPostMiddleware, authRegistrationMiddleware,
   authResendEmailMiddleware
} from "./auth-middleware/auth-middleware";
import {ObjectId} from "mongodb";
import {usersQueryRepo} from "../users/users-repositories/users-query-repo";
import {jwtService} from "./jwt-service";
import {authBearerMiddleware} from "../common-middleware/auth";
import {UserInputModel} from "../users/users-types";
import {sendRegistrationMail} from "../adapters/gmail";
import {usersPostMiddleware} from "../users/users-middleware/users-middleware";
import {usersService} from "../users/users-service";

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
   }
)

authRouter.get('/me',
   authBearerMiddleware,
   async (req: Request, res: Response) => {
      const result = await usersQueryRepo.getUserData(new ObjectId(<string>req.headers.userId))
      return res.status(200).json(result)
   }
)

authRouter.post('/registration',
   authRegistrationMiddleware,
   async (req: RequestBody<UserInputModel>, res: Response) => {
      const newUser: UserInputModel = {
         login: req.body.login.toLowerCase(),
         password: req.body.password,
         email: req.body.email.toLowerCase(),
      }
      const user = await usersService.createNonAdministrativeUser(newUser)
      //@ts-ignore
      if (user.login) return res.status(204).json(user)
      return res.status(400).json(user)
   }
)

authRouter.post('/registration-email-resending',
   authResendEmailMiddleware,
   async (req: RequestBody<ResendEmailInputModel>, res: Response) => {
      const result = await usersService.resendConfirmationCode(req.body.email)
      if (typeof result !== "boolean") return res.status(400).send(result)
      return res.sendStatus(204)
   }
)

authRouter.post('/registration-confirmation',
   authPostConfirmationCodeMiddleware,
   async (req: RequestBody<ConfirmationCodeInputModel>, res: Response) => {
      const result = await usersService.checkConfirmationCode(req.body.code)
      if (typeof result !== "boolean") return res.status(400).send(result)
      return res.sendStatus(204)
   }
)