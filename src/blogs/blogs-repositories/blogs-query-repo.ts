import {Collection, Sort} from "mongodb";
import {BlogDBModel, BlogsQueryInputModel, BlogViewModel} from "../blogs-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {blogDBToBlogViewMapper} from "../blogs-mappers";

type BlogsQueryRepo = {
   blogs: Collection<BlogDBModel>
   searchFilterFactory: (qOptions: BlogsQueryInputModel) => Object
   sortFilterFactory: (qOptions: BlogsQueryInputModel) => Sort
   getTotalCount: (qOptions: BlogsQueryInputModel) => Promise<number>
   getAllBlogs: (qOptions: BlogsQueryInputModel) => Promise<BlogViewModel[]>
}

export const blogsQueryRepo:BlogsQueryRepo = {

   blogs: dbClient.db(dbName).collection<BlogDBModel>(SETTINGS.COLLECTIONS.BLOGS),

   searchFilterFactory: (qOptions: BlogsQueryInputModel): Object => {
      if (!qOptions.searchNameTerm) return {}
      return {name: {'$regex': qOptions.searchNameTerm, '$options': 'i'}}
   },

   sortFilterFactory: (qOptions: BlogsQueryInputModel): Sort => {
      return qOptions.sortDirection === 'desc' ? {[qOptions.sortBy]: -1} : {[qOptions.sortBy]: 1}
   },

   getTotalCount: async (qOptions: BlogsQueryInputModel): Promise<number> => {
      return blogsQueryRepo
         .blogs
         .countDocuments(blogsQueryRepo.searchFilterFactory(qOptions))
   },

   getAllBlogs: async (qOptions: BlogsQueryInputModel): Promise<BlogViewModel[]> => {
      const dbResult = await blogsQueryRepo
         .blogs
         .find(blogsQueryRepo.searchFilterFactory(qOptions))
         .sort(blogsQueryRepo.sortFilterFactory(qOptions))
         .skip((qOptions.pageNumber-1) * qOptions.pageSize)
         .limit(qOptions.pageSize)
         .toArray()
      return dbResult.map(value => blogDBToBlogViewMapper(value))
   }
}