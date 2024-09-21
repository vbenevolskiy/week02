import { Response, Router } from 'express'
import {
    ResponseBody,
    BlogViewModel,
    RequestURIBody,
    RequestBody,
    BlogInputModel,
    APIErrorResult,
    RequestURI,
    BlogsQueryModel
} from "../types"
import {blogDescriptionValidator, blogNameValidator, blogWebsiteURLValidator} from "../validators/blogs-validator";
import {checkValidationResults} from "../validators/validation-results";
import {authMiddleware} from "../validators/auth"
import {blogsRepository} from "../repositories/blogs-repository";

export const blogsRouter = Router()

blogsRouter.get('/',
    async (res: ResponseBody<BlogViewModel[]>) => {
        return await blogsRepository.getAllBlogs()
    })
blogsRouter.post('/',
    authMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteURLValidator,
    checkValidationResults,
    async (req: RequestBody<BlogInputModel>, res: ResponseBody<BlogViewModel | APIErrorResult>) => {
        return res.status(200).json(await blogsRepository.createBlog(req))
    })
blogsRouter.get('/:id',
    async (req: RequestURI<BlogsQueryModel>, res: ResponseBody<BlogViewModel>)=>{
        return await blogsRepository.getBlogById(Number(req.params.id))
    })
blogsRouter.put('/:id',
    authMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteURLValidator,
    checkValidationResults,
    async (req: RequestURIBody<BlogsQueryModel,BlogInputModel>, res:ResponseBody<never | APIErrorResult>)=>{
        const updateResult: boolean = await blogsRepository.updateBlog(Number(req.params.id), req)
        if (updateResult)
            res.sendStatus(204)
        else res.sendStatus(404)
    })
blogsRouter.delete('/:id',
    authMiddleware,
    async (req: RequestURI<BlogsQueryModel>, res:Response)=>{
        const deleteResult: boolean = await blogsRepository.deleteBlog(Number(req.params.id))
        if (deleteResult)
            res.sendStatus(204)
        else res.sendStatus(404)
    })