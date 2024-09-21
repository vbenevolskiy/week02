import { Router } from 'express'
import {
    PostInputModel,
    PostViewModel,
    RequestBody,
    RequestURI,
    ResponseBody,
    RequestURIBody,
    PostsQueryModel, APIErrorResult
} from "../types"

import {
    postBlogIDValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../validators/posts-validator"

import {checkValidationResults} from "../validators/validation-results"

export const postsRouter = Router()

postsRouter.get('/',
    (res: ResponseBody<PostViewModel[]>) => {})
postsRouter.post('/',
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIDValidator,
    checkValidationResults,
    (req: RequestBody<PostInputModel>, res:ResponseBody<PostViewModel | APIErrorResult>) => {})
postsRouter.get('/:id',
    (req: RequestURI<PostsQueryModel>, res: ResponseBody<PostViewModel>) => {})
postsRouter.put('/:id',
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIDValidator,
    checkValidationResults,
    (req:RequestURIBody<PostsQueryModel, PostInputModel>, res: ResponseBody<never | APIErrorResult>) => {})
postsRouter.delete('/:id',
    (req:RequestURI<PostsQueryModel>)=>{})