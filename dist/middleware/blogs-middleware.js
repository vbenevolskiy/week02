"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsDeleteMiddleware = exports.blogsPutMiddleware = exports.blogsPostMiddleware = void 0;
const auth_1 = require("./auth");
const blogs_validator_1 = require("./blogs-validator");
const validation_results_1 = require("./validation-results");
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
