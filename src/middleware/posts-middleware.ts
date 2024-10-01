import {authMiddleware} from "./auth";
import {
    postBlogIDValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "./posts-validator";
import {checkValidationResults} from "./validation-results";

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
export const postsDeleteMiddleware = [
    authMiddleware,
]