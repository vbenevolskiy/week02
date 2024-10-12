import {ObjectId} from "mongodb";
import {Paginator} from "../common-types/paginator-type";

export type CommentURIModel = {
   id: string
}

export type CommentPostURIModel = {
   postId: string
}

export type CommentInputModel = {
   content: string
}

export type CommentatorInfoType = {
   userId: string
   userLogin: string
}

export type CommentViewModel = {
   id: string
   content: string
   createdAt: string
   commentatorInfo: CommentatorInfoType
}

export type CommentDBModel = {
   _id: ObjectId
   content: string
   createdAt: string
   commentatorInfo: {
      userId: ObjectId
      userLogin: string
   }
   postId: ObjectId
}

export type CommentsQueryInputModel = {
   sortBy: string
   sortDirection: 'asc' | 'desc'
   pageNumber: number
   pageSize: number
   postId: string | null
}

export type CommentsPaginator = Paginator & {
   items: CommentViewModel[]
}

export type CommentContext = {
   userId: string
   postId: string
}
