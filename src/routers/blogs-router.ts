import { Router } from 'express'
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

export const blogsRouter = Router()

blogsRouter.get('/',
    (req, res: ResponseBody<BlogViewModel[]>) => {})
blogsRouter.post('/',
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteURLValidator,
    checkValidationResults,
    (req: RequestBody<BlogInputModel | APIErrorResult>, res: ResponseBody<BlogViewModel | APIErrorResult>) => {})
blogsRouter.get('/:id',
    (req: RequestURI<BlogsQueryModel>, res: ResponseBody<BlogViewModel>)=>{})
blogsRouter.put('/:id',
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteURLValidator,
    checkValidationResults,
    (req: RequestURIBody<BlogsQueryModel,BlogInputModel>, res:ResponseBody<never | APIErrorResult>)=>{})
blogsRouter.delete('/:id',
    (req: RequestURI<BlogsQueryModel>)=>{})