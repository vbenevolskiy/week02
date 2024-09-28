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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_validator_1 = require("../validators/blogs-validator");
const validation_results_1 = require("../validators/validation-results");
const auth_1 = require("../validators/auth");
const blogs_repository_1 = require("../repositories/blogs-repository");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogs_repository_1.blogsRepository.getAllBlogs();
    res.status(200).json(result);
}));
exports.blogsRouter.post('/', auth_1.authMiddleware, blogs_validator_1.blogNameValidator, blogs_validator_1.blogDescriptionValidator, blogs_validator_1.blogWebsiteURLValidator, validation_results_1.checkValidationResults, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogs_repository_1.blogsRepository.createBlog(req);
    return res.status(201).json(result);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogs_repository_1.blogsRepository.getBlogById(Number(req.params.id));
    if (result)
        res.status(200).json(result);
    else
        res.sendStatus(404);
}));
exports.blogsRouter.put('/:id', auth_1.authMiddleware, blogs_validator_1.blogNameValidator, blogs_validator_1.blogDescriptionValidator, blogs_validator_1.blogWebsiteURLValidator, validation_results_1.checkValidationResults, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateResult = yield blogs_repository_1.blogsRepository.updateBlog(Number(req.params.id), req);
    if (updateResult)
        res.sendStatus(204);
    else
        res.sendStatus(404);
}));
exports.blogsRouter.delete('/:id', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteResult = yield blogs_repository_1.blogsRepository.deleteBlog(Number(req.params.id));
    if (deleteResult)
        res.sendStatus(204);
    else
        res.sendStatus(404);
}));
