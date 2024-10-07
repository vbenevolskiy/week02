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
exports.blogsRepo = void 0;
const db_1 = require("../../db");
const settings_1 = require("../../settings");
const blogs_mappers_1 = require("../blogs-mappers");
exports.blogsRepo = {
    blogs: db_1.dbClient.db(db_1.dbName).collection(settings_1.SETTINGS.COLLECTIONS.BLOGS),
    isValidBlogId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepo.blogs.findOne({ _id: id });
        return !!dbResult;
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepo.blogs.findOne({ _id: id });
        return dbResult ? (0, blogs_mappers_1.blogDBToBlogViewMapper)(dbResult) : null;
    }),
    getBlogNameById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepo.blogs.findOne({ _id: id });
        return dbResult ? dbResult.name : "";
    }),
    createBlog: (blog) => __awaiter(void 0, void 0, void 0, function* () {
        const insertResult = yield exports.blogsRepo.blogs.insertOne(blog);
        return insertResult.insertedId;
    }),
    updateBlog: (id, blog) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepo.blogs.updateOne({ _id: id }, { $set: blog });
        return dbResult.matchedCount === 1;
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepo.blogs.deleteOne({ _id: id });
        return dbResult.deletedCount === 1;
    })
};
