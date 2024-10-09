import {dbClient, dbName} from "../../db";
import {Collection, ObjectId, Sort} from "mongodb";
import {CommentDBModel, CommentsQueryInputModel, CommentViewModel} from "../comments-types";
import {SETTINGS} from "../../settings";
import {commentDBToCommentViewMapper} from "../comments-mapper";


type CommentsQueryRepo = {
   comments: Collection<CommentDBModel>;
   searchFilterFactory: (qOptions: CommentsQueryInputModel) => Object
   sortFilterFactory: (qOptions: CommentsQueryInputModel) => Sort
   getTotalCount: (qOptions: CommentsQueryInputModel) => Promise<number>
   getAllComments: (qOptions: CommentsQueryInputModel) => Promise<CommentViewModel[]>
}

export const commentsQueryRepo: CommentsQueryRepo = {

   comments: dbClient.db(dbName).collection<CommentDBModel>(SETTINGS.COLLECTIONS.COMMENTS),

   searchFilterFactory: (qOptions: CommentsQueryInputModel): Object => {
      if (!qOptions.postId) return {}
      return {postId: new ObjectId(qOptions.postId)}
   },

   sortFilterFactory: (qOptions: CommentsQueryInputModel): Sort => {
      return qOptions.sortDirection === 'desc' ? {[qOptions.sortBy]: -1} : {[qOptions.sortBy]: 1}
   },

   getTotalCount: async (qOptions: CommentsQueryInputModel): Promise<number> => {
      return await commentsQueryRepo
         .comments
         .countDocuments(commentsQueryRepo.searchFilterFactory(qOptions))
   },

   getAllComments: async (qOptions: CommentsQueryInputModel): Promise<CommentViewModel[]> => {
      const dbResult = await commentsQueryRepo
         .comments
         .find(commentsQueryRepo.searchFilterFactory(qOptions))
         .sort(commentsQueryRepo.sortFilterFactory(qOptions))
         .skip((qOptions.pageNumber-1) * qOptions.pageSize)
         .limit(qOptions.pageSize)
         .toArray()
      return dbResult.map(value => commentDBToCommentViewMapper(value))
   }
}