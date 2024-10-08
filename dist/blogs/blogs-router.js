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
const blogs_service_1 = require("./blogs-service");
const blogs_middleware_1 = require("./blogs-middleware/blogs-middleware");
const posts_service_1 = require("../posts/posts-service");
const posts_middleware_1 = require("../posts/posts-middleware/posts-middleware");
const blogs_query_repo_1 = require("./blogs-repositories/blogs-query-repo");
const posts_query_repo_1 = require("../posts/posts-repositories/posts-query-repo");
const mongodb_1 = require("mongodb");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', blogs_middleware_1.blogsGetMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qOptions = {
        //@ts-ignore
        sortBy: req.query.sortBy,
        //@ts-ignore
        sortDirection: req.query.sortDirection,
        //@ts-ignore
        pageNumber: req.query.pageNumber,
        //@ts-ignore
        pageSize: req.query.pageSize,
        //@ts-ignore
        searchNameTerm: req.query.searchNameTerm
    };
    const totalCount = yield blogs_query_repo_1.blogsQueryRepo.getTotalCount(qOptions);
    const paginator = {
        pagesCount: Math.ceil(totalCount / qOptions.pageSize),
        page: qOptions.pageNumber,
        pageSize: qOptions.pageSize,
        totalCount: totalCount,
        items: yield blogs_query_repo_1.blogsQueryRepo.getAllBlogs(qOptions)
    };
    res.status(200).json(paginator);
}));
exports.blogsRouter.get('/:id/posts', posts_middleware_1.postsGetMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qOptions = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        blogId: req.params.id
    };
    if (!(yield blogs_query_repo_1.blogsQueryRepo.isValidBlogID(new mongodb_1.ObjectId(req.params.id))))
        return res.sendStatus(404);
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
exports.blogsRouter.post('/', blogs_middleware_1.blogsPostMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    };
    const result = yield blogs_service_1.blogsService.createBlog(newBlog);
    return res.status(201).json(result);
}));
exports.blogsRouter.post('/:id/posts', posts_middleware_1.postsPostMiddlewareWithoutBlogID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.blogId = req.params.id;
    if (!(yield blogs_service_1.blogsService.isValidBlogId(req.params.id)))
        return res.sendStatus(404);
    const newPost = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    };
    const result = yield posts_service_1.postsService.createPost(newPost);
    return res.status(201).json(result);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogs_service_1.blogsService.getBlogById(req.params.id);
    if (result)
        res.status(200).json(result);
    else
        res.sendStatus(404);
}));
exports.blogsRouter.put('/:id', blogs_middleware_1.blogsPutMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    };
    const updateResult = yield blogs_service_1.blogsService.updateBlog(req.params.id, newBlog);
    if (updateResult)
        res.sendStatus(204);
    else
        res.sendStatus(404);
}));
exports.blogsRouter.delete('/:id', blogs_middleware_1.blogsDeleteMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteResult = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
    if (deleteResult)
        res.sendStatus(204);
    else
        res.sendStatus(404);
}));
