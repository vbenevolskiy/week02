import {body, validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express";

export const postTitleValidator = body("title")
    .trim()
    .isEmpty()
    .withMessage("Post title cannot be empty.")
    .isLength({min: 1, max: 30})
    .withMessage("Length of the post title must be between 1 and 30 characters.")

export const postShortDescriptionValidator = body("shortDescription")
    .trim()
    .isEmpty()
    .withMessage("Post short description cannot be empty.")
    .isLength({min: 1, max: 100})
    .withMessage("Length of the short description must be between 1 and 100 characters.")

export const postContentValidator = body("content")
    .trim()
    .isEmpty()
    .withMessage("Post content cannot be empty.")
    .isLength({min: 1, max: 1000})
    .withMessage("Length of the content must be between 1 and 1000 characters.")

export const postBlogIDValidator = body("blogID")
    .trim()
    .isEmpty()
    .withMessage("Blog ID cannot be empty.")
