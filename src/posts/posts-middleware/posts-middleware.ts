import {authMiddleware} from "../../common-middleware/auth";
import {
    postBlogIDValidator,
    postContentValidator,
    postShortDescriptionValidator, postsQueryPageNumber, postsQueryPageSize, postsQuerySortBy, postsQuerySortDirection,
    postTitleValidator
} from "./posts-validator";
import {checkValidationResults} from "../../common-middleware/validation-results";

export const postsGetMiddleware = [
    postsQueryPageNumber,
    postsQueryPageSize,
    postsQuerySortBy,
    postsQuerySortDirection
]

export const postsPostMiddleware = [
    authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIDValidator,
    checkValidationResults,
]
export const postsPutMiddleware = [
    authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIDValidator,
    checkValidationResults,
]
export const postsPostMiddlewareWithoutBlogID = [
    authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    checkValidationResults,
]
export const postsDeleteMiddleware = [
    authMiddleware,
]