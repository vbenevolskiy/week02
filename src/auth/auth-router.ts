import {Router, Response} from "express";
import {RequestBody} from "../common-types/request-types";
import {AuthInputModel} from "./auth-types";
import {authPostMiddleware} from "./auth-middleware/auth-middleware";
import {ObjectId} from "mongodb";
import {usersQueryRepo} from "../users/users-repositories/users-query-repo";

export const authRouter = Router();

authRouter.post("/",
   authPostMiddleware,
   async (req:RequestBody<AuthInputModel>, res:Response) => {
      const isExistingUser: ObjectId | null = await usersQueryRepo.validateUserLoginOrEmail(req.body.loginOrEmail)
      if (!isExistingUser) return res.sendStatus(401)
      const isValidPassword: boolean = await usersQueryRepo.validateUserPassword(isExistingUser, req.body.password)
      if (isValidPassword) return res.sendStatus(204)
      return res.sendStatus(401)
   })