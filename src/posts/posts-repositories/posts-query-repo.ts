import {Collection, Sort, ObjectId} from "mongodb";
import {PostDBModel, PostsQueryInputModel, PostViewModel} from "../posts-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {postDBToPostViewMapper} from "../posts-mappers";

type PostsQueryRepo = {
   posts: Collection<PostDBModel>
   searchFilterFactory: (qOptions: PostsQueryInputModel) => Object
   sortFilterFactory: (qOptions: PostsQueryInputModel) => Sort
   isValidPostID: (id: ObjectId) => Promise<boolean>
   getTotalCount: (qOptions: PostsQueryInputModel) => Promise<number>
   getAllPosts: (qOptions: PostsQueryInputModel) => Promise<PostViewModel[]>
}

export const postsQueryRepo:PostsQueryRepo = {

   posts: dbClient.db(dbName).collection<PostDBModel>(SETTINGS.COLLECTIONS.POSTS),

   searchFilterFactory: (qOptions: PostsQueryInputModel): Object => {
      if (!qOptions.blogId) return {}
      return {blogId: new ObjectId(qOptions.blogId)}
},

   sortFilterFactory: (qOptions: PostsQueryInputModel): Sort => {
      return qOptions.sortDirection === 'desc' ? {[qOptions.sortBy]: -1} : {[qOptions.sortBy]: 1}
   },

   isValidPostID: async (id: ObjectId):Promise<boolean> => {
      const dbResult = await postsQueryRepo.posts.findOne({_id: id});
      console.log(dbResult)
      return !!dbResult
   },

   getTotalCount: (qOptions: PostsQueryInputModel): Promise<number> => {
      return postsQueryRepo
         .posts
         .countDocuments(postsQueryRepo.searchFilterFactory(qOptions))
   },

   getAllPosts: async (qOptions: PostsQueryInputModel): Promise<PostViewModel[]> => {
      const dbResult = await postsQueryRepo
         .posts
         .find(postsQueryRepo.searchFilterFactory(qOptions))
         .sort(postsQueryRepo.sortFilterFactory(qOptions))
         .skip((qOptions.pageNumber-1) * qOptions.pageSize)
         .limit(qOptions.pageSize)
         .toArray()
      return dbResult.map(value => postDBToPostViewMapper(value))
   }
}