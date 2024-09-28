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
exports.blogsRepository = {
    blogs: [],
    isValidBlogId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield exports.blogsRepository.getBlogById(id);
        if (!result)
            return false;
        else
            return true;
    }),
    getBlogNameById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        return ((_a = exports.blogsRepository.blogs.find(b => b.id === id)) === null || _a === void 0 ? void 0 : _a.name) || "";
    }),
    getAllBlogs: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = exports.blogsRepository.blogs.map(b => {
            return {
                id: b.id.toString(),
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt,
                isMembership: b.isMembership
            };
        });
        console.log(result);
        return result;
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const foundBlog = exports.blogsRepository.blogs.find(b => b.id === id);
        if (foundBlog) {
            return {
                id: foundBlog.id.toString(),
                name: foundBlog.name,
                description: foundBlog.description,
                websiteUrl: foundBlog.websiteUrl,
                createdAt: foundBlog.createdAt,
                isMembership: foundBlog.isMembership
            };
        }
    }),
    createBlog: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        const newBlog = {
            id: Number(now),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: now.toISOString(),
            isMembership: false
        };
        exports.blogsRepository.blogs.push(newBlog);
        return {
            id: newBlog.id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        };
    }),
    updateBlog: (id, req) => __awaiter(void 0, void 0, void 0, function* () {
        const foundBlog = exports.blogsRepository.blogs.find(b => b.id === id);
        if (foundBlog) {
            if (req.body.name)
                foundBlog.name = req.body.name;
            if (req.body.description)
                foundBlog.description = req.body.description;
            if (req.body.websiteUrl)
                foundBlog.websiteUrl = req.body.websiteUrl;
            return true;
        }
        return false;
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < exports.blogsRepository.blogs.length; i++) {
            if (exports.blogsRepository.blogs[i].id === id) {
                exports.blogsRepository.blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    })
};
