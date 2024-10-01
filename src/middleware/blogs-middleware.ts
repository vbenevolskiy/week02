import {authMiddleware} from "./auth";
import {blogDescriptionValidator, blogNameValidator, blogWebsiteURLValidator} from "./blogs-validator";
import {checkValidationResults} from "./validation-results";

export const blogsPostMiddleware = [
    authMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteURLValidator,
    checkValidationResults,
]

export const blogsPutMiddleware = [
    authMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteURLValidator,
    checkValidationResults,
]

export const blogsDeleteMiddleware = [
    authMiddleware,
]