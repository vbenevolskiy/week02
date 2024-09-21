import {body, validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express";

export const blogNameValidator = body("name")
    .trim()
    .isEmpty()
    .withMessage("Blog name cannot be empty.")
    .isLength({min: 1, max: 15})
    .withMessage("Length of the blog name must be between 1 and 15 characters.")

export const blogDescriptionValidator = body("description")
    .trim()
    .isEmpty()
    .withMessage("Blog description cannot be empty.")
    .isLength({min: 1, max: 500})
    .withMessage("Length of the blog description must be between 1 and 500 characters.")

export const blogWebsiteURLValidator = body("websiteUrl")
    .trim()
    .isEmpty()
    .withMessage("Website URL cannot be empty.")
    .isLength({min: 1, max: 100})
    .withMessage("Length of the website URL must be between 1 and 100 characters.")
    .isURL()
    .withMessage("Incorrect URL provided.")
