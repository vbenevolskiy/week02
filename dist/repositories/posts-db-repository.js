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
const mongodb_1 = require("mongodb");
const blogs_db_repository_1 = require("./blogs-db-repository");
exports.postsRepository = {
    posts: db_1.dbClient.db(db_1.dbName).collection("posts"),
    getAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsRepository.posts.find({}).toArray();
        return dbResult.map(el => {
            return {
                id: el._id.toString(),
                title: el.title,
                shortDescription: el.shortDescription,
                content: el.content,
                blogId: el.blogId.toString(),
                blogName: el.blogName,
                createdAt: el.createdAt
            };
        });
    }),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsRepository.posts.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (dbResult)
            return {
                id: dbResult._id.toString(),
                title: dbResult.title,
                shortDescription: dbResult.shortDescription,
                content: dbResult.content,
                blogId: dbResult.blogId.toString(),
                blogName: dbResult.blogName,
                createdAt: dbResult.createdAt
            };
        return null;
    }),
    createPost: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const newPost = {
            _id: new mongodb_1.ObjectId(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: new mongodb_1.ObjectId(req.body.blogId),
            blogName: yield blogs_db_repository_1.blogsRepository.getBlogNameById(req.body.blogId),
            createdAt: (new Date()).toISOString()
        };
        const insertResult = yield exports.postsRepository.posts.insertOne(newPost);
        const dbResult = yield exports.postsRepository.posts.findOne({ _id: insertResult.insertedId });
        return {
            id: dbResult._id.toString(),
            title: dbResult.title,
            shortDescription: dbResult.shortDescription,
            content: dbResult.content,
            blogId: dbResult.blogId.toString(),
            blogName: dbResult.blogName,
            createdAt: dbResult.createdAt
        };
    }),
    updatePost: (id, req) => __awaiter(void 0, void 0, void 0, function* () {
        const newValues = {
            $set: { title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: new mongodb_1.ObjectId(req.body.blogId),
                blogName: yield blogs_db_repository_1.blogsRepository.getBlogNameById(req.body.blogId)
            }
        };
        const dbResult = yield exports.postsRepository.posts.updateOne({ _id: new mongodb_1.ObjectId(id) }, newValues);
        return dbResult.matchedCount === 1;
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsRepository.posts.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return dbResult.deletedCount === 1;
    })
};
