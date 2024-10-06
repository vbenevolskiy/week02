import {body, param, query} from "express-validator"
import {blogsService} from "../../blogs/blogs-service";

export const postsQuerySortBy = query("sortBy")
   .customSanitizer(value => value ? value : 'createdAt')

export const postsQuerySortDirection = query("sortDirection")
   .customSanitizer(value => value === 'asc' ? 'asc' : 'desc')

export const postsQueryPageNumber = query("pageNumber")
   .customSanitizer(value => value ? Number(value) : 1)

export const postsQueryPageSize = query("pageSize")
   .customSanitizer(value => value ? Number(value) : 10)

export const postTitleValidator = body("title")
   .not().isEmpty()
   .withMessage("Title is required")
   .isString()
   .withMessage("Title must be a string")
   .trim()
   .isLength({min: 1, max: 30})
   .withMessage("Length of the post title must be between 1 and 30 characters")

export const postShortDescriptionValidator = body("shortDescription")
   .not().isEmpty()
   .withMessage("Short description is required")
   .isString()
   .withMessage("Short description must be a string")
   .trim()
   .isLength({min: 1, max: 100})
   .withMessage("Length of the short description must be between 1 and 100 characters")

export const postContentValidator = body("content")
   .not().isEmpty()
   .withMessage("Content is required")
   .isString()
   .withMessage("Content must be a string")
   .trim()
   .isLength({min: 1, max: 1000})
   .withMessage("Length of the content must be between 1 and 1000 characters")

export const postBlogIDValidator = body("blogId")
   .not().isEmpty()
   .withMessage("Blog ID is required")
   .isString()
   .withMessage("Blog ID must be a string")
   .trim()
   .custom(async value => {
      const result = await blogsService.isValidBlogId(value)
      if (!result) throw new Error("Blog ID is invalid")
   })

// export const postParamIdValidator = param("id")
//    .customSanitizer(value => {
//       if (value) body("blogId").replace(/.*/g, value)
//    })


