import {Response, Router} from 'express'
import {
    PostViewModel,
    APIErrorResult,
    BlogInputModel,
    BlogsPaginator,
    BlogsQueryInputModel,
    BlogsURIModel,
    BlogViewModel,
    PostsURIModel,
    PostInputModel,
    RequestBody,
    RequestURI,
    RequestURIBody,
    RequestURIQuery,
    ResponseBody
} from "../types"
import {blogsService} from "../services/blogs-service";
import {blogsPostMiddleware, blogsPutMiddleware, blogsDeleteMiddleware} from "../middleware/blogs-middleware";
import {postsService} from "../services/posts-service";
import {postsPostMiddleware} from "../middleware/posts-middleware";

export const blogsRouter = Router({})

blogsRouter.get('/',
    async (req: RequestURIQuery<BlogsURIModel, BlogsQueryInputModel>, res: Response<BlogsPaginator>) => {
        const result = await blogsService.getAllBlogs(req)
        res.status(200).json(result)
    })

blogsRouter.get('/:id/posts',
    async (req: RequestURIQuery<BlogsURIModel, BlogsQueryInputModel>, res: Response<BlogsPaginator>) => {
    if (!req.params.id) {
        return res.sendStatus(404)
    }
    const validID = await blogsService.isValidBlogId(req.params.id)
    if (!validID) return res.sendStatus(404)
    const result = await blogsService.getAllBlogs(req)
    res.status(200).json(result)
})

blogsRouter.post('/',
    blogsPostMiddleware,
    async (req: RequestBody<BlogInputModel>, res: ResponseBody<BlogViewModel | APIErrorResult>) => {
        const result = await blogsService.createBlog(req)
        return res.status(201).json(result)
    })

blogsRouter.post('/:id/posts',
    postsPostMiddleware,
    async (req: RequestURIBody<PostsURIModel, PostInputModel>, res: ResponseBody<PostViewModel | APIErrorResult>) => {
        if (!req.params.id) {
            return res.sendStatus(404)
        }
        const validID = await blogsService.isValidBlogId(req.params.id)
        if (!validID) return res.sendStatus(404)
        const result = await postsService.createPostWithID(req)
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
        const updateResult: boolean = await blogsService.updateBlog(req.params.id, req)
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