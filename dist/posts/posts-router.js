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
const posts_service_1 = require("./posts-service");
const posts_middleware_1 = require("./posts-middleware/posts-middleware");
const posts_query_repo_1 = require("./posts-repositories/posts-query-repo");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', posts_middleware_1.postsGetMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qOptions = {
        //@ts-ignore
        sortBy: req.query.sortBy,
        //@ts-ignore
        sortDirection: req.query.sortDirection,
        //@ts-ignore
        pageNumber: req.query.pageNumber,
        //@ts-ignore
        pageSize: req.query.pageSize,
        blogId: null
    };
    const totalCount = yield posts_query_repo_1.postsQueryRepo.getTotalCount(qOptions);
    const paginator = {
        pagesCount: Math.ceil(totalCount / qOptions.pageSize),
        page: qOptions.pageNumber,
        pageSize: qOptions.pageSize,
        totalCount: totalCount,
        items: yield posts_query_repo_1.postsQueryRepo.getAllPosts(qOptions)
    };
    res.status(200).json(paginator);
}));
exports.postsRouter.post('/', posts_middleware_1.postsPostMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    };
    const result = yield posts_service_1.postsService.createPost(newPost);
    return res.status(201).json(result);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield posts_service_1.postsService.getPostById(req.params.id);
    if (result)
        res.status(200).json(result);
    else
        res.sendStatus(404);
}));
exports.postsRouter.put('/:id', posts_middleware_1.postsPutMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newValues = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    };
    const updateResult = yield posts_service_1.postsService.updatePost(req.params.id, newValues);
    if (updateResult) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.postsRouter.delete('/:id', posts_middleware_1.postsDeleteMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteResult = yield posts_service_1.postsService.deletePost(req.params.id);
    if (deleteResult)
        res.sendStatus(204);
    else
        res.sendStatus(404);
}));
