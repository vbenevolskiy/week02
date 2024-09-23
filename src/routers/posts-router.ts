import { Router, Response, Request } from 'express'
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

import {postsRepository} from "../repositories/posts-repository";
import {authMiddleware} from "../validators/auth";

export const postsRouter = Router()

postsRouter.get('/',
    async (req: Request, res: ResponseBody<PostViewModel[]>) => {
        const result = await postsRepository.getAllPosts()
        res.status(200).json(result)
    })
postsRouter.post('/',
    authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIDValidator,
    checkValidationResults,
    async (req: RequestBody<PostInputModel>, res:ResponseBody<PostViewModel | APIErrorResult>) => {
        const result = await postsRepository.createPost(req)
        return res.status(200).json(result)
    })
postsRouter.get('/:id',
    async (req: RequestURI<PostsQueryModel>, res: ResponseBody<PostViewModel>) => {
        const result = await postsRepository.getPostById(Number(req.params.id))
        if (result) res.status(200).json(result)
        else res.sendStatus(404)
    })
postsRouter.put('/:id',
    authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIDValidator,
    checkValidationResults,
    async (req:RequestURIBody<PostsQueryModel, PostInputModel>, res: ResponseBody<never | APIErrorResult>) => {
        const updateResult: boolean = await postsRepository.updatePost(Number(req.params.id), req)
        if (updateResult) {
            res.sendStatus(204)
        }
        else res.sendStatus(404)
    })
postsRouter.delete('/:id',
    authMiddleware,
    async (req:RequestURI<PostsQueryModel>, res:Response)=>{
        const deleteResult: boolean = await postsRepository.deletePost(Number(req.params.id))
        if (deleteResult)
            res.sendStatus(204)
        else res.sendStatus(404)
    })