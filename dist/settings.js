"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // добавление переменных из файла .env в process.env
exports.SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 5000,
    PATH: {
        BLOGS: '/hometask_03/api/blogs',
        POSTS: '/hometask_03/api/posts',
        TESTING: '/hometask_03/api/testing/all-data',
    },
    ADMIN_AUTH: 'admin:qwerty',
    DB_NAME: 'snet'
};
