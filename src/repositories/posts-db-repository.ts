import {PostInputModel, PostViewModel, RequestBody} from "../types"
import {dbClient, dbName} from "./db"
import {Collection, ObjectId} from 'mongodb'
import {blogsRepository} from "./blogs-db-repository"

export type PostDBModel = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: ObjectId
    blogName: string
    createdAt: string
}

export type PostsRepository = {
    posts: Collection<PostDBModel>,
    getAllPosts: () => Promise<PostViewModel[]>,
    getPostById: (id: string) => Promise<PostViewModel | null>,
    createPost: (req: RequestBody<PostInputModel>) => Promise<PostViewModel>,
    updatePost: (id: string, req: RequestBody<PostInputModel>) => Promise<boolean>,
    deletePost: (id: string) => Promise<boolean>
}


export const postsRepository:PostsRepository = {
    posts: dbClient.db(dbName).collection<PostDBModel>("posts"),

    getAllPosts: async (): Promise<PostViewModel[]> => {
        const dbResult: PostDBModel[] = await postsRepository.posts.find({}).toArray()
        return dbResult.map(el =>{
            return {
                id: el._id.toString(),
                title: el.title,
                shortDescription: el.shortDescription,
                content: el.content,
                blogId: el.blogId.toString(),
                blogName: el.blogName,
                createdAt: el.createdAt
            }
        })
    },

    getPostById: async (id: string): Promise<PostViewModel | null> => {
        const dbResult = await postsRepository.posts.findOne({_id: new ObjectId(id)})
        if (dbResult) return {
            id: dbResult._id.toString(),
            title: dbResult.title,
            shortDescription: dbResult.shortDescription,
            content: dbResult.content,
            blogId: dbResult.blogId.toString(),
            blogName: dbResult.blogName,
            createdAt: dbResult.createdAt
        }
        return null
    },

    createPost: async (req: RequestBody<PostInputModel>): Promise<PostViewModel> => {
        const newPost: PostDBModel = {
            _id: new ObjectId(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: new ObjectId(req.body.blogId),
            blogName: await blogsRepository.getBlogNameById(req.body.blogId),
            createdAt: (new Date()).toISOString()
        }
        const insertResult = await postsRepository.posts.insertOne(newPost)
        const dbResult = await postsRepository.posts.findOne({_id: insertResult.insertedId})
        return {
            id: dbResult!._id.toString(),
            title: dbResult!.title,
            shortDescription: dbResult!.shortDescription,
            content: dbResult!.content,
            blogId: dbResult!.blogId.toString(),
            blogName: dbResult!.blogName,
            createdAt: dbResult!.createdAt
        }
    },

    updatePost: async (id: string, req: RequestBody<PostInputModel>): Promise<boolean> => {
        const newValues = {
                $set: {title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    blogId: new ObjectId(req.body.blogId),
                    blogName: await blogsRepository.getBlogNameById(req.body.blogId)
            }
        }
        const dbResult = await postsRepository.posts.updateOne({_id: new ObjectId(id)}, newValues)
        return dbResult.matchedCount === 1
    },

    deletePost: async (id: string): Promise<boolean> => {
        const dbResult = await postsRepository.posts.deleteOne({_id: new ObjectId(id)})
        return dbResult.deletedCount === 1
    }
}
