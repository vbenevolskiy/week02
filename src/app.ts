import express, {Request, Response} from "express"
import {blogsRouter} from "./routers/blogs-router"
import {postsRouter} from "./routers/posts-router"
import {testingRouter} from "./routers/testing-router";
import {SETTINGS} from "./settings"

export const app = express()
app.use(express.json())

app.get("/",(req:Request, res:Response) => {
    res.status(200).send("APP v. 1.03")
})
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)