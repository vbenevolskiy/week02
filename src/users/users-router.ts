import {Router, Response} from "express";
import {usersGetMiddleware, usersPostMiddleware, usersDeleteMiddleware} from "./users-middleware/users-middleware";
import {usersQueryRepo} from "./users-repositories/users-query-repo";
import {RequestBody, RequestQuery, RequestURI, ResponseBody} from "../common-types/request-types";
import {UserInputModel, UsersPaginator, UsersQueryInputModel, UsersURIParams, UserViewModel} from "./users-types";
import {PostInputModel} from "../posts/posts-types";
import {usersService} from "./users-service";
import {postsService} from "../posts/posts-service";
import {APIErrorResult} from "../common-types/errors-types";

export const usersRouter = Router();

usersRouter.get("/",
   usersGetMiddleware,
   async (req: RequestQuery<UsersQueryInputModel>, res: ResponseBody<UsersPaginator>) => {
      const qOptions: UsersQueryInputModel = {
         //@ts-ignore
         sortBy: req.query.sortBy,
        //@ts-ignore
         sortDirection: req.query.sortDirection,
        //@ts-ignore
         pageSize: req.query.pageSize,
        //@ts-ignore
         pageNumber: req.query.pageNumber,
        //@ts-ignore
         searchEmailTerm: req.query.searchEmailTerm,
        //@ts-ignore
         searchLoginTerm: req.query.searchLoginTerm
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
      return res.status(201).json(user)
   })

usersRouter.delete("/:id",
   usersDeleteMiddleware,
   async (req: RequestURI<UsersURIParams>, res: Response) => {
      const deleteResult: boolean = await usersService.deleteUser(req.params.id)
      if (deleteResult)
         res.sendStatus(204)
      else res.sendStatus(404)
   })