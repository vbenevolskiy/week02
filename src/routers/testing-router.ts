import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";

export const testingRouter = Router({})

testingRouter.delete("/", (req: Request, res:Response )=>{
    blogsRepository.blogs = []
    postsRepository.posts = []
    res.sendStatus(204)
})