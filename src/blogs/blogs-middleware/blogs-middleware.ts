import {authMiddleware} from "../../common-middleware/auth";
import {
    blogDescriptionValidator,
    blogNameValidator, blogsQueryPageNumber,
    blogsQueryPageSize, blogsQuerySearchNameTerm, blogsQuerySortBy, blogsQuerySortDirection,
    blogWebsiteURLValidator
} from "./blogs-validator";
import {checkValidationResults} from "../../common-middleware/validation-results";
import express from "express";

export const blogsGetMiddleware = [
    blogsQueryPageSize,
    blogsQueryPageNumber,
    blogsQuerySortBy,
    blogsQuerySortDirection,
    blogsQuerySearchNameTerm
]

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