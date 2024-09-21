import express from "express"
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";

export const app = express();
app.use(express.json());
app.use('/ht_02/api/blogs', blogsRouter)
app.use('/ht_02/api/posts', postsRouter)