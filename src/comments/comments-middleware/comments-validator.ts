import {body, query} from "express-validator"

export const commentsQuerySortBy = query("sortBy")
   .customSanitizer(value => value ? value : 'createdAt')

export const commentsQuerySortDirection = query("sortDirection")
   .customSanitizer(value => value === 'asc' ? 'asc' : 'desc')

export const commentsQueryPageNumber = query("pageNumber")
   .customSanitizer(value => value ? Number(value) : 1)

export const commentsQueryPageSize = query("pageSize")
   .customSanitizer(value => value ? Number(value) : 10)

export const commentsContentValidator = body("content")
   .not().isEmpty()
   .withMessage('Content is required')
   .isString()
   .withMessage("Content must be a string")
   .trim()
   .isLength({min: 20, max: 300})
   .withMessage("Length of the comment must be between 20 and 300 characters")