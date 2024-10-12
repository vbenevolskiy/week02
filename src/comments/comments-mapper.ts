import {CommentDBModel, CommentViewModel} from "./comments-types";

export const commentDBToCommentViewMapper = (record: CommentDBModel): CommentViewModel => {
   return {
      id: record._id.toString(),
      content: record.content,
      commentatorInfo: {
         userId: record.commentatorInfo.userId.toString(),
         userLogin: record.commentatorInfo.userLogin
      },
      createdAt: record.createdAt
   }
}