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
const db_1 = require("./db");
const blogs_db_repository_1 = require("./blogs-db-repository");
exports.postsRepository = {
    posts: db_1.dbClient.db(db_1.dbName).collection("posts"),
    getAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        return exports.postsRepository.posts.find({}).toArray();
    }),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield exports.postsRepository.posts.findOne({ id: id });
    }),
    createPost: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        const min = Math.ceil(12);
        const max = Math.floor(97);
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        const newPost = {
            id: Number(now).toString() + rand.toString(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: yield blogs_db_repository_1.blogsRepository.getBlogNameById(req.body.blogId),
            createdAt: now.toISOString(),
        };
        yield exports.postsRepository.posts.insertOne(newPost);
        return newPost;
    }),
    updatePost: (id, req) => __awaiter(void 0, void 0, void 0, function* () {
        const newValues = {
            $set: { title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
                blogName: yield blogs_db_repository_1.blogsRepository.getBlogNameById(req.body.blogId)
            }
        };
        const dbResult = yield exports.postsRepository.posts.updateOne({ id: id }, newValues);
        return dbResult.matchedCount === 1;
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsRepository.posts.deleteOne({ id: id });
        return dbResult.deletedCount === 1;
    })
};
