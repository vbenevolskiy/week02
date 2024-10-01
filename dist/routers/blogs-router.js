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
const blogs_service_1 = require("../services/blogs-service");
const blogs_middleware_1 = require("../middleware/blogs-middleware");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogs_service_1.blogsService.getAllBlogs();
    res.status(200).json(result);
}));
exports.blogsRouter.post('/', blogs_middleware_1.blogsPostMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogs_service_1.blogsService.createBlog(req);
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
    const updateResult = yield blogs_service_1.blogsService.updateBlog(req.params.id, req);
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
