"use strict";
// import {dbClient, dbName} from "../../db";
// import {Collection, ObjectId} from 'mongodb'
// import {BlogDBModel, BlogsQueryOptions} from "../blogs-types";
// import {SETTINGS} from "../../settings";
//
// export type BlogsRepository = {
//     blogs: Collection<BlogDBModel>,
//     getTotalCount: (filter: Object) => Promise<number>,
//     isValidBlogId: (id: ObjectId) => Promise<boolean>,
//     getBlogNameById: (id: ObjectId) => Promise<string | null>,
//     getAllBlogs: (blogsQueryOptions: BlogsQueryOptions) => Promise<BlogDBModel[]>,
//     getBlogById: (id: ObjectId) => Promise<BlogDBModel | null>,
//     createBlog: (newBlog: BlogDBModel) => Promise<ObjectId>,
//     updateBlog: (id: ObjectId, blog: Partial<BlogDBModel>) => Promise<boolean>,
//     deleteBlog: (id: ObjectId) => Promise<boolean>
// }
//
// export const blogsRepository: BlogsRepository = {
//
//     blogs: dbClient.db(dbName).collection<BlogDBModel>(SETTINGS.COLLECTIONS.BLOGS),
//
//     getTotalCount: async (filter:Object): Promise<number> => {
//         return await blogsRepository.blogs.countDocuments(filter)
//     },
//
//     isValidBlogId: async (id: ObjectId): Promise<boolean> => {
//         const dbResult: BlogDBModel | null = await blogsRepository.blogs.findOne({_id:id})
//         return !!dbResult
//     },
//
//     getBlogNameById: async (id: ObjectId): Promise<string | null> => {
//         const dbResult = await blogsRepository.blogs.findOne({_id: id})
//         return dbResult ? dbResult.name : null
//     },
//
//     getAllBlogs: async (blogsQueryOptions: BlogsQueryOptions, mapper?: (arg: any) => any): Promise<BlogDBModel[]> => {
//         // const toSkip : number = (blogsQueryOptions.pageNumber-1) * blogsQueryOptions.pageSize
//         const result = blogsRepository
//             .blogs
//             .find(blogsQueryOptions.searchFilter)
//             .sort(blogsQueryOptions.sortFilter)
//             .skip((blogsQueryOptions.pageNumber-1) * blogsQueryOptions.pageSize)
//             .limit(blogsQueryOptions.pageSize)
//             .toArray()
//         return mapper?.(result) ?? result
//     },
//
//     getBlogById: async (id: ObjectId): Promise<BlogDBModel | null> => {
//         return blogsRepository.blogs.findOne({_id:id})
//     },
//
//     createBlog: async (newBlog: BlogDBModel): Promise<ObjectId> => {
//         const dbResult = await blogsRepository.blogs.insertOne(newBlog)
//         return dbResult.insertedId;
//     },
//
//     updateBlog: async (id: ObjectId, blog: Partial<BlogDBModel>): Promise<boolean> => {
//         const newValues = {$set: blog}
//         const dbResult = await blogsRepository.blogs.updateOne({_id: id},newValues)
//         return dbResult.matchedCount === 1
//     },
//
//     deleteBlog: async (id: ObjectId): Promise<boolean> => {
//         const dbResult = await blogsRepository.blogs.deleteOne({_id: id})
//         return dbResult.deletedCount === 1
//     }
// }
