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
exports.blogsService = void 0;
const mongodb_1 = require("mongodb");
const blogs_db_repository_1 = require("../blogs-repositories/blogs-db-repository");
exports.blogsService = {
    mapDBToView: (record) => {
        return {
            id: record._id.toString(),
            name: record.name,
            description: record.description,
            websiteUrl: record.websiteUrl,
            createdAt: record.createdAt,
            isMembership: record.isMembership
        };
    },
    blogsQueryOptionsFactory: (req) => {
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc';
        const idTerm = req.params.id ? req.params.id : "";
        const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm : null;
        let filter = {};
        if (idTerm && searchNameTerm)
            filter = { name: { '$regex': searchNameTerm, '$options': 'i' }, _id: new mongodb_1.ObjectId(idTerm) };
        else if (idTerm && !searchNameTerm)
            filter = { _id: new mongodb_1.ObjectId(idTerm) };
        else if (searchNameTerm && !idTerm)
            filter = { name: { '$regex': searchNameTerm, '$options': 'i' } };
        return {
            searchFilter: filter,
            sortFilter: sortDirection === 'desc' ? { [sortBy]: -1 } : { [sortBy]: 1 },
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
            pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1
        };
    },
    isValidBlogId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield blogs_db_repository_1.blogsRepository.isValidBlogId(new mongodb_1.ObjectId(id));
    }),
    getBlogNameById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_db_repository_1.blogsRepository.getBlogNameById(new mongodb_1.ObjectId(id));
    }),
    getAllBlogs: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const blogsQueryOptions = exports.blogsService.blogsQueryOptionsFactory(req);
        const totalCount = yield blogs_db_repository_1.blogsRepository.getTotalCount(blogsQueryOptions.searchFilter);
        const dbResult = yield blogs_db_repository_1.blogsRepository.getAllBlogs(blogsQueryOptions);
        return {
            pagesCount: Math.ceil(totalCount / blogsQueryOptions.pageSize),
            page: blogsQueryOptions.pageNumber,
            pageSize: blogsQueryOptions.pageSize,
            totalCount: totalCount,
            items: dbResult.map(record => exports.blogsService.mapDBToView(record))
        };
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield blogs_db_repository_1.blogsRepository.getBlogById(new mongodb_1.ObjectId(id));
        return dbResult ? exports.blogsService.mapDBToView(dbResult) : null;
    }),
    createBlog: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const newBlog = Object.assign({ _id: new mongodb_1.ObjectId(), createdAt: (new Date()).toISOString(), isMembership: false }, req.body);
        const newBlogId = yield blogs_db_repository_1.blogsRepository.createBlog(newBlog);
        const result = yield blogs_db_repository_1.blogsRepository.getBlogById(newBlogId);
        return exports.blogsService.mapDBToView(result);
    }),
    updateBlog: (id, req) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_db_repository_1.blogsRepository.updateBlog(new mongodb_1.ObjectId(id), req.body);
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_db_repository_1.blogsRepository.deleteBlog(new mongodb_1.ObjectId(id));
    })
};
