import {Response, Router} from 'express'
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
import {commentsGetMiddleware, commentsPostMiddleware} from "../comments/comments-middleware/comments-middleware";
import {
   CommentContext,
   CommentInputModel, CommentPostURIModel,
   CommentsPaginator,
   CommentsQueryInputModel,
   CommentViewModel
} from "../comments/comments-types";
import {ObjectId} from "mongodb";
import {commentsQueryRepo} from "../comments/comments-repositories/comments-query-repo";
import {commentsService} from "../comments/comments-service";

export const postsRouter = Router()

postsRouter.get('/',
   postsGetMiddleware,
   async (req: RequestURIQuery<PostsURIModel, PostsQueryInputModel>, res: ResponseBody<PostsPaginator>) => {
      const qOptions: PostsQueryInputModel = {
         sortBy: req.query.sortBy!,
         sortDirection: req.query.sortDirection!,
         pageNumber: req.query.pageNumber!,
         pageSize: req.query.pageSize!,
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

postsRouter.get('/:postId/comments',
   commentsGetMiddleware,
   async (req: RequestURIQuery<CommentPostURIModel, Partial<CommentsQueryInputModel>>, res: ResponseBody<CommentsPaginator>)=>{
      const qOptions: CommentsQueryInputModel = {
         sortBy: req.query.sortBy!,
         sortDirection: req.query.sortDirection!,
         pageNumber: req.query.pageNumber!,
         pageSize: req.query.pageSize!,
         postId: req.params.postId!
      }
      if (!await postsQueryRepo.isValidPostID(new ObjectId(qOptions.postId!))) res.sendStatus(404)
      const totalCount = await commentsQueryRepo.getTotalCount(qOptions)
      const paginator: CommentsPaginator = {
         pagesCount: Math.ceil(totalCount / qOptions.pageSize),
         page: qOptions.pageNumber,
         pageSize: qOptions.pageSize,
         totalCount: totalCount,
         items: await commentsQueryRepo.getAllComments(qOptions)
      }
      res.status(200).json(paginator)
   })

postsRouter.post('/:postId/comments',
   commentsPostMiddleware,
   async (req: RequestURIBody<CommentPostURIModel, CommentInputModel>, res: ResponseBody<CommentViewModel>) => {
      const context: CommentContext = {
         userId: <string>req.headers.userId,
         postId: req.params.postId,
      }
      if (!await postsQueryRepo.isValidPostID(new ObjectId(context.postId))) return res.sendStatus(404)
      const comment: CommentInputModel = {
         content: req.body.content,
      }
      const postResult = await commentsService.createComment(comment, context)
      res.status(201).json(postResult)
   })