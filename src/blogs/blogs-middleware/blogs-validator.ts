import {body, query} from "express-validator"

export const blogsQuerySortBy = query("sortBy")
   .customSanitizer(value => value ? value : 'createdAt')

export const blogsQuerySortDirection = query("sortDirection")
   .customSanitizer(value => value === 'asc' ? 'asc' : 'desc')

export const blogsQueryPageNumber = query("pageNumber")
   .customSanitizer(value => value ? Number(value) : 1)

export const blogsQueryPageSize = query("pageSize")
   .customSanitizer(value => value ? Number(value) : 10)

export const blogsQuerySearchNameTerm = query("searchNameTerm")
   .customSanitizer(value => value ? value : null)

export const blogNameValidator = body("name")
   .not().isEmpty()
   .withMessage('Name is required')
   .isString()
   .withMessage("Blog name must be a string")
   .trim()
   .isLength({min: 1, max: 15})
   .withMessage("Length of the blog name must be between 1 and 15 characters")

export const blogDescriptionValidator = body("description")
   .not().isEmpty()
   .withMessage("Description is required")
   .isString()
   .withMessage("Blog description must be a string")
   .trim()
   .isLength({min: 1, max: 500})
   .withMessage("Length of the blog description must be between 1 and 500 characters")

export const blogWebsiteURLValidator = body("websiteUrl")
   .not().isEmpty()
   .withMessage("WebsiteURL is required")
   .isString()
   .withMessage("WebsiteURL must be a string")
   .trim()
   .isLength({min: 1, max: 100})
   .withMessage("Length of the website URL must be between 1 and 100 characters")
   .isURL()
   .withMessage("Incorrect URL provided")
