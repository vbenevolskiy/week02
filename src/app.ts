import express, {Response} from "express"
import {blogsRouter} from "./blogs/blogs-router"
import {postsRouter} from "./posts/posts-router"
import {testingRouter} from "./testing/testing-router";
import {SETTINGS} from "./settings"
import {usersRouter} from "./users/users-router";
import {authRouter} from "./auth/auth-router";
import {commentsRouter} from "./comments/comments-router";

export const app = express()
app.use(express.json())

app.get("/",(req, res:Response) => {
   res.status(200).send("APP week 6")
})
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)