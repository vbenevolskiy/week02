import {CommentDBModel, CommentViewModel} from "./comments-types";

export const commentDBToCommentViewMapper = (record: CommentDBModel): CommentViewModel => {
   return {
      id: record._id.toString(),
      content: record.content,
      createdAt: record.createdAt,
      commentatorInfo: {
         userId: record.commentatorInfo.userId.toString(),
         userLogin: record.commentatorInfo.userLogin
      },
   }
}