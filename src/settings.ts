import {config} from 'dotenv'

config()

export const SETTINGS = {
    PORT: process.env.PORT || 5000,
    PATH: {
        BLOGS: '/hometask_05/api/blogs',
        POSTS: '/hometask_05/api/posts',
        USERS: '/hometask_05/api/users',
        TESTING: '/hometask_05/api/testing/all-data',
        AUTH: '/hometask_05/api/auth/login'
    },
    COLLECTIONS: {
        BLOGS: 'blogs',
        POSTS: 'posts',
        USERS: 'users'
    },
    SECURITY: {
        SALT_ROUNDS: 10
    },
    ADMIN_AUTH: 'admin:qwerty',
    // MONGO_URI: 'mongodb://localhost:27017',
    MONGO_URI: 'mongodb+srv://vvb:q123Q123!!@vbcluster.y0j19.mongodb.net/?retryWrites=true&w=majority&appName=vbcluster',
    DB_NAME: 'snet'
}