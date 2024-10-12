import {authBearerMiddleware} from "../../common-middleware/auth";
import {
   commentsContentValidator,
   commentsQueryPageNumber,
   commentsQueryPageSize,
   commentsQuerySortBy, commentsQuerySortDirection
} from "./comments-validator";

export const commentsDeleteMiddleware = [
   authBearerMiddleware
]

export const commentsPutMiddleware = [
   authBearerMiddleware,
   commentsContentValidator
]

export const commentsPostMiddleware = [
   authBearerMiddleware,
   commentsContentValidator
]

export const commentsGetMiddleware = [
   commentsQueryPageNumber,
   commentsQueryPageSize,
   commentsQuerySortBy,
   commentsQuerySortDirection
]