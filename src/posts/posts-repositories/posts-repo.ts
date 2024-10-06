import {PostDBModel, PostViewModel} from "../posts-types"
import {dbClient, dbName} from "../../db"
import {Collection, ObjectId} from 'mongodb'
import {SETTINGS} from "../../settings";
import {postDBToPostViewMapper} from "../posts-mappers";

export type PostsRepo = {
    posts: Collection<PostDBModel>,
    getPostById: (id: ObjectId) => Promise<PostViewModel | null>,
    createPost: (post: PostDBModel) => Promise<ObjectId>,
    updatePost: (id: ObjectId, post: Partial<PostDBModel>) => Promise<boolean>,
    deletePost: (id: ObjectId) => Promise<boolean>
}

export const postsRepo:PostsRepo = {

    posts: dbClient.db(dbName).collection<PostDBModel>(SETTINGS.COLLECTIONS.POSTS),

    getPostById: async (id: ObjectId): Promise<PostViewModel | null> => {
        const dbResult = await postsRepo.posts.findOne({_id: id})
        return dbResult ? postDBToPostViewMapper(dbResult) : null
    },

    createPost: async (newPost: PostDBModel): Promise<ObjectId> => {
        const insertResult = await postsRepo.posts.insertOne(newPost)
        return insertResult.insertedId
    },

    updatePost: async (id: ObjectId, post: Partial<PostDBModel>): Promise<boolean> => {
        const dbResult = await postsRepo.posts.updateOne({_id: id}, {$set: post})
        return dbResult.modifiedCount === 1
    },

    deletePost: async (id: ObjectId): Promise<boolean> => {
        const dbResult = await postsRepo.posts.deleteOne({_id: id})
        return dbResult.deletedCount === 1
    }
}
