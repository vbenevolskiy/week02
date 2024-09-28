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
exports.postsRepository = void 0;
const blogs_repository_1 = require("./blogs-repository");
exports.postsRepository = {
    posts: [],
    getAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        return exports.postsRepository.posts.map(p => {
            return {
                id: p.id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId.toString(),
                blogName: p.blogName,
                createdAt: p.createdAt,
            };
        });
    }),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const foundPost = exports.postsRepository.posts.find(p => p.id === id);
        if (foundPost) {
            return {
                id: foundPost.id.toString(),
                title: foundPost.title,
                shortDescription: foundPost.shortDescription,
                content: foundPost.content,
                blogId: foundPost.blogId.toString(),
                blogName: foundPost.blogName,
                createdAt: foundPost.createdAt,
            };
        }
    }),
    createPost: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        const newPost = {
            id: Number(now),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: Number(req.body.blogId),
            blogName: yield blogs_repository_1.blogsRepository.getBlogNameById(Number(req.body.blogId)),
            createdAt: now.toISOString(),
        };
        exports.postsRepository.posts.push(newPost);
        return {
            id: newPost.id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId.toString(),
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        };
    }),
    updatePost: (id, req) => __awaiter(void 0, void 0, void 0, function* () {
        const foundPost = exports.postsRepository.posts.find(p => p.id === id);
        if (foundPost) {
            if (req.body.title)
                foundPost.title = req.body.title;
            if (req.body.shortDescription)
                foundPost.shortDescription = req.body.shortDescription;
            if (req.body.content)
                foundPost.content = req.body.content;
            if (req.body.blogId)
                foundPost.blogId = Number(req.body.blogId);
            return true;
        }
        return false;
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < exports.postsRepository.posts.length; i++) {
            if (exports.postsRepository.posts[i].id === id) {
                exports.postsRepository.posts.splice(i, 1);
                return true;
            }
        }
        return false;
    })
};
