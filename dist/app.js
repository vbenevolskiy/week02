"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./blogs/blogs-router");
const posts_router_1 = require("./posts/posts-router");
const testing_router_1 = require("./testing/testing-router");
const settings_1 = require("./settings");
const users_router_1 = require("./users/users-router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get("/", (req, res) => {
    res.status(200).send("APP v. 1.05");
});
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_router_1.blogsRouter);
exports.app.use(settings_1.SETTINGS.PATH.POSTS, posts_router_1.postsRouter);
exports.app.use(settings_1.SETTINGS.PATH.TESTING, testing_router_1.testingRouter);
exports.app.use(settings_1.SETTINGS.PATH.USERS, users_router_1.usersRouter);
