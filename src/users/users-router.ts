import {Router, Response} from "express";
import {usersGetMiddleware, usersPostMiddleware, usersDeleteMiddleware} from "./users-middleware/users-middleware";
import {usersQueryRepo} from "./users-repositories/users-query-repo";
import {RequestBody, RequestQuery, RequestURI, ResponseBody} from "../common-types/request-types";
import {UserInputModel, UsersPaginator, UsersQueryInputModel, UsersURIParams, UserViewModel} from "./users-types";
import {usersService} from "./users-service";
import {APIErrorResult} from "../common-types/errors-types";

export const usersRouter = Router();

usersRouter.get("/",
   usersGetMiddleware,
   async (req: RequestQuery<UsersQueryInputModel>, res: ResponseBody<UsersPaginator>) => {
      const qOptions: UsersQueryInputModel = {
         sortBy: req.query.sortBy!,
         sortDirection: req.query.sortDirection!,
         pageSize: req.query.pageSize!,
         pageNumber: req.query.pageNumber!,
         searchEmailTerm: req.query.searchEmailTerm!,
         searchLoginTerm: req.query.searchLoginTerm!
      }
      const totalCount = await usersQueryRepo.getTotalCount(qOptions)
      const paginator: UsersPaginator = {
         pagesCount: Math.ceil(totalCount / qOptions.pageSize),
         page: qOptions.pageNumber,
         pageSize: qOptions.pageSize,
         totalCount: totalCount,
         items: await usersQueryRepo.getAllUsers(qOptions)
      }
      res.status(200).json(paginator)
})

usersRouter.post("/",
   usersPostMiddleware,
   async (req: RequestBody<UserInputModel>, res: ResponseBody<UserViewModel | APIErrorResult>) => {
      const newUser: UserInputModel = {
         login: req.body.login.toLowerCase(),
         password: req.body.password,
         email: req.body.email.toLowerCase(),
      }
      const user = await usersService.createUser(newUser)
      //@ts-ignore
      if (user.login) return res.status(201).json(user)
      return res.status(400).json(user)
   })

usersRouter.delete("/:id",
   usersDeleteMiddleware,
   async (req: RequestURI<UsersURIParams>, res: Response) => {
      const deleteResult: boolean = await usersService.deleteUser(req.params.id)
      if (deleteResult)
         res.sendStatus(204)
      else res.sendStatus(404)
   })