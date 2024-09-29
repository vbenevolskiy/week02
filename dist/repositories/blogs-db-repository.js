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
const mongodb_1 = require("mongodb");
exports.blogsRepository = {
    blogs: db_1.dbClient.db(db_1.dbName).collection("blogs"),
    db2View: (el) => {
        return {
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        };
    },
    isValidBlogId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepository.blogs.findOne({ _id: new mongodb_1.ObjectId(id) });
        return !!dbResult;
    }),
    getBlogNameById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepository.blogs.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (dbResult)
            return dbResult.name;
        else
            return "";
    }),
    getAllBlogs: () => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepository.blogs.find({}).toArray();
        return dbResult.map(el => exports.blogsRepository.db2View(el));
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepository.blogs.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (dbResult)
            return exports.blogsRepository.db2View(dbResult);
        return null;
    }),
    createBlog: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const newBlog = Object.assign({ _id: new mongodb_1.ObjectId(), createdAt: (new Date()).toISOString(), isMembership: false }, req.body);
        const res = yield exports.blogsRepository.blogs.insertOne(newBlog);
        const dbResult = yield exports.blogsRepository.blogs.findOne({ _id: res.insertedId });
        return exports.blogsRepository.db2View(dbResult);
    }),
    updateBlog: (id, req) => __awaiter(void 0, void 0, void 0, function* () {
        const newValues = { $set: { name: req.body.name, description: req.body.description, websiteUrl: req.body.websiteUrl } };
        const dbResult = yield exports.blogsRepository.blogs.updateOne({ _id: new mongodb_1.ObjectId(id) }, newValues);
        return dbResult.matchedCount === 1;
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsRepository.blogs.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return dbResult.deletedCount === 1;
    })
};
