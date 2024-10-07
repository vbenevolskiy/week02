"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogDBToBlogViewMapper = void 0;
const blogDBToBlogViewMapper = (blog) => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
};
exports.blogDBToBlogViewMapper = blogDBToBlogViewMapper;
