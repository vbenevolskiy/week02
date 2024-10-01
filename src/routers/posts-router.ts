import {Request, Response, Router} from 'express'
import {
    APIErrorResult,
    PostInputModel,
    PostsQueryModel,
    PostViewModel,
    RequestBody,
    RequestURI,
    RequestURIBody,
    ResponseBody
} from "../types"

import {postsService} from "../services/posts-service";

import {postsDeleteMiddleware, postsPostMiddleware, postsPutMiddleware} from "../middleware/posts-middleware";

export const postsRouter = Router()

postsRouter.get('/',
    async (req: Request, res: ResponseBody<PostViewModel[]>) => {
        const result = await postsService.getAllPosts()
        res.status(200).json(result)
    })
postsRouter.post('/',
    postsPostMiddleware,
    async (req: RequestBody<PostInputModel>, res:ResponseBody<PostViewModel | APIErrorResult>) => {
        const result = await postsService.createPost(req)
        return res.status(201).json(result)
    })
postsRouter.get('/:id',
    async (req: RequestURI<PostsQueryModel>, res: ResponseBody<PostViewModel>) => {
        const result = await postsService.getPostById(req.params.id)
        if (result) res.status(200).json(result)
        else res.sendStatus(404)
    })
postsRouter.put('/:id',
    postsPutMiddleware,
    async (req:RequestURIBody<PostsQueryModel, PostInputModel>, res: ResponseBody<never | APIErrorResult>) => {
        const updateResult: boolean = await postsService.updatePost(req.params.id, req)
        if (updateResult) {
            res.sendStatus(204)
        }
        else res.sendStatus(404)
    })
postsRouter.delete('/:id',
    postsDeleteMiddleware,
    async (req:RequestURI<PostsQueryModel>, res:Response)=>{
        const deleteResult: boolean = await postsService.deletePost(req.params.id)
        if (deleteResult)
            res.sendStatus(204)
        else res.sendStatus(404)
    })