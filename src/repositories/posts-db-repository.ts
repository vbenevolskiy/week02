import {PostInputModel, PostViewModel, RequestBody} from "../types"
import {dbClient, dbName} from "./db"
import {Collection} from 'mongodb'
import {blogsRepository} from "./blogs-db-repository"

export type PostsRepository = {
    posts: Collection<PostViewModel>,
    getAllPosts: () => Promise<PostViewModel[]>,
    getPostById: (id: string) => Promise<PostViewModel | null>,
    createPost: (req: RequestBody<PostInputModel>) => Promise<PostViewModel>,
    updatePost: (id: string, req: RequestBody<PostInputModel>) => Promise<boolean>,
    deletePost: (id: string) => Promise<boolean>
}


export const postsRepository:PostsRepository = {
    posts: dbClient.db(dbName).collection<PostViewModel>("posts"),

    getAllPosts: async (): Promise<PostViewModel[]> => {
        return postsRepository.posts.find({}).toArray()
    },

    getPostById: async (id: string): Promise<PostViewModel | null> => {
        return await postsRepository.posts.findOne({id: id})
    },

    createPost: async (req: RequestBody<PostInputModel>): Promise<PostViewModel> => {
        const now = new Date()
        const min = Math.ceil(12);
        const max = Math.floor(97);
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        const newPost: PostViewModel = {
            id: Number(now).toString()+rand.toString(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: await blogsRepository.getBlogNameById(req.body.blogId),
            createdAt: now.toISOString(),
        }
        await postsRepository.posts.insertOne(newPost)
        return newPost
    },

    updatePost: async (id: string, req: RequestBody<PostInputModel>): Promise<boolean> => {
        const newValues = {
                $set: {title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    blogId: req.body.blogId,
                    blogName: await blogsRepository.getBlogNameById(req.body.blogId)
            }
        }
        const dbResult = await postsRepository.posts.updateOne({id: id}, newValues)
        return dbResult.matchedCount === 1
    },

    deletePost: async (id: string): Promise<boolean> => {
        const dbResult = await postsRepository.posts.deleteOne({id: id})
        return dbResult.deletedCount === 1
    }
}
