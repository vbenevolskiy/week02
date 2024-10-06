// import {PostDBModel, PostsQueryOptions} from "../posts-types"
// import {dbClient, dbName} from "../../db"
// import {Collection, ObjectId} from 'mongodb'
// import {SETTINGS} from "../../settings";
//
// export type PostsRepository = {
//     posts: Collection<PostDBModel>,
//     getTotalCount: (filter: Object) => Promise<number>,
//     getAllPosts: (postsQueryOptions: PostsQueryOptions) => Promise<PostDBModel[]>,
//     getPostById: (id: ObjectId) => Promise<PostDBModel | null>,
//     createPost: (newPost: PostDBModel) => Promise<ObjectId>,
//     updatePost: (id: ObjectId, post: Partial<PostDBModel>) => Promise<boolean>,
//     deletePost: (id: ObjectId) => Promise<boolean>
// }
//
// export const postsRepository:PostsRepository = {
//
//     posts: dbClient.db(dbName).collection<PostDBModel>(SETTINGS.COLLECTIONS.POSTS),
//
//     getTotalCount: async (filter: Object): Promise<number> => {
//         return await postsRepository.posts.countDocuments(filter)
//     },
//
//     getAllPosts: async (postsQueryOptions): Promise<PostDBModel[]> => {
//         console.log(postsQueryOptions)
//         return postsRepository
//             .posts
//             .find(postsQueryOptions.searchFilter)
//             .sort(postsQueryOptions.sortFilter)
//             .skip((postsQueryOptions.pageNumber-1) * postsQueryOptions.pageSize)
//             .limit(postsQueryOptions.pageSize)
//             .toArray()
//     },
//
//     getPostById: async (id: ObjectId): Promise<PostDBModel | null> => {
//         return postsRepository.posts.findOne({_id: id})
//     },
//
//     createPost: async (newPost: PostDBModel): Promise<ObjectId> => {
//         const insertResult = await postsRepository.posts.insertOne(newPost)
//         return insertResult.insertedId
//     },
//
//     updatePost: async (id: ObjectId, post: Partial<PostDBModel>): Promise<boolean> => {
//         const dbResult = await postsRepository.posts.updateOne({_id: id}, {$set: post})
//         return dbResult.modifiedCount === 1
//     },
//
//     deletePost: async (id: ObjectId): Promise<boolean> => {
//         const dbResult = await postsRepository.posts.deleteOne({_id: id})
//         return dbResult.deletedCount === 1
//     }
// }
