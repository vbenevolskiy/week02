"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDBToPostViewMapper = void 0;
const postDBToPostViewMapper = (post) => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt
    };
};
exports.postDBToPostViewMapper = postDBToPostViewMapper;
