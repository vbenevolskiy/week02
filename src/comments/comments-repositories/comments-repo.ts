import {Collection, ObjectId} from "mongodb";
import {CommentDBModel, CommentViewModel} from "../comments-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {commentDBToCommentViewMapper} from "../comments-mapper";

type CommentsRepo = {
   comments: Collection<CommentDBModel>
   getCommentById: (id: ObjectId) => Promise<CommentViewModel | null>
   createComment: (comment: CommentDBModel) => Promise<ObjectId>
   updateComment: (id: ObjectId, comment: Partial<CommentDBModel>) => Promise<boolean>
   deleteComment: (id: ObjectId) => Promise<boolean>
}

export const commentsRepo: CommentsRepo = {

   comments: dbClient.db(dbName).collection<CommentDBModel>(SETTINGS.COLLECTIONS.COMMENTS),

   getCommentById: async (id: ObjectId): Promise<CommentViewModel | null> => {
      const dbResult = await commentsRepo.comments.findOne({_id:id})
      return dbResult ? commentDBToCommentViewMapper(dbResult) : null
   },

   createComment: async (comment: CommentDBModel): Promise<ObjectId> => {
      const insertResult = await commentsRepo.comments.insertOne(comment)
      return insertResult.insertedId
   },

   updateComment: async (id: ObjectId, comment: Partial<CommentDBModel>): Promise<boolean> => {
      const dbResult = await commentsRepo.comments.updateOne({_id:id}, {$set: comment})
      return dbResult.matchedCount === 1
   },

   deleteComment: async (id: ObjectId): Promise<boolean> => {
      const dbResult = await commentsRepo.comments.deleteOne({_id:id})
      return dbResult.deletedCount === 1
   }
}