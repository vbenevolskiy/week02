"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsDeleteMiddleware = exports.blogsPutMiddleware = exports.blogsPostMiddleware = exports.blogsGetMiddleware = void 0;
const auth_1 = require("../../common-middleware/auth");
const blogs_validator_1 = require("./blogs-validator");
const validation_results_1 = require("../../common-middleware/validation-results");
exports.blogsGetMiddleware = [
    blogs_validator_1.blogsQueryPageSize,
    blogs_validator_1.blogsQueryPageNumber,
    blogs_validator_1.blogsQuerySortBy,
    blogs_validator_1.blogsQuerySortDirection,
    blogs_validator_1.blogsQuerySearchNameTerm
];
exports.blogsPostMiddleware = [
    auth_1.authMiddleware,
    blogs_validator_1.blogNameValidator,
    blogs_validator_1.blogDescriptionValidator,
    blogs_validator_1.blogWebsiteURLValidator,
    validation_results_1.checkValidationResults,
];
exports.blogsPutMiddleware = [
    auth_1.authMiddleware,
    blogs_validator_1.blogNameValidator,
    blogs_validator_1.blogDescriptionValidator,
    blogs_validator_1.blogWebsiteURLValidator,
    validation_results_1.checkValidationResults,
];
exports.blogsDeleteMiddleware = [
    auth_1.authMiddleware,
];
