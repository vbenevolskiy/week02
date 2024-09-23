import {body, validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express";
import {blogsRepository} from "../repositories/blogs-repository";

export const postTitleValidator = body("title")
    .trim()
    .isString()
    .withMessage("Post title cannot be empty.")
    .isLength({min: 1, max: 30})
    .withMessage("Length of the post title must be between 1 and 30 characters.")

export const postShortDescriptionValidator = body("shortDescription")
    .trim()
    .isString()
    .withMessage("Post short description cannot be empty.")
    .isLength({min: 1, max: 100})
    .withMessage("Length of the short description must be between 1 and 100 characters.")

export const postContentValidator = body("content")
    .trim()
    .isString()
    .withMessage("Post content cannot be empty.")
    .isLength({min: 1, max: 1000})
    .withMessage("Length of the content must be between 1 and 1000 characters.")

export const postBlogIDValidator = body("blogId")
    .trim()
    .isString()
    .withMessage("BlogID cannot be empty.")
    .custom(async value => {
        const id = Number(value)
        const result = await blogsRepository.isValidBlogId(id)
        if (!result) throw new Error("Blog ID is invalid.")
    })
