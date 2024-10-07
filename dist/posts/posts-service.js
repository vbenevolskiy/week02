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
exports.postsService = void 0;
const posts_repo_1 = require("./posts-repositories/posts-repo");
const blogs_service_1 = require("../blogs/blogs-service");
const mongodb_1 = require("mongodb");
exports.postsService = {
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return posts_repo_1.postsRepo.getPostById(new mongodb_1.ObjectId(id));
    }),
    createPost: (post) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const blogName = yield blogs_service_1.blogsService.getBlogNameById(post.blogId);
        const newPost = {
            _id: new mongodb_1.ObjectId(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: new mongodb_1.ObjectId(post.blogId),
            blogName: blogName,
            createdAt: new Date().toISOString()
        };
        const newPostID = yield posts_repo_1.postsRepo.createPost(newPost);
        //@ts-ignore
        return posts_repo_1.postsRepo.getPostById(newPostID);
    }),
    updatePost: (id, post) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const blogName = yield blogs_service_1.blogsService.getBlogNameById(post.blogId);
        const newValues = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: new mongodb_1.ObjectId(post.blogId),
            blogName: blogName
        };
        return posts_repo_1.postsRepo.updatePost(new mongodb_1.ObjectId(id), newValues);
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return posts_repo_1.postsRepo.deletePost(new mongodb_1.ObjectId(id));
    })
};
