import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";

export const testingRouter = Router({})

testingRouter.delete("/", async (req: Request, res:Response )=>{
    await blogsRepository.blogs.deleteMany({})
    await postsRepository.posts.deleteMany({})
    res.sendStatus(204)
})