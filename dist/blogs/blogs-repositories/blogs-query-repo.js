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
exports.blogsQueryRepo = void 0;
const db_1 = require("../../db");
const settings_1 = require("../../settings");
const blogs_mappers_1 = require("../blogs-mappers");
exports.blogsQueryRepo = {
    blogs: db_1.dbClient.db(db_1.dbName).collection(settings_1.SETTINGS.COLLECTIONS.BLOGS),
    searchFilterFactory: (qOptions) => {
        if (!qOptions.searchNameTerm)
            return {};
        return { name: { '$regex': qOptions.searchNameTerm, '$options': 'i' } };
    },
    sortFilterFactory: (qOptions) => {
        return qOptions.sortDirection === 'desc' ? { [qOptions.sortBy]: -1 } : { [qOptions.sortBy]: 1 };
    },
    isValidBlogID: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsQueryRepo.blogs.findOne({ _id: id });
        return !!dbResult;
    }),
    getTotalCount: (qOptions) => __awaiter(void 0, void 0, void 0, function* () {
        return exports.blogsQueryRepo
            .blogs
            .countDocuments(exports.blogsQueryRepo.searchFilterFactory(qOptions));
    }),
    getAllBlogs: (qOptions) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.blogsQueryRepo
            .blogs
            .find(exports.blogsQueryRepo.searchFilterFactory(qOptions))
            .sort(exports.blogsQueryRepo.sortFilterFactory(qOptions))
            .skip((qOptions.pageNumber - 1) * qOptions.pageSize)
            .limit(qOptions.pageSize)
            .toArray();
        return dbResult.map(value => (0, blogs_mappers_1.blogDBToBlogViewMapper)(value));
    })
};
