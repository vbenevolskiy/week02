import {authBearerMiddleware} from "../../common-middleware/auth";
import {
   commentsContentValidator,
   commentsQueryPageNumber,
   commentsQueryPageSize,
   commentsQuerySortBy, commentsQuerySortDirection
} from "./comments-validator";
import {checkValidationResults} from "../../common-middleware/validation-results";

export const commentsDeleteMiddleware = [
   authBearerMiddleware
]

export const commentsPutMiddleware = [
   authBearerMiddleware,
   commentsContentValidator,
   checkValidationResults
]

export const commentsPostMiddleware = [
   authBearerMiddleware,
   commentsContentValidator,
   checkValidationResults
]

export const commentsGetMiddleware = [
   commentsQueryPageNumber,
   commentsQueryPageSize,
   commentsQuerySortBy,
   commentsQuerySortDirection
]