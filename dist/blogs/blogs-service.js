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
exports.blogsService = void 0;
const mongodb_1 = require("mongodb");
const blogs_repo_1 = require("./blogs-repositories/blogs-repo");
exports.blogsService = {
    isValidBlogId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield blogs_repo_1.blogsRepo.isValidBlogId(new mongodb_1.ObjectId(id));
    }),
    getBlogNameById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_repo_1.blogsRepo.getBlogNameById(new mongodb_1.ObjectId(id));
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield blogs_repo_1.blogsRepo.getBlogById(new mongodb_1.ObjectId(id));
    }),
    createBlog: (blog) => __awaiter(void 0, void 0, void 0, function* () {
        const newBlog = {
            _id: new mongodb_1.ObjectId(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const newBlogId = yield blogs_repo_1.blogsRepo.createBlog(newBlog);
        //@ts-ignore
        return blogs_repo_1.blogsRepo.getBlogById(newBlogId);
    }),
    updateBlog: (id, blog) => __awaiter(void 0, void 0, void 0, function* () {
        const newBlog = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        };
        return blogs_repo_1.blogsRepo.updateBlog(new mongodb_1.ObjectId(id), newBlog);
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_repo_1.blogsRepo.deleteBlog(new mongodb_1.ObjectId(id));
    })
};
