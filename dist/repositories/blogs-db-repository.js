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
exports.blogsRepository = void 0;
const db_1 = require("./db");
exports.blogsRepository = {
    blogs: db_1.dbClient.db(db_1.dbName).collection("blogs"),
    isValidBlogId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepository.blogs.findOne({ id: id });
        return !!dbResult;
    }),
    getBlogNameById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepository.blogs.findOne({ id: id });
        if (dbResult)
            return dbResult.name;
        else
            return "";
    }),
    getAllBlogs: () => __awaiter(void 0, void 0, void 0, function* () {
        return exports.blogsRepository.blogs.find({}).toArray();
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield exports.blogsRepository.blogs.findOne({ id: id });
    }),
    createBlog: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        const min = Math.ceil(12);
        const max = Math.floor(97);
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        const newBlog = {
            id: Number(now).toString() + rand.toString(),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: now.toISOString(),
            isMembership: false
        };
        yield exports.blogsRepository.blogs.insertOne(newBlog);
        console.log(newBlog);
        return newBlog;
    }),
    updateBlog: (id, req) => __awaiter(void 0, void 0, void 0, function* () {
        const newValues = { $set: { name: req.body.name, description: req.body.description, websiteUrl: req.body.websiteUrl } };
        const dbResult = yield exports.blogsRepository.blogs.updateOne({ id: id }, newValues);
        return dbResult.matchedCount === 1;
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepository.blogs.deleteOne({ id: id });
        return dbResult.deletedCount === 1;
    })
};
