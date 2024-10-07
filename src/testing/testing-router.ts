import {Request, Response, Router} from "express";
import {blogsRepo} from "../blogs/blogs-repositories/blogs-repo";
import {postsRepo} from "../posts/posts-repositories/posts-repo";
import {usersRepo} from "../users/users-repositories/users-repo";

export const testingRouter = Router({})

testingRouter.delete("/", async (req: Request, res:Response )=>{
    await blogsRepo.blogs.deleteMany({})
    await postsRepo.posts.deleteMany({})
    await usersRepo.users.deleteMany({})
    res.sendStatus(204)
})