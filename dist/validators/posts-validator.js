"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postBlogIDValidator = exports.postContentValidator = exports.postShortDescriptionValidator = exports.postTitleValidator = void 0;
const express_validator_1 = require("express-validator");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
exports.postTitleValidator = (0, express_validator_1.body)("title")
    .not().isEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Length of the post title must be between 1 and 30 characters");
exports.postShortDescriptionValidator = (0, express_validator_1.body)("shortDescription")
    .not().isEmpty()
    .withMessage("Short description is required")
    .isString()
    .withMessage("Short description must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Length of the short description must be between 1 and 100 characters");
exports.postContentValidator = (0, express_validator_1.body)("content")
    .not().isEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Length of the content must be between 1 and 1000 characters");
exports.postBlogIDValidator = (0, express_validator_1.body)("blogId")
    .not().isEmpty()
    .withMessage("Blog ID is required")
    .isString()
    .withMessage("Blog ID must be a string")
    .trim()
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(value);
    const result = yield blogs_db_repository_1.blogsRepository.isValidBlogId(id);
    if (!result)
        throw new Error("Blog ID is invalid");
}));
