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
exports.postsRepo = void 0;
const db_1 = require("../../db");
const settings_1 = require("../../settings");
const posts_mappers_1 = require("../posts-mappers");
exports.postsRepo = {
    posts: db_1.dbClient.db(db_1.dbName).collection(settings_1.SETTINGS.COLLECTIONS.POSTS),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsRepo.posts.findOne({ _id: id });
        return dbResult ? (0, posts_mappers_1.postDBToPostViewMapper)(dbResult) : null;
    }),
    createPost: (newPost) => __awaiter(void 0, void 0, void 0, function* () {
        const insertResult = yield exports.postsRepo.posts.insertOne(newPost);
        return insertResult.insertedId;
    }),
    updatePost: (id, post) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsRepo.posts.updateOne({ _id: id }, { $set: post });
        return dbResult.modifiedCount === 1;
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsRepo.posts.deleteOne({ _id: id });
        return dbResult.deletedCount === 1;
    })
};
