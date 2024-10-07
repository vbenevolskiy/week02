import express, {Request, Response} from "express"
import {blogsRouter} from "./blogs/blogs-router"
import {postsRouter} from "./posts/posts-router"
import {testingRouter} from "./testing/testing-router";
import {SETTINGS} from "./settings"
import {usersRouter} from "./users/users-router";

export const app = express()
app.use(express.json())

app.get("/",(req:Request, res:Response) => {
   res.status(200).send("APP v. 1.05")
})
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)