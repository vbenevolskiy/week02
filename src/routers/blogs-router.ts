import {Request, Response, Router} from 'express'
import {
    APIErrorResult,
    BlogInputModel,
    BlogsQueryModel,
    BlogViewModel,
    RequestBody,
    RequestURI,
    RequestURIBody,
    ResponseBody
} from "../types"
import {blogsService} from "../services/blogs-service";
import {blogsPostMiddleware, blogsPutMiddleware, blogsDeleteMiddleware} from "../middleware/blogs-middleware";

export const blogsRouter = Router({})

blogsRouter.get('/',
    async (req: Request, res: Response<BlogViewModel[]>) => {
        const result = await blogsService.getAllBlogs()
        res.status(200).json(result)
    })
blogsRouter.post('/',
    blogsPostMiddleware,
    async (req: RequestBody<BlogInputModel>, res: ResponseBody<BlogViewModel | APIErrorResult>) => {
        const result = await blogsService.createBlog(req)
        return res.status(201).json(result)
    })
blogsRouter.get('/:id',
    async (req: RequestURI<BlogsQueryModel>, res: ResponseBody<BlogViewModel>)=>{
        const result = await blogsService.getBlogById(req.params.id)
        if (result) res.status(200).json(result)
        else res.sendStatus(404)
    })
blogsRouter.put('/:id',
    blogsPutMiddleware,
    async (req: RequestURIBody<BlogsQueryModel,BlogInputModel>, res:ResponseBody<never | APIErrorResult>)=>{
        const updateResult: boolean = await blogsService.updateBlog(req.params.id, req)
        if (updateResult)
            res.sendStatus(204)
        else res.sendStatus(404)
    })
blogsRouter.delete('/:id',
    blogsDeleteMiddleware,
    async (req: RequestURI<BlogsQueryModel>, res:Response)=>{
        const deleteResult: boolean = await blogsService.deleteBlog(req.params.id)
        if (deleteResult)
            res.sendStatus(204)
        else res.sendStatus(404)
    })