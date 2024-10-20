import {config} from 'dotenv'

config()

export const SETTINGS = {
   PORT: process.env.PORT || 5000,
   PATH: {
      AUTH: '/hometask_08/api/auth',
      BLOGS: '/hometask_08/api/blogs',
      COMMENTS: '/hometask_08/api/comments',
      POSTS: '/hometask_08/api/posts',
      TESTING: '/hometask_08/api/testing/all-data',
      USERS: '/hometask_08/api/users',
   },
   COLLECTIONS: {
      BLOGS: 'blogs',
      COMMENTS: 'comments',
      POSTS: 'posts',
      USERS: 'users',
      REFRESH_TOKENS: 'refreshTokens'
   },
   SECURITY: {
      SALT_ROUNDS: 10,
      JWT_SECRET_KEY: process.env.SECRET_KEY || "interstellar",
      JWT_AT_EXPIRATION_TIME: "10s",
      JWT_RT_EXPIRATION_TIME: "20s"
   },
   EMAIL: {
      ACCOUNT: 'backend.sifu@gmail.com',
      PASSWORD: 'qmpk jifn upfd konj'
   },
   ADMIN_AUTH: 'admin:qwerty',
   // MONGO_URI: 'mongodb://localhost:27017',
   MONGO_URI: 'mongodb+srv://vvb:q123Q123!!@vbcluster.y0j19.mongodb.net/?retryWrites=true&w=majority&appName=vbcluster',
   DB_NAME: 'snet'
}