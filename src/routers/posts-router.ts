import { Router, Response } from 'express'
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
    async (res: ResponseBody<PostViewModel[]>) => {
        return await postsRepository.getAllPosts()
    })
postsRouter.post('/',
    authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIDValidator,
    checkValidationResults,
    async (req: RequestBody<PostInputModel>, res:ResponseBody<PostViewModel | APIErrorResult>) => {
        return res.status(200).json(await postsRepository.createPost(req))
    })
postsRouter.get('/:id',
    async (req: RequestURI<PostsQueryModel>, res: ResponseBody<PostViewModel>) => {
        return await postsRepository.getPostById(Number(req.params.id))
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