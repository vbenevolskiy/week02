import {Collection, ObjectId} from "mongodb";
import {BlogDBModel, BlogViewModel} from "../blogs-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {blogDBToBlogViewMapper} from "../blogs-mappers";

type BlogsRepo = {
   blogs: Collection<BlogDBModel>
   isValidBlogId: (id: ObjectId) => Promise<boolean>
   getBlogById: (id: ObjectId) => Promise<BlogViewModel | null>
   getBlogNameById: (id: ObjectId) => Promise<string>
   createBlog: (blog: BlogDBModel) => Promise<ObjectId>
   updateBlog(id: ObjectId, blog: Partial<BlogDBModel>): Promise<boolean>
   deleteBlog(id: ObjectId): Promise<boolean>
}

export const blogsRepo: BlogsRepo = {
   blogs: dbClient.db(dbName).collection<BlogDBModel>(SETTINGS.COLLECTIONS.BLOGS),

   isValidBlogId: async(id: ObjectId): Promise<boolean> => {
      const dbResult: BlogDBModel | null = await blogsRepo.blogs.findOne({_id:id});
      return !!dbResult
   },

   getBlogById: async (id: ObjectId):Promise<BlogViewModel | null> => {
      const dbResult = await blogsRepo.blogs.findOne({_id: id})
      return dbResult ? blogDBToBlogViewMapper(dbResult) : null
   },

   getBlogNameById: async (id: ObjectId):Promise<string> => {
      const dbResult = await blogsRepo.blogs.findOne({_id: id})
      return dbResult ? dbResult.name : ""
   },

   createBlog: async (blog: BlogDBModel):Promise<ObjectId> => {
      const insertResult = await blogsRepo.blogs.insertOne(blog)
      return insertResult.insertedId
   },

   updateBlog: async (id: ObjectId, blog: Partial<BlogDBModel>):Promise<boolean> => {
      const dbResult = await blogsRepo.blogs.updateOne({_id: id}, {$set: blog})
      return dbResult.matchedCount === 1
   },

   deleteBlog: async (id: ObjectId): Promise<boolean> => {
      const dbResult = await blogsRepo.blogs.deleteOne({_id: id})
      return dbResult.deletedCount === 1
   }
}