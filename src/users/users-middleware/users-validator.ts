import {body, query} from "express-validator"

export const usersQuerySortBy = query("sortBy")
   .customSanitizer(value => value ? value : 'createdAt')

export const usersQuerySortDirection = query("sortDirection")
   .customSanitizer(value => value === 'asc' ? 'asc' : 'desc')

export const usersQueryPageNumber = query("pageNumber")
   .customSanitizer(value => value ? Number(value) : 1)

export const usersQueryPageSize = query("pageSize")
   .customSanitizer(value => value ? Number(value) : 10)

export const usersQuerySearchNameTerm = query("searchNameTerm")
   .customSanitizer(value => value ? value : null)

export const usersQuerySearchEmailTerm = query("searchEmailTerm")
   .customSanitizer(value => value ? value : null)

// export const usersParamIdValidator = param("id")
//    .customSanitizer(value => new ObjectId(value))

export const usersLoginValidator = body("login")
   .not().isEmpty()
   .withMessage('Login is required')
   .isString()
   .withMessage("Login must be a string")
   .trim()
   .isLength({min: 3, max: 10})
   .withMessage("Length of the login must be between 3 and 10 characters")
   .matches("^[a-zA-Z0-9_-]*$")
   .withMessage("Login could contain only upper- and lowercase letters, numbers, hyphen and underscore")

export const usersPasswordValidator = body("password")
   .not().isEmpty()
   .withMessage('Password is required')
   .isString()
   .withMessage("Password must be a string")
   .trim()
   .isLength({min: 6, max: 20})
   .withMessage("Length of the password must be between 6 and 20 characters")

export const usersEmailValidator = body("email")
   .not().isEmpty()
   .withMessage('Email address is required')
   .isString()
   .withMessage("Email must be a string")
   .trim()
   .isEmail()
   .withMessage("Incorrect email address provided")