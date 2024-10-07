"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsDeleteMiddleware = exports.postsPostMiddlewareWithoutBlogID = exports.postsPutMiddleware = exports.postsPostMiddleware = exports.postsGetMiddleware = void 0;
const auth_1 = require("../../common-middleware/auth");
const posts_validator_1 = require("./posts-validator");
const validation_results_1 = require("../../common-middleware/validation-results");
exports.postsGetMiddleware = [
    posts_validator_1.postsQueryPageNumber,
    posts_validator_1.postsQueryPageSize,
    posts_validator_1.postsQuerySortBy,
    posts_validator_1.postsQuerySortDirection
];
exports.postsPostMiddleware = [
    auth_1.authMiddleware,
    posts_validator_1.postTitleValidator,
    posts_validator_1.postShortDescriptionValidator,
    posts_validator_1.postContentValidator,
    posts_validator_1.postBlogIDValidator,
    validation_results_1.checkValidationResults,
];
exports.postsPutMiddleware = [
    auth_1.authMiddleware,
    posts_validator_1.postTitleValidator,
    posts_validator_1.postShortDescriptionValidator,
    posts_validator_1.postContentValidator,
    posts_validator_1.postBlogIDValidator,
    validation_results_1.checkValidationResults,
];
exports.postsPostMiddlewareWithoutBlogID = [
    auth_1.authMiddleware,
    posts_validator_1.postTitleValidator,
    posts_validator_1.postShortDescriptionValidator,
    posts_validator_1.postContentValidator,
    validation_results_1.checkValidationResults,
];
exports.postsDeleteMiddleware = [
    auth_1.authMiddleware,
];
