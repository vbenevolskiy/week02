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
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_validator_1 = require("../validators/posts-validator");
const validation_results_1 = require("../validators/validation-results");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const auth_1 = require("../validators/auth");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield posts_db_repository_1.postsRepository.getAllPosts();
    res.status(200).json(result);
}));
exports.postsRouter.post('/', auth_1.authMiddleware, posts_validator_1.postTitleValidator, posts_validator_1.postShortDescriptionValidator, posts_validator_1.postContentValidator, posts_validator_1.postBlogIDValidator, validation_results_1.checkValidationResults, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield posts_db_repository_1.postsRepository.createPost(req);
    return res.status(201).json(result);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield posts_db_repository_1.postsRepository.getPostById(req.params.id);
    if (result)
        res.status(200).json(result);
    else
        res.sendStatus(404);
}));
exports.postsRouter.put('/:id', auth_1.authMiddleware, posts_validator_1.postTitleValidator, posts_validator_1.postShortDescriptionValidator, posts_validator_1.postContentValidator, posts_validator_1.postBlogIDValidator, validation_results_1.checkValidationResults, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateResult = yield posts_db_repository_1.postsRepository.updatePost(req.params.id, req);
    if (updateResult) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.postsRouter.delete('/:id', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteResult = yield posts_db_repository_1.postsRepository.deletePost(req.params.id);
    if (deleteResult)
        res.sendStatus(204);
    else
        res.sendStatus(404);
}));
