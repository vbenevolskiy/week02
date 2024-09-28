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
import {blogDescriptionValidator, blogNameValidator, blogWebsiteURLValidator} from "../validators/blogs-validator";
import {checkValidationResults} from "../validators/validation-results";
import {authMiddleware} from "../validators/auth"
import {blogsRepository} from "../repositories/blogs-db-repository";

export const blogsRouter = Router({})

blogsRouter.get('/',
    async (req: Request, res: Response<BlogViewModel[]>) => {
        const result = await blogsRepository.getAllBlogs()
        res.status(200).json(result)
    })
blogsRouter.post('/',
    authMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteURLValidator,
    checkValidationResults,
    async (req: RequestBody<BlogInputModel>, res: ResponseBody<BlogViewModel | APIErrorResult>) => {
        const result = await blogsRepository.createBlog(req)
        return res.status(201).json(result)
    })
blogsRouter.get('/:id',
    async (req: RequestURI<BlogsQueryModel>, res: ResponseBody<BlogViewModel>)=>{
        const result = await blogsRepository.getBlogById(Number(req.params.id))
        if (result) res.status(200).json(result)
        else res.sendStatus(404)
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