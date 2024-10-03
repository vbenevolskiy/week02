import {config} from 'dotenv'

config()

export const SETTINGS = {
    PORT: process.env.PORT || 5000,
    PATH: {
        BLOGS: '/hometask_04/api/blogs',
        POSTS: '/hometask_04/api/posts',
        TESTING: '/hometask_04/api/testing/all-data',
    },
    COLLECTIONS: {
        BLOGS: 'blogs',
        POSTS: 'posts'
    },
    ADMIN_AUTH: 'admin:qwerty',
//    MONGO_URI: 'mongodb://localhost:27017',
    MONGO_URI: 'mongodb+srv://vvb:q123Q123!!@vbcluster.y0j19.mongodb.net/?retryWrites=true&w=majority&appName=vbcluster',
    DB_NAME: 'snet'
}