import {CommentContext, CommentDBModel, CommentInputModel, CommentViewModel} from "./comments-types";
import {commentsRepo} from "./comments-repositories/comments-repo";
import {ObjectId} from "mongodb";
import {usersService} from "../users/users-service";

type CommentsService = {
   getCommentById: (id: string) => Promise<CommentViewModel | null>
   createComment: (comment: CommentInputModel, context: CommentContext) => Promise<CommentViewModel>
   updateComment: (id: string, comment: CommentInputModel) => Promise<boolean>
   deleteComment: (id: string) => Promise<boolean>
}

export const commentsService: CommentsService = {

   getCommentById: async (id: string): Promise<CommentViewModel | null> => {
      return await commentsRepo.getCommentById(new ObjectId(id))
   },

   createComment: async (comment: CommentInputModel, context: CommentContext): Promise<CommentViewModel> =>{
      const loginName = await usersService.getUserById(context.userId);
      const newComment: CommentDBModel = {
         _id: new ObjectId(),
         content: comment.content,
         createdAt: new Date().toISOString(),
         commentatorInfo: {
            userId: new ObjectId(context.userId),
            userLogin: loginName,
         },
         postId: new ObjectId(context.postId)
      }
      const newCommentId = await commentsRepo.createComment(newComment)
      //@ts-ignore
      return await commentsRepo.getCommentById(newCommentId)
   },

   updateComment: async (id: string, comment: CommentInputModel): Promise<boolean> => {
      const newValues: Partial<CommentDBModel> = {
         content: comment.content
      }
      return await commentsRepo.updateComment(new ObjectId(id), newValues)
   },

   deleteComment: async (id: string): Promise<boolean> => {
      return await commentsRepo.deleteComment(new ObjectId(id))
   }
}