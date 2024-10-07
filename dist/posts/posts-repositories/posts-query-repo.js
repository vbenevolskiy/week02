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
exports.postsQueryRepo = void 0;
const db_1 = require("../../db");
const settings_1 = require("../../settings");
const posts_mappers_1 = require("../posts-mappers");
exports.postsQueryRepo = {
    posts: db_1.dbClient.db(db_1.dbName).collection(settings_1.SETTINGS.COLLECTIONS.POSTS),
    searchFilterFactory: (qOptions) => {
        if (!qOptions.blogId)
            return {};
        return { blogId: qOptions.blogId };
    },
    sortFilterFactory: (qOptions) => {
        return qOptions.sortDirection === 'desc' ? { [qOptions.sortBy]: -1 } : { [qOptions.sortBy]: 1 };
    },
    getTotalCount: (qOptions) => {
        return exports.postsQueryRepo
            .posts
            .countDocuments(exports.postsQueryRepo.searchFilterFactory(qOptions));
    },
    getAllPosts: (qOptions) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.postsQueryRepo
            .posts
            .find(exports.postsQueryRepo.searchFilterFactory(qOptions))
            .sort(exports.postsQueryRepo.sortFilterFactory(qOptions))
            .skip((qOptions.pageNumber - 1) * qOptions.pageSize)
            .limit(qOptions.pageSize)
            .toArray();
        return dbResult.map(value => (0, posts_mappers_1.postDBToPostViewMapper)(value));
    })
};
