import {Request, Response, Router} from 'express'
import {APIErrorResult} from "../common-types/errors-types";
import {RequestBody, RequestURI, RequestURIBody, RequestURIQuery, ResponseBody} from "../common-types/request-types";
import {PostViewModel, PostInputModel, PostsPaginator, PostsQueryInputModel, PostsURIModel} from "./posts-types";
import {postsService} from "./posts-service";
import {
   postsDeleteMiddleware,
   postsGetMiddleware,
   postsPostMiddleware,
   postsPutMiddleware
} from "./posts-middleware/posts-middleware";
import {postsQueryRepo} from "./posts-repositories/posts-query-repo";

export const postsRouter = Router()

postsRouter.get('/',
   postsGetMiddleware,
   async (req: RequestURIQuery<PostsURIModel, PostsQueryInputModel>, res: ResponseBody<PostsPaginator>) => {
      const qOptions: PostsQueryInputModel = {
         //@ts-ignore
         sortBy: req.query.sortBy,
         //@ts-ignore
         sortDirection: req.query.sortDirection,
         //@ts-ignore
         pageNumber: req.query.pageNumber,
         //@ts-ignore
         pageSize: req.query.pageSize,
         blogId: null
      }
      const totalCount = await postsQueryRepo.getTotalCount(qOptions)
      const paginator: PostsPaginator = {
         pagesCount: Math.ceil(totalCount / qOptions.pageSize),
         page: qOptions.pageNumber,
         pageSize: qOptions.pageSize,
         totalCount: totalCount,
         items: await postsQueryRepo.getAllPosts(qOptions)
      }
      res.status(200).json(paginator)
   })

postsRouter.post('/',
   postsPostMiddleware,
   async (req: RequestBody<PostInputModel>, res:ResponseBody<PostViewModel | APIErrorResult>) => {
      const newPost: PostInputModel = {
         title: req.body.title,
         shortDescription: req.body.shortDescription,
         content: req.body.content,
         blogId: req.body.blogId
      }
      const result = await postsService.createPost(newPost)
      return res.status(201).json(result)
   })

postsRouter.get('/:id',
   async (req: RequestURI<PostsURIModel>, res: ResponseBody<PostViewModel>) => {
      const result = await postsService.getPostById(req.params.id)
      if (result) res.status(200).json(result)
      else res.sendStatus(404)
   })

postsRouter.put('/:id',
   postsPutMiddleware,
   async (req:RequestURIBody<PostsURIModel, PostInputModel>, res: ResponseBody<never | APIErrorResult>) => {
      const newValues = {
         title: req.body.title,
         shortDescription: req.body.shortDescription,
         content: req.body.content,
         blogId: req.body.blogId
      }
      const updateResult: boolean = await postsService.updatePost(req.params.id, newValues)
      if (updateResult) {
         res.sendStatus(204)
      }
      else res.sendStatus(404)
   })

postsRouter.delete('/:id',
   postsDeleteMiddleware,
   async (req:RequestURI<PostsURIModel>, res:Response)=>{
      const deleteResult: boolean = await postsService.deletePost(req.params.id)
      if (deleteResult)
         res.sendStatus(204)
      else res.sendStatus(404)
   })