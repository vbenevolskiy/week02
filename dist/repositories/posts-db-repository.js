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
const settings_1 = require("../settings");
exports.postsRepository = {
    posts: db_1.dbClient.db(db_1.dbName).collection(settings_1.SETTINGS.COLLECTIONS.POSTS),
    getAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        return exports.postsRepository.posts.find({}).toArray();
    }),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return exports.postsRepository.posts.findOne({ _id: id });
    }),
    createPost: (newPost) => __awaiter(void 0, void 0, void 0, function* () {
        const insertResult = yield exports.postsRepository.posts.insertOne(newPost);
        return yield insertResult.insertedId;
    }),
    updatePost: (id, post) => __awaiter(void 0, void 0, void 0, function* () {
        const newValues = { $set: { post } };
        const dbResult = yield exports.postsRepository.posts.updateOne({ _id: id }, newValues);
        return dbResult.matchedCount === 1;
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsRepository.posts.deleteOne({ _id: id });
        return dbResult.deletedCount === 1;
    })
};
