"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // добавление переменных из файла .env в process.env
exports.SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 5000,
    PATH: {
        BLOGS: '/ht_02/api/blogs',
        POSTS: '/ht_02/api/posts',
        TESTING: '/ht_02/api/testing/all-data',
    },
    ADMIN_AUTH: 'admin:qwerty',
    DB_NAME: 'snet'
};
