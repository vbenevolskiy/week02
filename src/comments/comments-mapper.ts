import {CommentDBModel, CommentViewModel} from "./comments-types";

export const commentDBToCommentViewMapper = (record: CommentDBModel): CommentViewModel => {
   const result: CommentViewModel = {
      id: record._id.toString(),
      content: record.content,
      createdAt: record.createdAt,
      commentatorInfo: {
         userId: record.commentatorInfo.userId.toString(),
         userLogin: record.commentatorInfo.userLogin
      },
   }
   console.log('------------- MAPPER -------------')
   console.log(result)
   return result
}