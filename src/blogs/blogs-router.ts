import {Response, Router} from 'express'
import {APIErrorResult} from "../common-types/errors-types";
import {BlogInputModel, BlogsPaginator, BlogsQueryInputModel, BlogsURIModel, BlogViewModel} from "./blogs-types";
import {PostViewModel, PostsURIModel, PostInputModel, PostsPaginator, PostsQueryInputModel} from "../posts/posts-types";
import {ResponseBody, RequestURIBody, RequestURIQuery, RequestURI, RequestBody} from "../common-types/request-types";
import {blogsService} from "./blogs-service";
import {
   blogsPostMiddleware,
   blogsPutMiddleware,
   blogsDeleteMiddleware,
   blogsGetMiddleware
} from "./blogs-middleware/blogs-middleware";
import {postsService} from "../posts/posts-service";
import {postsGetMiddleware, postsPostMiddlewareWithoutBlogID} from "../posts/posts-middleware/posts-middleware";
import {blogsQueryRepo} from "./blogs-repositories/blogs-query-repo";
import {postsQueryRepo} from "../posts/posts-repositories/posts-query-repo";
import {ObjectId} from "mongodb";

export const blogsRouter = Router({})

blogsRouter.get('/',
   blogsGetMiddleware,

   async (req: RequestURIQuery<BlogsURIModel, BlogsQueryInputModel>, res: Response<BlogsPaginator>) => {
   const qOptions: BlogsQueryInputModel = {
      //@ts-ignore
      sortBy: req.query.sortBy,
      //@ts-ignore
      sortDirection: req.query.sortDirection,
      //@ts-ignore
      pageNumber: req.query.pageNumber,
      //@ts-ignore
      pageSize: req.query.pageSize,
      //@ts-ignore
      searchNameTerm: req.query.searchNameTerm
   }
   const totalCount = await blogsQueryRepo.getTotalCount(qOptions)
   const paginator: BlogsPaginator = {
      pagesCount: Math.ceil(totalCount / qOptions.pageSize),
      page: qOptions.pageNumber,
      pageSize: qOptions.pageSize,
      totalCount: totalCount,
      items: await blogsQueryRepo.getAllBlogs(qOptions)
   }
   res.status(200).json(paginator)
   })

blogsRouter.get('/:id/posts',
   postsGetMiddleware,
   async (req: RequestURIQuery<PostsURIModel, PostsQueryInputModel>, res: Response<PostsPaginator>) => {
      const qOptions: PostsQueryInputModel = {
         sortBy: req.query.sortBy!,
         sortDirection: req.query.sortDirection!,
         pageNumber: req.query.pageNumber!,
         pageSize: req.query.pageSize!,
         blogId: req.params.id!
      }
      if (!await blogsQueryRepo.isValidBlogID(new ObjectId(req.params.id))) return res.sendStatus(404)
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

blogsRouter.post('/',
   blogsPostMiddleware,
   async (req: RequestBody<BlogInputModel>, res: ResponseBody<BlogViewModel | APIErrorResult>) => {
   const newBlog: BlogInputModel = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl
   }
   const result = await blogsService.createBlog(newBlog)
   return res.status(201).json(result)
   })

blogsRouter.post('/:id/posts',
   postsPostMiddlewareWithoutBlogID,
   async (req: RequestURIBody<PostsURIModel, PostInputModel>, res: ResponseBody<PostViewModel | APIErrorResult>) => {
      req.body.blogId = req.params.id
      if (!await blogsService.isValidBlogId(req.params.id)) return res.sendStatus(404)
      const newPost: PostInputModel = {
         title: req.body.title,
         shortDescription: req.body.shortDescription,
         content: req.body.content,
         blogId: req.body.blogId
      }
      const result = await postsService.createPost(newPost)
      return res.status(201).json(result)
   } )

blogsRouter.get('/:id',
   async (req: RequestURI<BlogsURIModel>, res: ResponseBody<BlogViewModel>)=>{
      const result = await blogsService.getBlogById(req.params.id)
      if (result) res.status(200).json(result)
      else res.sendStatus(404)
   })

blogsRouter.put('/:id',
   blogsPutMiddleware,
   async (req: RequestURIBody<BlogsURIModel,BlogInputModel>, res:ResponseBody<never | APIErrorResult>)=>{
      const newBlog: BlogInputModel = {
         name: req.body.name,
         description: req.body.description,
         websiteUrl: req.body.websiteUrl
      }
      const updateResult: boolean = await blogsService.updateBlog(req.params.id, newBlog)
      if (updateResult)
         res.sendStatus(204)
      else res.sendStatus(404)
   })

blogsRouter.delete('/:id',
   blogsDeleteMiddleware,
   async (req: RequestURI<BlogsURIModel>, res:Response)=>{
      const deleteResult: boolean = await blogsService.deleteBlog(req.params.id)
      if (deleteResult)
         res.sendStatus(204)
      else res.sendStatus(404)
   })