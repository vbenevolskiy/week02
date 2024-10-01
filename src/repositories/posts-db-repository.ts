import {PostDBModel} from "../types"
import {dbClient, dbName} from "./db"
import {Collection, ObjectId} from 'mongodb'
import {SETTINGS} from "../settings";

export type PostsRepository = {
    posts: Collection<PostDBModel>,
    getAllPosts: () => Promise<PostDBModel[]>,
    getPostById: (id: ObjectId) => Promise<PostDBModel | null>,
    createPost: (newPost: PostDBModel) => Promise<ObjectId>,
    updatePost: (id: ObjectId, post: Partial<PostDBModel>) => Promise<boolean>,
    deletePost: (id: ObjectId) => Promise<boolean>
}

export const postsRepository:PostsRepository = {
    posts: dbClient.db(dbName).collection<PostDBModel>(SETTINGS.COLLECTIONS.POSTS),

    getAllPosts: async (): Promise<PostDBModel[]> => {
        return postsRepository.posts.find({}).toArray()
    },

    getPostById: async (id: ObjectId): Promise<PostDBModel | null> => {
        return postsRepository.posts.findOne({_id: id})
    },

    createPost: async (newPost: PostDBModel): Promise<ObjectId> => {
        const insertResult = await postsRepository.posts.insertOne(newPost)
        return await insertResult.insertedId
    },

    updatePost: async (id: ObjectId, post: Partial<PostDBModel>): Promise<boolean> => {
        const newValues = {$set: {post}}
        const dbResult = await postsRepository.posts.updateOne({_id: id}, newValues)
        return dbResult.matchedCount === 1
    },

    deletePost: async (id: ObjectId): Promise<boolean> => {
        const dbResult = await postsRepository.posts.deleteOne({_id: id})
        return dbResult.deletedCount === 1
    }
}
