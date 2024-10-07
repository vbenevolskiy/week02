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
exports.postsService = void 0;
const blogs_service_1 = require("./blogs-service");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const mongodb_1 = require("mongodb");
exports.postsService = {
    postsQueryOptionsFactory: (req) => {
        const searchFilter = req.params.id ? { blogId: new mongodb_1.ObjectId(req.params.id) } : {};
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc';
        return {
            searchFilter: searchFilter,
            sortFilter: sortDirection === 'desc' ? { [sortBy]: -1 } : { [sortBy]: 1 },
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
            pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1
        };
    },
    mapDBToView: (record) => {
        return {
            id: record._id.toString(),
            title: record.title,
            shortDescription: record.shortDescription,
            content: record.content,
            blogId: record.blogId.toString(),
            blogName: record.blogName,
            createdAt: record.createdAt
        };
    },
    getAllPosts: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const postsQueryOptions = exports.postsService.postsQueryOptionsFactory(req);
        const totalCount = yield posts_db_repository_1.postsRepository.getTotalCount(postsQueryOptions.searchFilter);
        const dbResult = yield posts_db_repository_1.postsRepository.getAllPosts(postsQueryOptions);
        console.log(dbResult);
        return {
            pagesCount: Math.ceil(totalCount / postsQueryOptions.pageSize),
            page: postsQueryOptions.pageNumber,
            pageSize: postsQueryOptions.pageSize,
            totalCount: totalCount,
            items: dbResult.map(record => exports.postsService.mapDBToView(record))
        };
    }),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield posts_db_repository_1.postsRepository.getPostById(new mongodb_1.ObjectId(id));
        return dbResult ? exports.postsService.mapDBToView(dbResult) : null;
    }),
    createPost: (req) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const blogName = yield blogs_service_1.blogsService.getBlogNameById(req.body.blogId);
        const newPost = Object.assign(Object.assign({ _id: new mongodb_1.ObjectId(), blogName: blogName, createdAt: (new Date()).toISOString() }, req.body), { blogId: new mongodb_1.ObjectId(req.body.blogId) });
        const newPostID = yield posts_db_repository_1.postsRepository.createPost(newPost);
        const result = yield posts_db_repository_1.postsRepository.getPostById(newPostID);
        return exports.postsService.mapDBToView(result);
    }),
    createPostWithID: (req) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`req.body: ${req.body}`);
        console.log(`id: ${req.params.id}`);
        // @ts-ignore
        const blogName = yield blogs_service_1.blogsService.getBlogNameById(req.params.id);
        const newPost = Object.assign(Object.assign({ _id: new mongodb_1.ObjectId(), blogName: blogName, createdAt: (new Date()).toISOString() }, req.body), { blogId: new mongodb_1.ObjectId(req.params.id) });
        const newPostID = yield posts_db_repository_1.postsRepository.createPost(newPost);
        const result = yield posts_db_repository_1.postsRepository.getPostById(newPostID);
        return exports.postsService.mapDBToView(result);
    }),
    updatePost: (id, req) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const blogName = yield blogs_service_1.blogsService.getBlogNameById(req.body.blogId);
        const newValues = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: new mongodb_1.ObjectId(req.body.blogId),
            blogName: blogName
        };
        return posts_db_repository_1.postsRepository.updatePost(new mongodb_1.ObjectId(id), newValues);
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return posts_db_repository_1.postsRepository.deletePost(new mongodb_1.ObjectId(id));
    })
};
