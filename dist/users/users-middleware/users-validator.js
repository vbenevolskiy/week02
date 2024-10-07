"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersEmailValidator = exports.usersPasswordValidator = exports.usersLoginValidator = exports.usersQuerySearchEmailTerm = exports.usersQuerySearchNameTerm = exports.usersQueryPageSize = exports.usersQueryPageNumber = exports.usersQuerySortDirection = exports.usersQuerySortBy = void 0;
const express_validator_1 = require("express-validator");
exports.usersQuerySortBy = (0, express_validator_1.query)("sortBy")
    .customSanitizer(value => value ? value : 'createdAt');
exports.usersQuerySortDirection = (0, express_validator_1.query)("sortDirection")
    .customSanitizer(value => value === 'asc' ? 'asc' : 'desc');
exports.usersQueryPageNumber = (0, express_validator_1.query)("pageNumber")
    .customSanitizer(value => value ? Number(value) : 1);
exports.usersQueryPageSize = (0, express_validator_1.query)("pageSize")
    .customSanitizer(value => value ? Number(value) : 10);
exports.usersQuerySearchNameTerm = (0, express_validator_1.query)("searchNameTerm")
    .customSanitizer(value => value ? value : null);
exports.usersQuerySearchEmailTerm = (0, express_validator_1.query)("searchEmailTerm")
    .customSanitizer(value => value ? value : null);
// export const usersParamIdValidator = param("id")
//    .customSanitizer(value => new ObjectId(value))
exports.usersLoginValidator = (0, express_validator_1.body)("login")
    .not().isEmpty()
    .withMessage('Login is required')
    .isString()
    .withMessage("Login must be a string")
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("Length of the login must be between 3 and 10 characters")
    .matches("^[a-zA-Z0-9_-]*$")
    .withMessage("Login could contain only upper- and lowercase letters, numbers, hyphen and underscore");
exports.usersPasswordValidator = (0, express_validator_1.body)("password")
    .not().isEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage("Password must be a string")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Length of the password must be between 6 and 20 characters");
exports.usersEmailValidator = (0, express_validator_1.body)("email")
    .not().isEmpty()
    .withMessage('Email address is required')
    .isString()
    .withMessage("Email must be a string")
    .trim()
    .isEmail()
    .withMessage("Incorrect email address provided");
