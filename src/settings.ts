import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 5000,
    PATH: {
        BLOGS: '/ht_02/api/blogs',
        POSTS: '/ht_02/api/posts',
        TESTING: '/ht_02/api/testing/all-data',
    },
    ADMIN_AUTH: 'admin:qwerty'
}