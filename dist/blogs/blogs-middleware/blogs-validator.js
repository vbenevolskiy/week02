"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogWebsiteURLValidator = exports.blogDescriptionValidator = exports.blogNameValidator = exports.blogsQuerySearchNameTerm = exports.blogsQueryPageSize = exports.blogsQueryPageNumber = exports.blogsQuerySortDirection = exports.blogsQuerySortBy = void 0;
const express_validator_1 = require("express-validator");
exports.blogsQuerySortBy = (0, express_validator_1.query)("sortBy")
    .customSanitizer(value => value ? value : 'createdAt');
exports.blogsQuerySortDirection = (0, express_validator_1.query)("sortDirection")
    .customSanitizer(value => value === 'asc' ? 'asc' : 'desc');
exports.blogsQueryPageNumber = (0, express_validator_1.query)("pageNumber")
    .customSanitizer(value => value ? Number(value) : 1);
exports.blogsQueryPageSize = (0, express_validator_1.query)("pageSize")
    .customSanitizer(value => value ? Number(value) : 10);
exports.blogsQuerySearchNameTerm = (0, express_validator_1.query)("searchNameTerm")
    .customSanitizer(value => value ? value : null);
exports.blogNameValidator = (0, express_validator_1.body)("name")
    .not().isEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage("Blog name must be a string")
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage("Length of the blog name must be between 1 and 15 characters");
exports.blogDescriptionValidator = (0, express_validator_1.body)("description")
    .not().isEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Blog description must be a string")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Length of the blog description must be between 1 and 500 characters");
exports.blogWebsiteURLValidator = (0, express_validator_1.body)("websiteUrl")
    .not().isEmpty()
    .withMessage("WebsiteURL is required")
    .isString()
    .withMessage("WebsiteURL must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Length of the website URL must be between 1 and 100 characters")
    .isURL()
    .withMessage("Incorrect URL provided");
